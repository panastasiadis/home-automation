const Room = require("../models/rooms").Room;
const SensorModel = require("../models/rooms").Sensor;
const Measurement = require("../models/rooms").Measurement;

const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

module.exports.sensorsList = (req, res) => {
    sendJsonResponse(res, 200, {"status" : "success"});
};


module.exports.sensorsByRoom = (req, res) => {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.sensorsByDevice = (req, res) => {
    sendJsonResponse(res, 200, {"status" : "success"});
};