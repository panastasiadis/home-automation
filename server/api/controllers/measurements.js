const sensor_util = require("../../sensor_util");

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.getLastHourMeasurements = (req, res) => {
  const sensorName = req.params.sensorName;

  if (sensorName) {
    const currentDate = new Date();
    console.log(currentDate);

    // if (currentDate.getMinutes() < 30) {
    //   currentDate.setHours(currentDate.getHours() - 1);
    //   currentDate.setMinutes(30);
    //   currentDate.setSeconds(0);
    //   currentDate.setMilliseconds(0);
    // } else {
    //   currentDate.setMinutes(0);
    //   currentDate.setSeconds(0);
    //   currentDate.setMilliseconds(0);
    // }
    const startTime = new Date(currentDate);
    startTime.setHours(startTime.getHours() - 1);
    startTime.setMinutes(startTime.getMinutes() - 30);
    console.log(startTime);

    sensor_util
      .retrieveTimeSensorData(sensorName, startTime, currentDate)
      .then((measurements) => {
        if (!measurements) {
          sendJsonResponse(res, 404, {
            message:
              `Something Went Wrong. Measurements not found. 
              There might be no measurements yet
              for this sensor or no sensor exists with the given name`,
          });
          return;
        }
        sendJsonResponse(res, 200, measurements);
      });

  } else {
    sendJsonResponse(res, 404, {
      message: "No sensor specified",
    });
  }
};

module.exports.getLast24HoursMeasurements = (req, res) => {
  sendJsonResponse(res, 200, { status: "success" });
};
