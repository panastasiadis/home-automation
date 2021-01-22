export const commandsByType = (type, command) => {
  switch (type) {
    case "relay":
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
    case "temperature-humidity":
      return ["Temperature", "Humidity"];
    default:
      break;
  }
};

export const getMeasurementUnitsName = (measurementName) => {
  switch (measurementName) {
    case "Temperature":
      return "Celcius";
    case "Humidity":
      return "%";
    default:
      break;
  }
};
