const cron = require("node-cron");
// const date = new Date();
// cron.schedule("*/5 * * * * *", () => {
//   console.log("running a task every minute at the 5th second");
//   console.log(date.toString());
// });

const TimerAction = require("../models/rooms").TimerAction;

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};
module.exports.addAction = (req, res) => {
  console.log(req.body);
  if (!req.body.sensorName) {
    sendJsonResponse(res, 400, { message: "No sensor specified" });
    return;
  }
  else if (!req.body.command) {
    sendJsonResponse(res, 400, { message: "No command specified" });
    return;
  }
  else if (!req.body.timestamp) {
    sendJsonResponse(res, 400, { message: "Not Valid Date-Time" });
    return;
  }

  TimerAction.create(
    {
      sensorName: req.body.sensorName,
      deviceId: req.body.deviceId,
      roomName: req.body.roomName,
      command: req.body.command,
      commandTopic: req.body.commandTopic,
      timestamp: req.body.timestamp,
    },
    (err, action) => {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        sendJsonResponse(res, 201, action);
      }
    }
  );
};
