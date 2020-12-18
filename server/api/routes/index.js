const express = require("express");
const router = express.Router();
const ctrlDevices = require("../controllers/devices");
const ctrlSensors = require("../controllers/sensors");
const ctrlRooms = require('../controllers/rooms');

// routes
router.get("/rooms", ctrlRooms.roomsList);
router.get("/rooms/:roomname", ctrlRooms.roomReadOne);
router.get("/devices", ctrlDevices.devicesList);
router.get("/devices/:roomname", ctrlDevices.devicesByRoom);
router.get("/sensors", ctrlSensors.sensorsList);
router.get("/sensors/:roomname", ctrlSensors.sensorsByRoom);
router.get("/sensors/:devicename", ctrlSensors.sensorsByDevice);


module.exports = router;
