const express = require("express");
const router = express.Router();
const ctrlDevices = require("../controllers/devices");
const ctrlSensors = require("../controllers/sensors");
// var ctrlReviews = require("../controllers/reviews");

// locations
router.get("/devices", ctrlDevices.devicesList);
router.get("/devices/:roomname", ctrlDevices.devicesByRoom);
router.get("/sensors", ctrlSensors.sensorsList);
router.get("/sensors/:roomname", ctrlSensors.sensorsByRoom);
router.get("/sensors/:devicename", ctrlSensors.sensorsByDevice);

// // reviews
// router.post("/locations/:locationid/reviews", ctrlReviews.reviewsCreate);
// router.get(
//   "/locations/:locationid/reviews/:reviewid",
//   ctrlReviews.reviewsReadOne
// );
// router.put(
//   "/locations/:locationid/reviews/:reviewid",
//   ctrlReviews.reviewsUpdateOne
// );
// router.delete(
//   "/locations/:locationid/reviews/:reviewid",
//   ctrlReviews.reviewsDeleteOne
// );
module.exports = router;
