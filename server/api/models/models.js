const mongoose = require("mongoose");

const timerActionSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  recurrenceNumber: { type: Number },
  recurrenceTimeUnit: { type: String },
});

const sensorBasedActionSchema = new mongoose.Schema({
  measurementSensorName: { type: String, required: true },
  measurementDeviceId:  { type: String, required: true },
  measurementRoomName: { type: String, required: true },
  quantity: { type: Number, required: true },
  comparisonType: { type: String, required: true },
  measurementType: { type: String },
});

const actionSchema = new mongoose.Schema(
  {
    sensorName: { type: String, required: true },
    deviceId: { type: String, required: true },
    roomName: { type: String, required: true },
    command: { type: String, required: true },
    commandTopic: { type: String, required: true },
    registrationDate: { type: Date, required: true },
  },
  { discriminatorKey: "actionCategory" }
);

const Action = mongoose.model("Action", actionSchema);
module.exports.Action = Action;

module.exports.SensorBasedAction = Action.discriminator(
  "Sensor-Based Action",
  sensorBasedActionSchema
);

module.exports.TimerAction = Action.discriminator(
  "Timer Action",
  timerActionSchema
);

const sensorSchema = new mongoose.Schema(
  {
    _id: { type: String },
    subTopic: { type: String },
  },
  {
    discriminatorKey: "sensorType", // our discriminator key, could be anything
  }
);

const relaySchema = new mongoose.Schema(
  {
    commandTopic: { type: String, required: true },
    openCommand: { type: String, default: "ON", required: true },
    closeCommand: { type: String, default: "OFF", required: true },
    currentState: { type: String, default: "OFF" },
  },
  { _id: false }
);

const tempsHumsSchema = new mongoose.Schema(
  {
    currentMeasurement: {
      temperature: { type: Number },
      humidity: { type: Number },
      timestamp: { type: Date },
    },
  },
  { _id: false }
);

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

const deviceSchema = new mongoose.Schema({
  _id: String, //device's name
  // status: { type: String, enum: ["connected", "disconnected"], required: true },
  // timeOfDisconnection: { type: Date },
  sensors: [sensorSchema],
});

const roomSchema = new mongoose.Schema(
  {
    _id: String, //room's name
    devices: [deviceSchema],
  },
  { versionKey: false }
);

roomSchema.path("devices.sensors").discriminator("Relay", relaySchema);

roomSchema
  .path("devices.sensors")
  .discriminator("Temperature-Humidity", tempsHumsSchema);

module.exports.Measurement = mongoose.model("Measurement", measurementSchema);
module.exports.measurementSchema = measurementSchema;
module.exports.Room = mongoose.model("Room", roomSchema);
module.exports.Sensor = {
  relay: mongoose.model("Relay", relaySchema),
  temperatureHumidity: mongoose.model("Temperature-Humidity", tempsHumsSchema),
};
