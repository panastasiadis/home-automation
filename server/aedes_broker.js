const { query } = require("express");

const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const mqtt = require("./api/controllers/mqtt");
const port = 1883;

activeSensors = [];

const connect = () => {
  server.listen(port, function () {
    console.log(
      "Broker: Aedes MQTT Server started and listening on port ",
      port
    );
  });

  aedes.on("clientReady", function (client) {
    console.log(
      "Broker: Client Connected: \x1b[33m" +
        (client ? client.id : client) +
        "\x1b[0m"
    );
  });

  //triggered when a client is disconnected from the broker
  aedes.on("clientDisconnect", function (client) {
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
    const device = activeSensors.find((element) => {
      if (element.client_id === client.id) {
        return element;
      }
    });

    if (device) {
      device.sub_protocols = subs;
    }

    //log to console the client subscriptions
    console.log(
      "Broker: MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m subscribed to topics: " +
        subscriptions.map((s) => s.topic).join(",")
    );
  });

  aedes.on("unsubscribe", function (subscriptions, client) {
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
      payloadObject.deviceId = nodeInfo.deviceId;
      payloadObject.room = nodeInfo.room;
      //payloadObject.status = "connected";
      payloadObject.subTopics = [];
      activeSensors.push(payloadObject);

      mqtt
        .storeDevice(nodeInfo.room, nodeInfo.deviceId, payloadObject.sensors)
        .then(() => {
          const topicPrefix = nodeInfo.room + "/" + nodeInfo.deviceId + "/";

          for (const sensor of payloadObject.sensors) {
            if (sensor.type === "relay") {
              topicToSub =
                topicPrefix + sensor.type + "-state" + "/" + sensor.name;
            } else {
              topicToSub = topicPrefix + sensor.type + "/" + sensor.name;
            }
            aedes.subscribe(topicToSub, deliverFunc);
            payloadObject.subTopics.push(topicToSub);
          }
        });
    } else {
      const inactiveSensorIdx = activeSensors.findIndex((item) => {
        item.deviceId = nodeInfo.deviceId;
      });

      activeSensors.splice(inactiveSensorIdx, 1);
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

module.exports = { publishMessage, connect, activeSensors };
