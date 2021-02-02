const sensor_util = require('../../sensor_util');

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.getMeasurements = (req, res) => {
  const sensorName = req.params.sensorName;

  if (sensorName) {
    sensor_util.retrieveDataGeneric(sensorName, (data) => {
      if (!data) {
        sendJsonResponse(res, 404, {
          message: `Something Went Wrong. Measurements not found. 
            There might be no measurements yet
            for this sensor or no sensor exists with the given name`,
        });
        return;
      }
      sendJsonResponse(res, 200, data);
    });
  }

};

module.exports.getLast24HoursMeasurements = (req, res) => {
  sendJsonResponse(res, 200, { status: 'success' });
};
