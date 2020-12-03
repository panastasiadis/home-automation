class Sensor {
  constructor(mqttTopic, mqttPayload) {
    this.topic = mqttTopic;
    const splittedStr = this.topic.split("/");
    this.room = splittedStr[0];
    this.deviceId = splittedStr[1];
    this.type = splittedStr[2];
    this.payload = mqttPayload;
  }

  convertToMongoEntry() {
    if (this.type === "temperature" || this.type === "humidity") {
      const startTime = getFixedDate(0, 0);
      const endTime = getFixedDate(59, 59);
      const nowDate = getFixedDate();

      const value = parseFloat(this.payload);

      const query = {
        deviceId: this.deviceId,
        room: this.room,
        startTime: startTime,
        endTime: endTime,
      };

      let update;
      if (this.type === "temperature") {
        update = {
          $push: {
            measurements: { temperature: value, timestamp: nowDate },
          },
          $inc: { measurement_counter: 1, measurement_sum: value },
        };
      } else { //humidity
        update = {
          $push: {
            measurements: { humidity:value, timestamp: nowDate },
          },
          $inc: { measurement_counter: 1, measurement_sum: value },
        };
      }

      return { query, update };
    }
  }
}

//get current hour of today but specify minutes and seconds
const getFixedDate = (minutes, seconds) => {
  const date = new Date();

  if (minutes === undefined) {
    minutes = date.getMinutes();
  }

  if (seconds === undefined) {
    seconds = date.getSeconds();
  }

  const localDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      minutes,
      seconds
    )
  );

  return localDate;
};

module.exports = Sensor;
