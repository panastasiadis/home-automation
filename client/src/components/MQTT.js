import mqtt from "mqtt";

const websocketUrl = "ws://localhost:8883";
const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

var options = {
  keepalive: 30,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
  rejectUnauthorized: false,
};

const getClient = (errorHandler) => {
  const client = mqtt.connect(websocketUrl, options);

  client.on("error", (err) => {
    console.log(`Connection to ${websocketUrl} failed`);
    client.end();
  });

  client.on("error", (err) => {
    console.log(err);
    client.end();
  });

  client.on("close", () => {
    console.log(clientId + " disconnected");
  });
  return client;
};

const onMessage = (client, callBack) => {
  client.on("message", (topic, message, packet) => {
    console.log(topic);
    console.log(message.toString());

    callBack(topic, message);
  });
};

const publishMessage = (client, topic, message) => {
  client.publish(topic, message);
}

const subscribe = (client, topic) => {
  const callBack = (err, granted) => {
    if (err) {
      console.log("Subscription request failed");
    }
  };
  return client.subscribe(topic, callBack);
};

const unsubscribe = (client, topic) => {
  client.unsubscribe(topic);
};

const closeConnection = (client) => {
  client.end();
};

const mqttService = {
  getClient,
  publishMessage,
  subscribe,
  onMessage,
  unsubscribe,
  closeConnection,
};

export default mqttService;
