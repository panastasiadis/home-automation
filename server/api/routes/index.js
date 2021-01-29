const express = require("express");
const router = express.Router();

const ctrlLocation = require("../controllers/location");
const ctrlAuth = require("../controllers/auth");
const ctrlActions = require("../controllers/actions");
const ctrlMeasurements = require("../controllers/measurements");
const { getActiveSensors } = require("../../sensor_util");

router.get("/activeSensors", (req, res) => {
  res.send(getActiveSensors());
});

router.post("/timerActions", ctrlActions.addTimerAction);
router.post("/sensorBasedActions", ctrlActions.addSensorBasedAction);
router.post("/locationBasedActions",ctrlActions.addLocationBasedAction);
router.get("/actions", ctrlActions.actionsList);
router.delete("/actions/:actionid", ctrlActions.deleteAction);

router.get(
  "/measurements/:sensorName",
  ctrlMeasurements.getLastHourMeasurements
);

router.post("/location",ctrlLocation.getClientLocation);

router.post("/users/signin", ctrlAuth.userSignIn);
router.get("/verifyToken", ctrlAuth.verifyToken);
module.exports = router;
