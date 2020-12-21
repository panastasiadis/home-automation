import  { useEffect, useState } from "react";
import mqttService from "./MQTT";

const useMessageMQTT = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const client = mqttService.getClient();

    const messageHandler = (client, topic, payload) => {};

    mqttService.onMessage(client, (topic, payload) =>
      messageHandler(client, topic, payload)
    );
  }, []);
};

export default useMessageMQTT;
