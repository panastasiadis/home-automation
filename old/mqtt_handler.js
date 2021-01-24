const mqtt = require("mqtt");

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    // this.host = "mqtt://broker.mqttdashboard.com";
    this.host = "172.22.113.66";
    this.username = "YOUR_USER"; // mqtt credentials if these are needed to connect
    this.password = "YOUR_PASSWORD";
    this.clientId = "test-client";
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(
      // {port: 8883, streamBuilder: this.host, clientId: this.clientId }
      //  { username: this.username, password: this.password }
      { port: 1883, host: this.host }
    );

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`MQTT.js: mqtt client connected`);
    });

    // mqtt subscriptions
    // this.mqttClient.subscribe("home/sensors/status", { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on("message", (topic, message) => {
      console.log(message.toString());
    });

    this.mqttClient.on("close", () => {
      console.log(`MQTT.js: mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    this.mqttClient.publish(topic, message);
  }

  subscribeToTopic(topic) {
    this.mqttClient.subscribe(topic, { qos: 0 });
  }

  unsubscribeFrom(topic) {
    this.mqttClient.unsubscribe(topic);
  }
}

module.exports = MqttHandler;
