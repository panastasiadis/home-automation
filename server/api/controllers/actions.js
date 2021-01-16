const schedule = require("node-schedule");
const aedesBroker = require("../../aedes_broker");

const TimerAction = require("../models/rooms").TimerAction;

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.addAction = (req, res) => {
  console.log(req.body);

  const timeUnit = req.body.recurrenceTimeUnit;
  const recurrenceNumber = req.body.recurrenceNumber;
  if (!req.body.sensorName) {
    sendJsonResponse(res, 400, { message: "No sensor specified" });
    return;
  } else if (!req.body.command) {
    sendJsonResponse(res, 400, { message: "No command specified" });
    return;
  } else if (!req.body.timestamp) {
    sendJsonResponse(res, 400, { message: "Not Valid Date-Time" });
    return;
  }

  let action = {
    sensorName: req.body.sensorName,
    deviceId: req.body.deviceId,
    roomName: req.body.roomName,
    command: req.body.command,
    commandTopic: req.body.commandTopic,
    startTime: req.body.timestamp,
  };

  const date = new Date(action.startTime);
  let requestedRule = null;

  console.log(date);

  if (recurrenceNumber && timeUnit && recurrenceNumber > 0) {
    action.recurrenceNumber = recurrenceNumber;
    action.recurrenceTimeUnit = timeUnit;

    switch (timeUnit) {
      case "Minutes":
        console.log(`0 */${recurrenceNumber} * * * *`);
        requestedRule = `0 */${recurrenceNumber} * * * *`;
        break;
      case "Hours":
        console.log(`0 ${date.getMinutes() + 1} */${recurrenceNumber} * * *`);
        requestedRule = `0 ${
          date.getMinutes() + 1
        } */${recurrenceNumber} * * *`;
        break;
      case "Days":
        console.log(
          `0 ${
            date.getMinutes() + 1
          } ${date.getHours()} */${recurrenceNumber} * *`
        );
        requestedRule = `0 ${
          date.getMinutes() + 1
        } ${date.getHours()} */${recurrenceNumber} * *`;
        break;
      default:
        break;
    }
  }

  TimerAction.create(action, (err, action) => {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, action);

      if (requestedRule) {
        const scheduledAction = schedule.scheduleJob(
          { start: date, rule: requestedRule },
          () => {
            aedesBroker.publishMessage(req.body.commandTopic, req.body.command);
            console.log("Action Triggered!");
          }
        );
      } else {
        const scheduledAction = schedule.scheduleJob(date, () => {
          aedesBroker.publishMessage(req.body.commandTopic, req.body.command);
          console.log("Action Triggered!");
        });
      }
    }
  });
};
