const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const db = require("./db");
const Sensor = require("./sensor");
const port = 1883;


class MqttBroker {
  constructor() {
    this.activeSensors = [];

  }

  connect() {
    server.listen(port, function () {
      console.log("Broker: mqtt server started and listening on port ", port);
    });

    aedes.on("clientReady", function (client) {
      console.log(
        "Broker: Client Connected: \x1b[33m" +
          (client ? client.id : client) +
          "\x1b[0m"
      );
    });

    aedes.on("clientDisconnect", function (client) {
      let index;
      const arrayEl = this.activeSensors.find((element, idx) => {
        if (element.client_id === client.id) {
          index = idx;
          return element;
        }
      });

      for (const sub of arrayEl.pub_protocols) {
        console.log(sub);
        aedes.unsubscribe(sub, deliverFunc);
      }

      this.activeSensors.splice(index, 1);

      console.log(
        "Broker: Client Disconnected: \x1b[31m" +
          (client ? client.id : client) +
          "\x1b[0m"
      );
    });

    //when an mqtt client subscribes
    aedes.on("subscribe", (subscriptions, client) => {
      const subs = subscriptions.map((s) => s.topic);

      const device = this.activeSensors.find((element) => {
        if (element.client_id === client.id) {
          return element;
        }
      });

      if (device) {
        device.sub_protocols = subs;
      }

      for (const subTopic of subs) {
        const sensor = new Sensor(subTopic);
        db.storeSensorData(sensor);
      }

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

    aedes.subscribe("devices/+/+", (packet, cb) => {
      const msg = packet.payload.toString();
      if (msg !== "offline") {
        // get topic name and client id from the topic string
        const topicStr = packet.topic.toString();
        const substr = topicStr.substring(topicStr.indexOf("/") + 1);
        const splittedStr = substr.split("/");

        const roomFromTopic = splittedStr[0];
        const idFromTopic = splittedStr[1];

        //get and parse the device info that is included in the message
        let sensorNodeEntry = JSON.parse(msg);
        // console.log(sensorNodeEntry);

        sensorNodeEntry.client_id = idFromTopic;
        sensorNodeEntry.room_name = roomFromTopic;
        sensorNodeEntry.last_time_active = "now";
        this.activeSensors.push(sensorNodeEntry);

        const pub_protocols = sensorNodeEntry.pub_protocols;

        for (const protocol of pub_protocols) {
          aedes.subscribe(protocol, deliverFunc);
        }
        cb();
      }
    });
  }

  publishMessage(topic, message) {
    aedes.publish({
      cmd: "publish",
      qos: 2,
      topic: topic,
      payload: message,
      retain: false,
    });
  }
}

function deliverFunc(packet, cb) {
  const sensor = new Sensor(packet.topic.toString(), packet.payload.toString());
  db.storeSensorData(sensor);
  console.log(sensor.payload, sensor.topic);

  cb();
}

module.exports = { MqttBroker };
