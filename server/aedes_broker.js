const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const db = require("./db");
const port = 1883;

let activeSensors = [];

class MqttBroker {
  constructor() {}

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
      const query = {
        client_id: client.id,
      };

      const update = {
        $set: {
          active: new Date()
        },
      };

      db.getDb()
        .collection("devices")
        .updateOne(query, update)
        .then((result) => {
          console.log("Add last time active option");
        })
        .catch((err) => {
          if (err) {
            throw err;
          }
        });

      console.log(
        "Broker: Client Disconnected: \x1b[31m" +
          (client ? client.id : client) +
          "\x1b[0m"
      );
    });

    //when an mqtt client subscribes
    aedes.on("subscribe", (subscriptions, client) => {
      // console.log(client);
      console.log(client.id);
      const subs = subscriptions.map((s) => s.topic);

      db.getDb()
        .collection("devices")
        .updateOne({ client_id: client.id }, { $set: { sub_protocols: subs } })
        .then((result) => {
          console.log("Subs added");
        })
        .catch((err) => {
          console.log(err);
        });

      //print []
      console.log(
        "Broker: MQTT client \x1b[32m" +
          (client ? client.id : client) +
          "\x1b[0m subscribed to topics: " +
          subscriptions.map((s) => s.topic).join(",")
      );

      // sensorNode.subs = subscriptions.map((s) => s.topic);
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
        console.log(sensorNodeEntry);

        //add the topic prefix to the topic endpoints
        sensorNodeEntry.pub_protocols.forEach((element, idx, array) => {
          array[idx] = "home/" + roomFromTopic + "/" + element;
        });

        const pub_protocols = sensorNodeEntry.pub_protocols;

        const query = {
          client_id: idFromTopic,
        };

        const update = {
          $set: {
            room_name: roomFromTopic,
            active: "now",
            pub_protocols: pub_protocols,
          },
        };

        const options = {
          upsert: true,
        };

        db.getDb()
          .collection("devices")
          .updateOne(query, update, options)
          .then((result) => {
            console.log("Document updated");
          })
          .catch((err) => {
            if (err) {
              throw err;
            }
          });
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

module.exports = { MqttBroker, aedes, activeSensors };
