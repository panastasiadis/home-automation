const geolib = require('geolib');
const LocationBasedAction = require('../models/models').LocationBasedAction;
const aedesBroker = require('../../aedes_broker');
const sensor_util = require('../../sensor_util');
const {sendNotification} = require("../controllers/actions");
const SERVER_LOCATION = {
  latitude: 39.3612,
  longitude: 22.9539,
};

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.getClientLocation = (req, res) => {
  console.log(req.body);

  const clientLocation = {
    longitude: req.body[0].lon,
    latitude: req.body[0].lat,
  };

  sendJsonResponse(res, 200, { message: 'success' });

  LocationBasedAction.find({}).exec((err, locationActions) => {
    if (err) {
      console.log(err);
    }

    if (locationActions.length !== 0) {
      for (const action of locationActions) {
        if (
          geolib.isPointWithinRadius(
            clientLocation,
            SERVER_LOCATION,
            action.radius
          )
        ) {
          const measurement = sensor_util.retrieveSensorData(action.sensorName);
          console.log('previous state ->', measurement);

          if (measurement === undefined) {
            return;
          }

          if (measurement !== action.command) {
            aedesBroker.publishMessage(action.commandTopic, action.command);
            console.log('Location Action Triggered!');
            sendNotification(action);
          }
        }
      }
    }
  });
};
