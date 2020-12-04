class Sensor {
  constructor(mqttTopic, mqttPayload) {
    this.topic = mqttTopic;
    const splittedStr = this.topic.split("/");
    for (let i = 0; i < splittedStr.length; i++) {
      if (i === 0) {
        this.room = splittedStr[i];
      }
      else if (i === 1) {
        this.deviceId = splittedStr[i];
      }
      else if (i === 2) {
        this.type = splittedStr[i];
      }
      else {
        this.type += "/" + splittedStr[i];
      }
      
    }

    this.payload = mqttPayload;
  }
 
}

module.exports = Sensor;
