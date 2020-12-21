const { query } = require("express");

const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);

const httpServer = require("http").createServer();
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: httpServer });
const mqtt = require("./api/controllers/mqtt");
const port = 1883;
const wsport = 8883;

let activeSensors = [];

const getActiveSensors = () => {
  return [...activeSensors];
};

const connect = () => {
  wss.on("connection", (ws) => {
    const duplex = WebSocket.createWebSocketStream(ws);
    aedes.handle(duplex);
  });

  server.listen(port, () => {
    console.log(
      "Broker: Aedes MQTT Server started and listening on port ",
      wsport
    );
  });

  httpServer.listen(wsport, () => {
    console.log("WS: Start listening on port ", wsport);
  });

  aedes.on("clientReady", (client) => {
    console.log(
      "Broker: Client Connected: \x1b[33m" +
        (client ? client.id : client) +
        "\x1b[0m"
    );
  });

  aedes.on("clientError", (client, err) => {
    console.log("client error", client.id, err.message, err.stack);
  });

  aedes.on("connectionError", (client, err) => {
    console.log("client error", client, err.message, err.stack);
  });

  //triggered when a client is disconnected from the broker
  aedes.on("clientDisconnect", (client) => {
    //log to console which client was disconnected
    console.log(
      "Broker: Client Disconnected: \x1b[31m" +
        (client ? client.id : client) +
        "\x1b[0m"
    );
  });

  //when an mqtt client subscribes to a topic
  aedes.on("subscribe", (subscriptions, client) => {
    //get the subs of the client
    const subs = subscriptions.map((s) => s.topic);

    //find client in active sensors array
    // const sensor = activeSensors.find((element) => {
    //   if (element.deviceId === client.id) {
    //     return element;
    //   }
    // });

    // if (sensor) {
    //   sensor.sub_protocols = subs;
    // }

    //log to console the client subscriptions
    console.log(
      "Broker: MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m subscribed to topics: " +
        subscriptions.map((s) => s.topic).join(",")
    );
  });

  aedes.on("unsubscribe", (subscriptions, client) => {
    console.log(
      "Broker: MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m unsubscribed from topics: " +
        subscriptions.join(",")
    );
  });

  //subscribe to initial message in which all the clients should send with their info
  aedes.subscribe("+/+/device", (packet, cb) => {
    const msg = packet.payload.toString();
    const nodeInfo = convertTopicToInfo(packet.topic.toString());

    if (msg !== "offline") {
      //get and parse the device info that is included in the message
      const payloadObject = JSON.parse(msg);
      const topicPrefix = nodeInfo.room + "/" + nodeInfo.deviceId + "/";

      const sensors = payloadObject.sensors.map((sensorEl) => {
        sensorEl.deviceId = nodeInfo.deviceId;
        sensorEl.room = nodeInfo.room;
        if (sensorEl.type === "relay") {
          sensorEl.pubTopic =
            topicPrefix + sensorEl.type + "-state" + "/" + sensorEl.name;
            sensorEl.commandTopic = topicPrefix + sensorEl.type + "/" + sensorEl.name;

        } else {
          sensorEl.pubTopic = topicPrefix + sensorEl.type + "/" + sensorEl.name;
        }
        activeSensors.push(sensorEl);
        return sensorEl;
      });
      // console.log(sensors);
      // console.log(activeSensors);

      mqtt
        .storeDevice(nodeInfo.room, nodeInfo.deviceId, payloadObject.sensors)
        .then(() => {
          for (const sensor of sensors) {
            aedes.subscribe(sensor.pubTopic, deliverFunc);
          }
        });
    } else {
      activeSensors = activeSensors.filter(
        (sensor) => sensor.deviceId !== nodeInfo.deviceId
      );
      console.log(activeSensors);

      infoForBrowserJSON = {
        deviceId: nodeInfo.deviceId,
        action: "disconnected"
      }

      publishMessage("browser", JSON.stringify(infoForBrowserJSON));

      mqtt
        .handleDisconnectedDevice(nodeInfo.room, nodeInfo.deviceId)
        .then((topicsToUnsub) => {
          for (const topic of topicsToUnsub) {
            console.log(`topic to unsub from: ${topic}`);
            aedes.unsubscribe(topic, deliverFunc);
          }
        });
    }
    cb();
  });
};

const publishMessage = (topic, message) => {
  aedes.publish({
    cmd: "publish",
    qos: 2,
    topic: topic,
    payload: message,
    retain: false,
  });
};

const deliverFunc = (packet, cb) => {
  const info = convertTopicToInfo(packet.topic.toString());
  console.log(packet.payload.toString(), packet.topic.toString());
  sensor =
    activeSensors[activeSensors.findIndex((el) => el.name === info.sensorName)];

  if (sensor.type === "temperature-humidity") {
    const splitStr = packet.payload.toString().split("-");

    sensor.currentMeasurement = {
      temperature: splitStr[0],
      humidity: splitStr[1],
      // timestamp: getFixedDate(),
    };
  }

  mqtt.storeSensorData(
    info.room,
    info.deviceId,
    info.sensorName,
    packet.payload.toString()
  );

  cb();
};

const convertTopicToInfo = (mqttTopic) => {
  const splitStr = mqttTopic.split("/");

  [room, deviceId, sensorType, sensorName] = splitStr;

  return {
    room,
    deviceId,
    sensorType,
    sensorName,
  };
};

module.exports = { publishMessage, connect, getActiveSensors };
