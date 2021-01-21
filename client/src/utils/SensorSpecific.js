export const commandsByType = (type) => {
  switch (type) {
    case "relay":
      return [
        { command: "ON", description: "Turn on" },
        { command: "OFF", description: "Turn off" },
      ];
    default:
      break;
  }
};

export const getMeasurementsByType = (type) => {
  switch (type) {
    case "temperature-humidity":
      return ["Temperature", "Humidity"];
    default:
      break;
  }
};
