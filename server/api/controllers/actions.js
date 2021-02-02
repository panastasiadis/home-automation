const schedule = require('node-schedule');
const aedesBroker = require('../../aedes_broker');

const Action = require('../models/models').Action;
const TimerAction = require('../models/models').TimerAction;
const SensorBasedAction = require('../models/models').SensorBasedAction;
const LocationBasedAction = require('../models/models').LocationBasedAction;

const sensor_util = require('../../sensor_util');

let scheduledCronActions = [];

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const sendNotification = (actionInfo) => {
  infoForBrowserJSON = {
    actionInfo: actionInfo,
    action: 'action',
  };

  aedesBroker.publishMessage('browser', JSON.stringify(infoForBrowserJSON));
};

const triggerAction = (action) => {
  aedesBroker.publishMessage(action.commandTopic, action.command);
  sendNotification(action);
  console.log(action.actionCategory + ' Triggered!');
};

module.exports.triggerAction = triggerAction;

const createCronRule = (date, timeUnit, recurrenceNumber) => {
  let requestedRule;

  switch (timeUnit) {
    case 'Minutes':
      console.log(`0 */${recurrenceNumber} * * * *`);
      requestedRule = `0 */${recurrenceNumber} * * * *`;
      break;
    case 'Hours':
      console.log(`0 ${date.getMinutes() + 1} */${recurrenceNumber} * * *`);
      requestedRule = `0 ${date.getMinutes() + 1} */${recurrenceNumber} * * *`;
      break;
    case 'Days':
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

const createSensorBasedRule = (action) => {
  const measurement = sensor_util.retrieveSensorData(
    action.measurementSensorName,
    action.measurementType
  );

  const commandSensorValue = sensor_util.retrieveSensorData(action.sensorName);

  if (measurement === undefined) {
    return;
  }
  const actionOnFail = {
    roomName: action.roomName,
    actionCategory: action.actionCategory,
    sensorType: action.sensorType,
    command: action.commandOnFailure,
    commandTopic: action.commandTopic,
  };
  if (action.comparisonType) {
    console.log(
      '[ Now:',
      commandSensorValue,
      '] [ Want:',
      action.command,
      '] [ Rule:',
      action.comparisonType,
      action.quantity,
      '] [',
      action.measurementType,
      measurement,
      ']'
    );

    switch (action.comparisonType) {
      case 'Below':
        if (action.quantity > measurement) {
          if (commandSensorValue && action.command != commandSensorValue) {
            triggerAction(action);
          }
        } else {
          if (
            commandSensorValue &&
            action.commandOnFailure != commandSensorValue
          ) {
            // triggerAction(actionOnFail);
          }
        }
        break;
      case 'Over':
        if (action.quantity < measurement) {
          if (commandSensorValue && action.command != commandSensorValue) {
            triggerAction(action);
          }
        } else {
          if (
            commandSensorValue &&
            action.commandOnFailure != commandSensorValue
          ) {
            // triggerAction(actionOnFail);
          }
        }
        break;
      case 'Equal To':
        if (action.quantity === measurement) {
          if (commandSensorValue && action.command != commandSensorValue) {
            triggerAction(action);
          }
        } else {
          if (
            commandSensorValue &&
            action.commandOnFailure != commandSensorValue
          ) {
            // triggerAction(actionOnFail);
          }
        }
        break;
      default:
        break;
    }
  }
  else {
    if (measurement === action.option) {
      if (commandSensorValue && action.command != commandSensorValue) {
        triggerAction(action);
      }
    }
  }
};

module.exports.scheduleStoredActions = () => {
  Action.find({}).exec((err, actions) => {
    if (err) {
      console.log(err);
    }

    if (actions.length !== 0) {
      for (const action of actions) {
        if (action.actionCategory === 'Timer Action') {
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
                triggerAction(action);
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
                console.log('Old unused action was deleted');
              });
            } else {
              scheduledAction = schedule.scheduleJob(date, () => {
                triggerAction(action);
              });

              scheduledCronActions.push({
                actionId: action._id.toString(),
                cronJob: scheduledAction,
              });
            }
          }
        } else if (action.actionCategory === 'Sensor-Based Action') {
          const currentDate = new Date();
          const everyMinuteRule = createCronRule(currentDate, 'Minutes', 1);
          const everyFiveSecsRule = `*/5 * * * * *`;

          const scheduledAction = schedule.scheduleJob(
            { start: currentDate, rule: everyFiveSecsRule },
            () => {
              console.log('Trying sensor-based action...');

              createSensorBasedRule(action);
            }
          );

          scheduledCronActions.push({
            actionId: action._id.toString(),
            cronJob: scheduledAction,
          });
        }
      }
    }
  });
};

module.exports.actionsList = (req, res) => {
  Action.find({})
    .sort({ registrationDate: 'desc' })
    .exec((err, actionDocs) => {

      // console.log(actionDocs);
      if (actionDocs && actionDocs.length === 0) {
        sendJsonResponse(res, 404, { message: 'No actions found' });
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, actionDocs);
    });
};

module.exports.addLocationBasedAction = (req, res) => {
  console.log(req.body);
  if (!req.body.sensorType) {
    sendJsonResponse(res, 400, { message: 'No sensor was specified' });
    return;
  } else if (!req.body.command) {
    sendJsonResponse(res, 400, { message: 'No command was specified' });
    return;
  } else if (!req.body.radius) {
    sendJsonResponse(res, 400, {
      message: 'No radius was specified',
    });
    return;
  }

  let action = {
    sensorType: req.body.sensorType,
    sensorName: req.body.sensorName,
    deviceId: req.body.deviceId,
    roomName: req.body.roomName,
    command: req.body.command,
    commandTopic: req.body.commandTopic,
    registrationDate: req.body.registrationDate,
    radius: req.body.radius,
    triggered: true,
  };

  LocationBasedAction.create(action, (err, action) => {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 204, action);
    }
  });
};

module.exports.addSensorBasedAction = (req, res) => {
  console.log(req.body);

  if (!req.body.sensorType) {
    sendJsonResponse(res, 400, { message: 'No sensor was specified' });
    return;
  } else if (!req.body.command) {
    sendJsonResponse(res, 400, { message: 'No command was specified' });
    return;
  } else if (!req.body.measurementSensorName) {
    sendJsonResponse(res, 400, {
      message: 'No measurement sensor was specified',
    });
    return;
  } else if (!req.body.measurementType) {
    sendJsonResponse(res, 400, {
      message: 'No measurement type was specified',
    });
    return;
  } else if (
    !req.body.option &&
    !req.body.comparisonType &&
    !req.body.quantity
  ) {
    sendJsonResponse(res, 400, {
      message:
        'No option or comparison type along with quantity were specified',
    });
    return;
  }

  let action = {
    sensorType: req.body.sensorType,
    sensorName: req.body.sensorName,
    deviceId: req.body.deviceId,
    roomName: req.body.roomName,
    command: req.body.command,
    commandTopic: req.body.commandTopic,
    registrationDate: req.body.registrationDate,
    measurementSensorName: req.body.measurementSensorName,
    measurementDeviceId: req.body.measurementDeviceId,
    measurementRoomName: req.body.measurementRoomName,
    measurementSensorType: req.body.measurementSensorType,
    commandOnFailure: req.body.commandOnFailure,
    quantity: req.body.quantity,
    comparisonType: req.body.comparisonType,
    measurementType: req.body.measurementType,
    option: req.body.option,
  };

  SensorBasedAction.create(action, (err, action) => {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, action);
      const currentDate = new Date();
      const everyMinuteRule = createCronRule(currentDate, 'Minutes', 1);
      const everyFiveSecsRule = `*/5 * * * * *`;

      const scheduledAction = schedule.scheduleJob(
        { start: currentDate, rule: everyFiveSecsRule },
        () => {
          console.log('Trying sensor-based action...');

          createSensorBasedRule(action);
        }
      );

      scheduledCronActions.push({
        actionId: action._id.toString(),
        cronJob: scheduledAction,
      });
    }
  });
};

module.exports.addTimerAction = (req, res) => {
  console.log(req.body);

  const timeUnit = req.body.recurrenceTimeUnit;
  const recurrenceNumber = req.body.recurrenceNumber;
  if (!req.body.sensorType) {
    sendJsonResponse(res, 400, { message: 'No sensor specified' });
    return;
  } else if (!req.body.command) {
    sendJsonResponse(res, 400, { message: 'No command specified' });
    return;
  } else if (!req.body.timestamp) {
    sendJsonResponse(res, 400, { message: 'Not Valid Date-Time' });
    return;
  }

  let action = {
    sensorType: req.body.sensorType,
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
            triggerAction(action);
          }
        );
      } else {
        scheduledAction = schedule.scheduleJob(date, () => {
          triggerAction(action);
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

  if (actionId) {
    Action.findByIdAndRemove(actionId).exec((err, action) => {
      if (err || !action) {
        sendJsonResponse(res, 404, {
          message: 'Something Went Wrong. Action not found on database',
        });
        return;
      }
      sendJsonResponse(res, 204, null);
      cronActionIdx = scheduledCronActions.findIndex((el) => {
        return el.actionId === action._id.toString();
      });
      console.log('Deleting action ' + action._id);

      scheduledCronActions = scheduledCronActions.filter((cronAction) => {
        if (cronAction.actionId === action._id.toString()) {
          cronAction.cronJob.cancel();
        }
        return cronAction.actionId !== action._id.toString();
      });
    });
  } else {
    sendJsonResponse(res, 404, {
      message: 'No action specified',
    });
  }
};
