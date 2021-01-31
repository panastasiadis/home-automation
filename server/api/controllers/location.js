const geolib = require('geolib');
const LocationBasedAction = require('../models/models').LocationBasedAction;
const aedesBroker = require('../../aedes_broker');
const sensor_util = require('../../sensor_util');
const { sendNotification } = require('../controllers/actions');

//my house address, Volos-Magnesia
const SERVER_LOCATION = {
  latitude: 39.3612,
  longitude: 22.9539,
};

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const executeLocationTask = async (clientLocation) => {
  try {
    locActions = await LocationBasedAction.find({});
    if (locActions.length !== 0) {
      for (const action of locActions) {
        const overlap = geolib.isPointWithinRadius(
          clientLocation,
          SERVER_LOCATION,
          action.radius
        );
        if (overlap && !action.triggered) {
          // const measurement = sensor_util.retrieveSensorData(action.sensorName);
          // console.log('previous state ->', measurement);

          // if (measurement === undefined)  {
          //   return;
          // }

          // if (measurement !== action.command) {
          aedesBroker.publishMessage(action.commandTopic, action.command);
          console.log('Location Action Triggered!');
          sendNotification(action);
          action.triggered = true;
          await action.save();
          // }
        } else if (!overlap && action.triggered) {
          action.triggered = false;
          await action.save();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.getClientLocation = (req, res) => {
  console.log(req.body);

  const clientLocation = {
    longitude: req.body[0].lon,
    latitude: req.body[0].lat,
  };

  executeLocationTask(clientLocation);
  sendJsonResponse(res, 204);

};
