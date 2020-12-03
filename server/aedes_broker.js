const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const db = require("./db");
const Sensor = require("./sensor");
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
      let index;
      const arrayEl = activeSensors.find((element, idx) => {
        if (element.client_id === client.id) {
          index = idx;
          return element;
        }
      });

      for (const sub of arrayEl.pub_protocols) {
        console.log(sub);
        aedes.unsubscribe(sub, deliverFunc);
      }

      activeSensors.splice(index, 1);

      // const query = {
      //   client_id: client.id,
      // };

      // const d = new Date();
      // const update = {
      //   $set: {
      //     last_time_active: d.toLocaleString()
      //   },
      // };

      // db.getDb()
      //   .collection("devices")
      //   .updateOne(query, update)
      //   .then((result) => {
      //     console.log("Mongo DB: " + client.id + " was last time active on " + d.toLocaleString());
      //   })
      //   .catch((err) => {
      //     if (err) {
      //       throw err;
      //     }
      //   });

      console.log(
        "Broker: Client Disconnected: \x1b[31m" +
          (client ? client.id : client) +
          "\x1b[0m"
      );
    });

    //when an mqtt client subscribes
    aedes.on("subscribe", (subscriptions, client) => {
      const subs = subscriptions.map((s) => s.topic);

      const device = activeSensors.find((element) => {
        if (element.client_id === client.id) {
          return element;
        }
      });

      if (device) {
        device.sub_protocols = subs;
      }

      // db.getDb()
      //   .collection("devices")
      //   .updateOne({ client_id: client.id }, { $set: { sub_protocols: subs } })
      //   .then((result) => {
      //     console.log("MongoDB: Subs of " + client.id + " were stored to DB" );
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

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
        // console.log(sensorNodeEntry);

        //add the topic prefix to the topic endpoints
        // sensorNodeEntry.pub_protocols.forEach((element, idx, array) => {
        //   array[idx] = "home/" + roomFromTopic + "/" + element;
        // });

        sensorNodeEntry.client_id = idFromTopic;
        sensorNodeEntry.room_name = roomFromTopic;
        sensorNodeEntry.last_time_active = "now";
        activeSensors.push(sensorNodeEntry);

        const pub_protocols = sensorNodeEntry.pub_protocols;

        for (const protocol of pub_protocols) {
          aedes.subscribe(protocol, deliverFunc);
        }

        // const query = {
        //   client_id: idFromTopic,
        // };

        // const update = {
        //   $set: {
        //     room_name: roomFromTopic,
        //     last_time_active: "now",
        //     pub_protocols: pub_protocols,
        //   },
        // };

        // const options = {
        //   upsert: true,
        // };

        // db.getDb()
        //   .collection("devices")
        //   .updateOne(query, update, options)
        //   .then((result) => {
        //     console.log("MongoDB: Client " + idFromTopic + " was updated");
        //   })
        //   .catch((err) => {
        //     if (err) {
        //       throw err;
        //     }
        //   });

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

  if (sensor.type === "temperature" || sensor.type === "humidity") {

    updateEntries = sensor.convertToMongoEntry();

    if (sensor.type === "temperature") {
      db.getDb().collection("temperatures").updateOne(updateEntries.query, updateEntries.update, {upsert: true});
    }
    else {
      db.getDb().collection("humidities").updateOne(updateEntries.query, updateEntries.update, {upsert: true});
    }

  }
  cb();
}

module.exports = { MqttBroker, aedes, activeSensors };
