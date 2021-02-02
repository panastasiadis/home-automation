const relayLightBulb = {
  type: 'Lightbulb',
  openCommand: 'ON',
  closeCommand: 'OFF',
  openCommandDescription: 'Turn the lights on',
  closeCommandDescription: 'Turn the lights off',
  openAction: 'Turning the lights on!',
  closeAction: 'Turning the lights off!',
};

const relayHeat = {
  type: 'Heat',
  openCommand: 'ON',
  closeCommand: 'OFF',
  openCommandDescription: 'Turn the heat on',
  closeCommandDescription: 'Turn the heat off',
  openAction: 'Turning the heat on!',
  closeAction: 'Turning the heat off!',
};
const motionDetector = {
  type: 'Motion-Detector',
  unit: 'Detection status',
  detection: 'Motion detected',
  noDetection: 'No motion detected',
};

const temperatureHumidity = {
  type: 'Temperature-Humidity',
  temperatureMeasAndUnit: 'Temperature (Celcius)',
  temperatureUnit: 'Celcius',
  humidityMeasAndUnit: 'Humidity (%)',
  humidityUnit: '%',
};

const lightIntensity = {
  type: 'Light-Intensity',
  measAndUnit: 'Light Intensity (%)',
  unit: '%',
};

export const SENSOR_TYPE = {
  RELAY_LIGHTBULB: relayLightBulb.type,
  RELAY_HEAT: relayHeat.type,
  TEMPERATURE_HUMIDITY: temperatureHumidity.type,
  LIGHT_INTENSITY: lightIntensity.type,
  MOTION_DETECTOR: motionDetector.type,
};

const measurementOutputSensors = [
  lightIntensity.type,
  temperatureHumidity.type,
];
const optionsOutputSensors = [
  relayLightBulb.type,
  relayHeat.type,
  motionDetector.type,
];

export const actionsByType = (type, command) => {
  switch (type) {
    case relayLightBulb.type:
      switch (command) {
        case relayLightBulb.openCommand:
          return relayLightBulb.openAction;
        case relayLightBulb.closeCommand:
          return relayLightBulb.closeAction;
        default:
          break;
      }
      break;
    case relayHeat.type:
      switch (command) {
        case relayHeat.openCommand:
          return relayHeat.openAction;
        case relayHeat.closeCommand:
          return relayHeat.closeAction;
        default:
          break;
      }
      break;
    default:
      break;
  }
};

export const commandsByType = (type, command) => {
  let openObj, closeObj;
  switch (type) {
    case SENSOR_TYPE.RELAY_LIGHTBULB:
      openObj = {
        command: relayLightBulb.openCommand,
        description: relayLightBulb.openCommandDescription,
        commandOnFailure: relayLightBulb.closeCommand,
      };
      closeObj = {
        command: relayLightBulb.closeCommand,
        description: relayLightBulb.closeCommandDescription,
        commandOnFailure: relayLightBulb.openCommand,
      };

      switch (command) {
        case relayLightBulb.openCommand:
          return openObj;
        case relayLightBulb.closeCommand:
          return closeObj;
        default:
          return [openObj, closeObj];
      }
    case SENSOR_TYPE.RELAY_HEAT:
      openObj = {
        command: relayHeat.openCommand,
        description: relayHeat.openCommandDescription,
        commandOnFailure: relayHeat.closeCommand,
      };
      closeObj = {
        command: relayHeat.closeCommand,
        description: relayHeat.closeCommandDescription,
        commandOnFailure: relayHeat.openCommand,
      };

      switch (command) {
        case relayHeat.openCommand:
          return openObj;
        case relayHeat.closeCommand:
          return closeObj;
        default:
          return [openObj, closeObj];
      }
    default:
      break;
  }
};

export const getSensorOutputName = (type) => {
  switch (type) {
    case temperatureHumidity.type:
      return [
        temperatureHumidity.temperatureMeasAndUnit,
        temperatureHumidity.humidityMeasAndUnit,
      ];
    case lightIntensity.type:
      return [lightIntensity.measAndUnit];
    case motionDetector.type:
      return [motionDetector.unit];
    default:
      break;
  }
};

export const getMeasurementUnitsName = (measurementName) => {
  switch (measurementName) {
    case temperatureHumidity.temperatureMeasAndUnit:
      return temperatureHumidity.temperatureUnit;
    case temperatureHumidity.humidityMeasAndUnit:
      return temperatureHumidity.humidityUnit;
    case lightIntensity.measAndUnit:
      return lightIntensity.unit;
    default:
      break;
  }
};

export const getSensorOption = (sensorOutputName) => {
  switch (sensorOutputName) {
    case motionDetector.unit:
      return [motionDetector.detection, motionDetector.noDetection];
    default:
      break;
  }
};

export const getSensorOutputType = (type) => {
  if (measurementOutputSensors.includes(type)) {
    return 'measurement';
  } else if (optionsOutputSensors.includes(type)) {
    return 'options';
  }
};
