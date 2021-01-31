const geolib = require('geolib');
const LocationBasedAction = require('../models/models').LocationBasedAction;
const { triggerAction } = require('../controllers/actions');

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
          triggerAction(action);
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
