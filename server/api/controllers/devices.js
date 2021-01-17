const Room = require("../models/models").Room;
const SensorModel = require("../models/models").Sensor;
const Measurement = require("../models/models").Measurement;

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.devicesList = (req, res) => {
  sendJsonResponse(res, 200, { status: "success" });
};

module.exports.devicesByRoom = (req, res) => {
  sendJsonResponse(res, 200, { status: "success" });
};
