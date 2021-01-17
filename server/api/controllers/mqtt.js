const Room = require("../models/models").Room;
const SensorModel = require("../models/models").Sensor;
const Measurement = require("../models/models").Measurement;

const handleDisconnectedDevice = async (roomName, deviceId) => {
  const roomDoc = await Room.findById(roomName);
  const device = roomDoc.devices.id(deviceId);

  const topicsToUnsub = [];
  device.sensors.forEach((sensor) => {
    if (sensor.subTopic) {
      topicsToUnsub.push(sensor.subTopic);
      // aedes.unsubscribe(sensor.subTopic, deliverFunc);
    }
  });

  await roomDoc.save();
  return topicsToUnsub;
};

const storeDevice = async (roomName, deviceId, sensors) => {
  //find if room exists
  let roomDoc = await Room.findById(roomName);

  //if not, create a new room entry in database
  if (!roomDoc) {
    roomDoc = new Room({
      _id: roomName,
    });
  }

  //add new device to room document
  //if exists nothing will be added(addToSet feature)
  roomDoc.devices.addToSet({ _id: deviceId });

  //access the device
  const device = roomDoc.devices.id(deviceId);
  // device.status = "connected";

  //construct the prefix for the sensor topics based on room-name and device-id
  const topicPrefix = roomName + "/" + deviceId + "/";

  //save the document
  storeDeviceSensors(device, sensors, topicPrefix);

  await roomDoc.save();
};

const storeDeviceSensors = (deviceSubDoc, sensors, topicPrefix) => {

  let sensorToStore;
  deviceSubDoc.sensors = [];
  for (const sensor of sensors) {
    if (sensor.type === "relay") {
      topicToSub = topicPrefix + sensor.type + "-state" + "/" + sensor.name;
      sensorToStore = new SensorModel.relay({
        commandTopic: topicPrefix + sensor.type + "/" + sensor.name,
        _id: sensor.name,
        subTopic: topicToSub,
      });
    } else if (sensor.type === "temperature-humidity") {
      topicToSub = topicPrefix + sensor.type + "/" + sensor.name;

      sensorToStore = new SensorModel.temperatureHumidity({
        _id: sensor.name,
        subTopic: topicToSub,
      });
    }

    deviceSubDoc.sensors.push(sensorToStore);

  }
};

const storeSensorData = async (roomName, deviceId, sensorId, payload) => {
  const roomDoc = await Room.findById(roomName);
  const device = roomDoc.devices.id(deviceId);

  sensor = device.sensors.find((sensor) => sensorId === sensor._id);

  if (sensor.sensorType === "Temperature-Humidity") {
    const splitStr = payload.split("-");
    currentMeasurement = {
      temperature: splitStr[0],
      humidity: splitStr[1],
      timestamp: getFixedDate(),
    };

    sensor.currentMeasurement = currentMeasurement;
    const query = {
      sensorId: sensor._id,
      startTime: getFixedDate(0, 0),
      endTime: getFixedDate(59, 59),
    };

    const update = {
      $push: {
        measurements: currentMeasurement,
      },
      $inc: {
        measurementsCounter: 1,
        temperaturesSum: splitStr[0],
        humiditiesSum: splitStr[1],
      },
    };
    await roomDoc.save();

    await Measurement.findOneAndUpdate(query, update, {
      upsert: true,
      new: true,
    });
  } else if (sensor.sensorType === "Relay") {
    sensor.currentState = payload;
    await roomDoc.save();
  }
};


//helper function to get a timestamp with your local GMT offset
const getFixedDate = (seconds, minutes, hours, day, month, year) => {
  const date = new Date();
  if (year === undefined) {
    year = date.getFullYear();
  }
  if (month === undefined) {
    month = date.getMonth();
  }
  if (day === undefined) {
    day = date.getDay();
  }

  if (hours === undefined) {
    hours = date.getHours();
  }

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
      hours,
      minutes,
      seconds
    )
  );

  return localDate;
};

module.exports = {storeDevice, storeSensorData, handleDisconnectedDevice};

