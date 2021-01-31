const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema(
  {
    sensorName: { type: String, required: true },
    deviceId: { type: String, required: true },
    sensorType: { type: String, required: true },
    roomName: { type: String, required: true },
    command: { type: String, required: true },
    commandTopic: { type: String, required: true },
    registrationDate: { type: Date, required: true },
  },
  { discriminatorKey: 'actionCategory' }
);

const locationBasedActionSchema = new mongoose.Schema({
  radius: { type: Number, required: true },
  triggered: {type: Boolean, required: false}
});

const timerActionSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  recurrenceNumber: { type: Number },
  recurrenceTimeUnit: { type: String },
});

const sensorBasedActionSchema = new mongoose.Schema({
  measurementSensorName: { type: String, required: true },
  measurementDeviceId: { type: String, required: true },
  measurementRoomName: { type: String, required: true },
  measurementSensorType: { type: String, required: true },
  commandOnFailure: {type: String, required: true},
  quantity: { type: Number, required: true },
  comparisonType: { type: String, required: true },
  measurementType: { type: String },
});

const measurementSchema = new mongoose.Schema(
  {
    sensorId: { type: String, required: true },
    deviceId: { type: String, required: true },
    roomName: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    measurementsCounter: { type: Number, default: 0, required: true },
    measurements: [
      {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
    temperaturesSum: { type: Number, default: 0, required: true },
    humiditiesSum: { type: Number, default: 0, required: true },
  },
  { versionKey: false }
);

const Action = mongoose.model('Action', actionSchema);

module.exports.Action = Action;

module.exports.LocationBasedAction = Action.discriminator(
  'Location-Based Action',
  locationBasedActionSchema
);

module.exports.SensorBasedAction = Action.discriminator(
  'Sensor-Based Action',
  sensorBasedActionSchema
);

module.exports.TimerAction = Action.discriminator(
  'Timer Action',
  timerActionSchema
);

module.exports.Measurement = mongoose.model('Measurement', measurementSchema);
module.exports.measurementSchema = measurementSchema;
