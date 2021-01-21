const sensorTopicFormatter = (sensorType, topic) => {
  nodeInfo = convertTopicToInfo(topic);
  const topicPrefix = nodeInfo.room + "/" + nodeInfo.deviceId + "/";

  switch (sensorType) {
    case "relay":
      sensorEl.pubTopic =
        topicPrefix + sensorEl.type + "-state" + "/" + sensorEl.name;
      sensorEl.commandTopic = topicPrefix + sensorEl.type + "/" + sensorEl.name;
      break;

    default:
      sensorEl.pubTopic = topicPrefix + sensorEl.type + "/" + sensorEl.name;

      break;
  }
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
