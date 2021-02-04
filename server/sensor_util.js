const { measurementSchema, Measurement } = require('./api/models/models');
const mongoose = require('mongoose');
const schedule = require('node-schedule');

const SENSOR_TYPE = {
  RELAY_LIGHTBULB: 'Lightbulb',
  RELAY_HEAT: 'Heat',
  TEMPERATURE_HUMIDITY: 'Temperature-Humidity',
  LIGHT_INTENSITY: 'Light-Intensity',
  MOTION_DETECTOR: 'Motion-Detector',
};

let activeSensors = [];

const getActiveSensors = () => {
  return [...activeSensors];
};

const storeConnectedSensors = (mqttTopic, mqttPayload) => {
  const payloadObject = JSON.parse(mqttPayload.toString());

  const deviceInfo = convertTopicToInfo(mqttTopic.toString());

  const sensors = payloadObject.sensors.map((sensorEl) => {
    sensorEl.deviceId = deviceInfo.deviceId;
    sensorEl.room = deviceInfo.room;
    const { pubTopic, commandTopic } = sensorTopicConstructor(
      sensorEl.type,
      sensorEl.name,
      sensorEl.room,
      sensorEl.deviceId
    );

    sensorEl.commandTopic = commandTopic;
    sensorEl.pubTopic = pubTopic;

    activeSensors.push(sensorEl);
    return sensorEl;
  });

  return sensors;
};

const removeDisconnectedSensors = (mqttTopic) => {
  const deviceInfo = convertTopicToInfo(mqttTopic.toString());
  const unusedTopics = [];

  activeSensors = activeSensors.filter((sensor) => {
    if (sensor.deviceId === deviceInfo.deviceId) {
      console.log(`topic to unsub from: ${sensor.pubTopic}`);
      unusedTopics.push(sensor.pubTopic);
    }
    return sensor.deviceId !== deviceInfo.deviceId;
  });

  return {
    unusedTopics: unusedTopics,
    deviceId: deviceInfo.deviceId,
  };
};

const sensorTopicConstructor = (sensorType, sensorName, roomName, deviceId) => {
  const topicPrefix = roomName + '/' + deviceId + '/';
  let commandTopic;
  let pubTopic;
  switch (sensorType) {
    case SENSOR_TYPE.RELAY_LIGHTBULB:
      pubTopic = topicPrefix + sensorType + '-state' + '/' + sensorName;
      commandTopic = topicPrefix + sensorType + '/' + sensorName;
      break;
    case SENSOR_TYPE.RELAY_HEAT:
      pubTopic = topicPrefix + sensorType + '-state' + '/' + sensorName;
      commandTopic = topicPrefix + sensorType + '/' + sensorName;
      break;
    default:
      pubTopic = topicPrefix + sensorType + '/' + sensorName;
      break;
  }

  return {
    pubTopic: pubTopic,
    commandTopic: commandTopic,
  };
};

const storeSensorData = (mqttTopic, mqttPayload) => {
  const deviceInfo = convertTopicToInfo(mqttTopic.toString());
  const sensor =
    activeSensors[
      activeSensors.findIndex(
        (sensorEl) => sensorEl.name === deviceInfo.sensorName
      )
    ];

  switch (sensor.type) {
    case SENSOR_TYPE.TEMPERATURE_HUMIDITY:
      const splitStr = mqttPayload.toString().split('-');

      const currentDate = new Date();
      const startTime = new Date(currentDate);
      const endTime = new Date(currentDate);

      sensor.currentMeasurement = {
        temperature: splitStr[0],
        humidity: splitStr[1],
        timestamp: currentDate,
      };

      if (currentDate.getMinutes() < 30) {
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        endTime.setMinutes(29);
        endTime.setSeconds(59);
        endTime.setMilliseconds(999);
      } else {
        startTime.setMinutes(30);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        endTime.setMinutes(59);
        endTime.setSeconds(59);
        endTime.setMilliseconds(999);
      }

      const query = {
        sensorId: deviceInfo.sensorName,
        deviceId: deviceInfo.deviceId,
        roomName: deviceInfo.room,
        startTime: startTime,
        endTime: endTime,
      };

      const update = {
        $push: {
          measurements: sensor.currentMeasurement,
        },
        $inc: {
          measurementsCounter: 1,
          temperaturesSum: splitStr[0],
          humiditiesSum: splitStr[1],
        },
      };

      mongoose
        .model('Measurement', measurementSchema, deviceInfo.sensorName)
        .findOneAndUpdate(query, update, {
          upsert: true,
          new: true,
        })
        .exec((err, res) => {
          if (err) {
            console.log(err);
          }
        });
      break;
    case SENSOR_TYPE.RELAY_LIGHTBULB:
      sensor.currentState = mqttPayload.toString();
      break;
    case SENSOR_TYPE.RELAY_HEAT:
      sensor.currentState = mqttPayload.toString();
      break;
    case SENSOR_TYPE.LIGHT_INTENSITY:
      sensor.lightIntensity = mqttPayload.toString();
    case SENSOR_TYPE.MOTION_DETECTOR:
      if (
        sensor.movement === 'Motion detected' &&
        mqttPayload.toString() === 'No motion detected'
      ) {
        sensor.lastDetectionTIme = new Date();
      }
      sensor.movement = mqttPayload.toString();
    default:
      break;
  }
};

const retrieveDataGeneric = (sensorName, callback) => {
  const sensor = activeSensors.find((item) => item.name === sensorName);

  switch (sensor.type) {
    case SENSOR_TYPE.TEMPERATURE_HUMIDITY:
      const currentDate = new Date();
      console.log(currentDate);

      const startTime = new Date(currentDate);
      startTime.setHours(startTime.getHours() - 1);
      startTime.setMinutes(startTime.getMinutes() - 30);
      console.log(startTime);

      retrieveTimeSensorData(sensorName, startTime, currentDate).then(
        (measurements) => {
          callback(measurements);
        }
      );
      break;
    case SENSOR_TYPE.MOTION_DETECTOR:
      measurement = retrieveSensorData(sensorName);
      const measurements = [];
      if (measurement) {
        measurements.push(measurement);
      }
      console.log(measurement, '!!!!');
      callback(measurements);
    default:
      break;
  }
};

const retrieveTimeSensorData = async (sensorName, startTime, endTime) => {
  const measurements = await mongoose
    .model('Measurement', measurementSchema, sensorName)
    .find({
      sensorId: sensorName,
      startTime: { $gt: startTime },
      endTime: { $lt: endTime },
    });

  return measurements;
};

const removeOlderThanWeekSensorData = async (sensorName) => {
  const sevenDaysAgoDate = new Date();

  sevenDaysAgoDate.setHours(sevenDaysAgoDate.getHours() - 24 * 7);
  try {
    const oldMeasurements = await mongoose
      .model('Measurement', measurementSchema, sensorName)
      .deleteMany({
        endTime: { $lt: sevenDaysAgoDate },
      });
    console.log('Succesfull deletion of older than a week data!');
  } catch (error) {
    console.log(error);
  }
};

const scheduleOldTimeDataDeletion = () => {
  const requestedRule = `0 0 */178 * * *`;

  const scheduledAction = schedule.scheduleJob(
    { start: new Date(), rule: requestedRule },
    () => {
      for (const sensor of activeSensors) {
        removeOlderThanWeekSensorData(sensor.name);
      }
    }
  );
};

const retrieveSensorData = (sensorName, option) => {
  const sensor = activeSensors.find((item) => item.name === sensorName);

  if (sensor) {
    switch (sensor.type) {
      case SENSOR_TYPE.TEMPERATURE_HUMIDITY:
        switch (option) {
          case 'Temperature (Celcius)':
            return parseFloat(sensor.currentMeasurement.temperature);
          case 'Humidity (%)':
            return parseFloat(sensor.currentMeasurement.humidity);
          default:
            return parseFloat(sensor.currentMeasurement.temperature);
        }
      case SENSOR_TYPE.LIGHT_INTENSITY:
        switch (option) {
          case 'Light Intensity (%)':
            lux = parseFloat(sensor.lightIntensity);
            percentageLux = (lux / 100) * 100;
            return percentageLux;
        }
      case SENSOR_TYPE.RELAY_LIGHTBULB:
        return sensor.currentState;
      case SENSOR_TYPE.RELAY_HEAT:
        return sensor.currentState;
      case SENSOR_TYPE.MOTION_DETECTOR:
        return sensor.lastDetectionTIme;
      default:
        break;
    }
  }
};
const convertTopicToInfo = (mqttTopic) => {
  const splitStr = mqttTopic.split('/');

  [room, deviceId, sensorType, sensorName] = splitStr;

  return {
    room,
    deviceId,
    sensorType,
    sensorName,
  };
};

module.exports = {
  scheduleOldTimeDataDeletion,
  getActiveSensors,
  storeConnectedSensors,
  removeDisconnectedSensors,
  storeSensorData,
  retrieveTimeSensorData,
  retrieveSensorData,
  retrieveDataGeneric,
};
