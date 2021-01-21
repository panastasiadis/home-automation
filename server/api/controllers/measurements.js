const Measurement = require("../models/models").Measurement;
const mongoose = require("mongoose");
const { measurementSchema } = require("../models/models");

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.getLastHourMeasurements = (req, res) => {
  const sensorName = req.params.sensorName;

  if (sensorName) {
    const currentDate = new Date();
    console.log(currentDate);

    if (currentDate.getMinutes() < 30) {
      currentDate.setHours(currentDate.getHours() - 1);
      currentDate.setMinutes(30);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
    } else {
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
    }
    console.log(currentDate);

    mongoose
      .model("Measurement", measurementSchema, sensorName)
      .findOne({
        sensorId: sensorName.toString(),
        startTime: currentDate,
      })
      .exec((err, measurements) => {
        if (err || !measurements) {
          sendJsonResponse(res, 404, {
            message: "Something Went Wrong. Measurement not found.",
          });
          return;
        }

        const averageTemperature =
          measurements.temperaturesSum / measurements.measurementsCounter;
        const averageHumidity =
          measurements.humiditiesSum / measurements.measurementsCounter;
        console.log(averageTemperature, averageHumidity);
        sendJsonResponse(res, 200, {
          avgTemp: averageTemperature,
          avgHum: averageHumidity,
        });
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
