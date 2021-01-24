import mqtt from "mqtt";
import { backendApiUrl } from "./Config";

const websocketUrl = backendApiUrl.ws;
const clientId = "mqttjs_brower_" + Math.random().toString(16).substr(2, 4);
let client;

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

const initClient = (errorHandler) => {
  client = mqtt.connect(websocketUrl, options);

  client.subscribe("browser");

  client.on("error", (err) => {
    console.log(`Connection to ${websocketUrl} failed`, err);
    client.end();
  });

  client.on("close", () => {
    console.log(clientId + " disconnected");
  });
  return client;
};

const getClient = () => {
  if (!client) {
    initClient();
  }
  return client;
}

const onMessage = (client, callBack) => {
  client.on("message", (topic, message, packet) => {
    console.log(message.toString(), topic);
    
    callBack(client, topic, message);
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
  client = undefined;
};

const extractMqttTopicInfo = (mqttTopic) => {
  const splitStr = mqttTopic.split("/");

  const [room, deviceId, type, sensorName] = splitStr;

  return {
    room,
    deviceId,
    type,
    sensorName,
  };
};

const mqttService = {
  getClient,
  publishMessage,
  subscribe,
  onMessage,
  unsubscribe,
  closeConnection,
  extractMqttTopicInfo
};

export default mqttService;
