const aedes = require("aedes")();
const { createServer } = require('aedes-server-factory');
const server = require("net").createServer(aedes.handle);
const httpServer = createServer(aedes, { ws: true });
const mongoose = require("mongoose");

const { measurementSchema } = require("./api/models/models");
const sensor_util = require("./sensor_util");

const port = process.env.MQTT_PORT || 1883;
const wsport = process.env.WS_MQTT_PORT || 8883;

const connect = () => {

  server.listen(port, () => {
    console.log(
      "Broker: Aedes MQTT Server started and listening on port ",
      port
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

    if (msg !== "offline") {
      const sensors = sensor_util.storeConnectedSensors(
        packet.topic,
        packet.payload
      );

      infoForBrowserJSON = {
        newSensors: sensors,
        action: "connected",
      };

      publishMessage("browser", JSON.stringify(infoForBrowserJSON));

      for (const sensor of sensors) {
        aedes.subscribe(sensor.pubTopic, deliverFunc);
      }
    } else {
      const { unusedTopics, deviceId } = sensor_util.removeDisconnectedSensors(
        packet.topic,
        packet.payload
      );

      for (const topic of unusedTopics) {
        aedes.unsubscribe(topic, deliverFunc);
      }

      infoForBrowserJSON = {
        deviceId: deviceId,
        action: "disconnected",
      };

      publishMessage("browser", JSON.stringify(infoForBrowserJSON));
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
  console.log(packet.payload.toString(), packet.topic.toString());
  sensor_util.storeSensorData(packet.topic, packet.payload);

  cb();
};

module.exports = { publishMessage, connect };

