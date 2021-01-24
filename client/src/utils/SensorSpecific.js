export const SENSOR_TYPE = {
  RELAY_LIGHTBULB: "Lightbulb",
  TEMPERATURE_HUMIDITY: "Temperature-Humidity",
  LIGHT_INTENSITY: "Light-Intensity",
};

export const commandsByType = (type, command) => {
  switch (type) {
    case SENSOR_TYPE.RELAY_LIGHTBULB:
      switch (command) {
        case "ON":
          return { command: "ON", description: "Turn the lights on" };
        case "OFF":
          return { command: "OFF", description: "Turn the lights off" };

        default:
          return [
            { command: "ON", description: "Turn the lights on" },
            { command: "OFF", description: "Turn the lights off" },
          ];
      }

    default:
      break;
  }
};

export const getMeasurementNamesByType = (type) => {
  switch (type) {
    case SENSOR_TYPE.TEMPERATURE_HUMIDITY:
      return ["Temperature (Celcius)", "Humidity (%)"];
    case SENSOR_TYPE.LIGHT_INTENSITY:
      return ["Light Intensity (%)"];
    default:
      break;
  }
};

export const getMeasurementUnitsName = (measurementName) => {
  switch (measurementName) {
    case "Temperature (Celcius)":
      return "Celcius";
    case "Humidity (%)":
      return "%";
    case "Light Intensity (%)":
      return "%";
    default:
      break;
  }
};
