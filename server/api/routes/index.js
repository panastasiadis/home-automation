const express = require("express");
const router = express.Router();
const ctrlDevices = require("../controllers/devices");
const ctrlSensors = require("../controllers/sensors");
const ctrlRooms = require("../controllers/rooms");
const ctrlAuth = require("../controllers/auth");
const ctrlActions = require("../controllers/actions");
const ctrlMeasurements = require("../controllers/measurements");
// routes
router.get("/rooms", ctrlRooms.roomsList);
router.get("/rooms/:roomname", ctrlRooms.roomReadOne);
router.get("/devices", ctrlDevices.devicesList);
router.get("/devices/:roomname", ctrlDevices.devicesByRoom);
router.get("/sensors", ctrlSensors.sensorsList);
router.get("/sensors/:roomname", ctrlSensors.sensorsByRoom);
router.get("/sensors/:devicename", ctrlSensors.sensorsByDevice);

router.post("/timerActions", ctrlActions.addTimerAction);
router.post("/sensorBasedActions", ctrlActions.addSensorBasedAction);
router.get("/actions", ctrlActions.actionsList);
router.delete("/actions/:actionid", ctrlActions.deleteAction);

router.get(
  "/measurements/:sensorName",
  ctrlMeasurements.getLastHourMeasurements
);

router.post("/users/signin", ctrlAuth.userSignIn);
router.get("/verifyToken", ctrlAuth.verifyToken);
module.exports = router;
