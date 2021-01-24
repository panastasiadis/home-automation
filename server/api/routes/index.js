const express = require("express");
const router = express.Router();
const ctrlAuth = require("../controllers/auth");
const ctrlActions = require("../controllers/actions");
const ctrlMeasurements = require("../controllers/measurements");

// If no API routes are hit, send the React app
// router.use(function (req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

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
