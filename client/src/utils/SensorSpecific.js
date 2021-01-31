export const SENSOR_TYPE = {
  RELAY_LIGHTBULB: 'Lightbulb',
  TEMPERATURE_HUMIDITY: 'Temperature-Humidity',
  LIGHT_INTENSITY: 'Light-Intensity',
};

export const actionsByType = (type, command) => {
  switch (type) {
    case SENSOR_TYPE.RELAY_LIGHTBULB:
      switch (command) {
        case 'ON':
          return 'Turning the lights on!';

        case 'OFF':
          return 'Turning the lights off!';
        default:
          break;
      }
      break;
    default:
      break;
  }
};

export const commandsByType = (type, command) => {
  switch (type) {
    case SENSOR_TYPE.RELAY_LIGHTBULB:
      switch (command) {
        case 'ON':
          return {
            command: 'ON',
            description: 'Turn the lights on',
            commandOnFailure: 'OFF',
          };
        case 'OFF':
          return {
            command: 'OFF',
            description: 'Turn the lights off',
            commandOnFailure: 'ON',
          };

        default:
          return [
            {
              command: 'ON',
              description: 'Turn the lights on',
              commandOnFailure: 'OFF',
            },
            {
              command: 'OFF',
              description: 'Turn the lights off',
              commandOnFailure: 'ON',
            },
          ];
      }
    default:
      break;
  }
};

export const getMeasurementNamesByType = (type) => {
  switch (type) {
    case SENSOR_TYPE.TEMPERATURE_HUMIDITY:
      return ['Temperature (Celcius)', 'Humidity (%)'];
    case SENSOR_TYPE.LIGHT_INTENSITY:
      return ['Light Intensity (%)'];
    default:
      break;
  }
};

export const getMeasurementUnitsName = (measurementName) => {
  switch (measurementName) {
    case 'Temperature (Celcius)':
      return 'Celcius';
    case 'Humidity (%)':
      return '%';
    case 'Light Intensity (%)':
      return '%';
    default:
      break;
  }
};
