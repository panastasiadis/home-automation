const schedule = require("node-schedule");
const aedesBroker = require("../../aedes_broker");

const Action = require("../models/models").Action;
const TimerAction = require("../models/models").TimerAction;
const SensorBasedAction = require("../models/models").SensorBasedAction;

let scheduledCronActions = [];

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const sendNotification = (actionInfo) => {
  infoForBrowserJSON = {
    actionInfo: actionInfo,
    action: "action",
  };

  aedesBroker.publishMessage("browser", JSON.stringify(infoForBrowserJSON));
};

const createCronRule = (date, timeUnit, recurrenceNumber) => {
  let requestedRule;

  switch (timeUnit) {
    case "Minutes":
      console.log(`0 */${recurrenceNumber} * * * *`);
      requestedRule = `0 */${recurrenceNumber} * * * *`;
      break;
    case "Hours":
      console.log(`0 ${date.getMinutes() + 1} */${recurrenceNumber} * * *`);
      requestedRule = `0 ${date.getMinutes() + 1} */${recurrenceNumber} * * *`;
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

  return requestedRule;
};

module.exports.scheduleStoredActions = () => {
  TimerAction.find({}).exec((err, timerActions) => {
    if (err) {
      console.log(err);
    }

    if (timerActions.length !== 0) {
      for (const action of timerActions) {
        const date = new Date(action.startTime);
        let requestedRule;
        let scheduledAction;

        if (action.recurrenceTimeUnit) {
          requestedRule = createCronRule(
            action.startTime,
            action.recurrenceTimeUnit,
            action.recurrenceNumber
          );

          scheduledAction = schedule.scheduleJob(
            { start: date, rule: requestedRule },
            () => {
              aedesBroker.publishMessage(action.commandTopic, action.command);
              console.log("Action Triggered!");
              sendNotification(action);
            }
          );

          scheduledCronActions.push({
            actionId: action._id.toString(),
            cronJob: scheduledAction,
          });
        } else {
          currentDate = new Date();
          if (currentDate > date) {
            TimerAction.deleteOne({ _id: action._id }).exec((err, action) => {
              if (err) {
                console.log(err);
              }
              console.log("Old unused action was deleted");
            });
          } else {
            scheduledAction = schedule.scheduleJob(date, () => {
              aedesBroker.publishMessage(action.commandTopic, action.command);
              console.log("Action Triggered!");
              sendNotification(action);
            });

            scheduledCronActions.push({
              actionId: action._id.toString(),
              cronJob: scheduledAction,
            });
          }
        }
      }
    }
  });
};

module.exports.actionsList = (req, res) => {
  Action.find({})
    .sort({ startTime: "desc" })
    .exec((err, actionDocs) => {
      // console.log(actionDocs);
      if (actionDocs.length === 0) {
        sendJsonResponse(res, 404, { message: "No actions found" });
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, actionDocs);
    });
};

module.exports.addSensorBasedAction = (req, res) => {
  console.log(req.body);

  if (!req.body.sensorName) {
    sendJsonResponse(res, 400, { message: "No sensor was specified" });
    return;
  } else if (!req.body.command) {
    sendJsonResponse(res, 400, { message: "No command was specified" });
    return;
  } else if (!req.body.measurementSensorName) {
    sendJsonResponse(res, 400, {
      message: "No measurement sensor was specified",
    });
    return;
  } else if (!req.body.comparisonType) {
    sendJsonResponse(res, 400, {
      message: "No comparison operator was specified",
    });
    return;
  } else if (!req.body.measurementType) {
    sendJsonResponse(res, 400, {
      message: "No measurement type was specified",
    });
    return;
  } else if (!req.body.quantity) {
    sendJsonResponse(res, 400, { message: "No quantity was specified" });
    return;
  }

  let action = {
    sensorName: req.body.sensorName,
    deviceId: req.body.deviceId,
    roomName: req.body.roomName,
    command: req.body.command,
    commandTopic: req.body.commandTopic,
    registrationDate: req.body.registrationDate,
    measurementSensorName: req.body.measurementSensorName,
    measurementDeviceId: req.body.measurementDeviceId,
    measurementRoomName: req.body.measurementRoomName,
    quantity: req.body.quantity,
    comparisonType: req.body.comparisonType,
    measurementType: req.body.measurementType,
  };

  SensorBasedAction.create(action, (err, action) => {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, action);
    }
  });
};

module.exports.addTimerAction = (req, res) => {
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
    registrationDate: req.body.registrationDate,
  };

  const date = new Date(action.startTime);
  let requestedRule = null;

  console.log(date);

  if (recurrenceNumber && timeUnit && recurrenceNumber > 0) {
    requestedRule = createCronRule(date, timeUnit, recurrenceNumber);
    action.recurrenceNumber = recurrenceNumber;
    action.recurrenceTimeUnit = timeUnit;
  }

  TimerAction.create(action, (err, action) => {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, action);
      let scheduledAction;

      if (requestedRule) {
        scheduledAction = schedule.scheduleJob(
          { start: date, rule: requestedRule },
          () => {
            aedesBroker.publishMessage(req.body.commandTopic, req.body.command);
            console.log("Action Triggered!");
            sendNotification(action);
          }
        );
      } else {
        scheduledAction = schedule.scheduleJob(date, () => {
          aedesBroker.publishMessage(req.body.commandTopic, req.body.command);
          console.log("Action Triggered!");
          sendNotification(action);
        });
      }
      scheduledCronActions.push({
        actionId: action._id.toString(),
        cronJob: scheduledAction,
      });
    }
  });
};

module.exports.deleteAction = (req, res) => {
  const actionId = req.params.actionid;
  // console.log(actionId);

  if (actionId) {
    Action.findByIdAndRemove(actionId).exec((err, action) => {
      if (err || !action) {
        sendJsonResponse(res, 404, {
          message: "Something Went Wrong. Action not found on database",
        });
        return;
      }
      sendJsonResponse(res, 204, null);
      console.log(scheduledCronActions);
      console.log(action._id);
      cronActionIdx = scheduledCronActions.findIndex((el) => {
        console.log(el);
        return el.actionId === action._id.toString();
      });
      console.log(cronActionIdx);

      scheduledCronActions = scheduledCronActions.filter((cronAction) => {
        if (cronAction.actionId === action._id.toString()) {
          console.log(cronAction.cronJob);
          cronAction.cronJob.cancel();
        }
        return cronAction.actionId !== action._id.toString();
      });
      console.log(scheduledCronActions);
    });
  } else {
    sendJsonResponse(res, 404, {
      message: "No action specified",
    });
  }
};
