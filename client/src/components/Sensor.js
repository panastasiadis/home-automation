import TemperatureHumidityCard from "./TemperatureHumidityCard";
import React from "react";
import Grid from "@material-ui/core/Grid";
import RelayCard from "./RelayCard";

export default function SensorGridItem(props) {
  if (props.sensor.type === "temperature-humidity") {
    return (
      <Grid item xs={12} md={6} lg={4}>
        <TemperatureHumidityCard
          roomName={props.sensor.room}
          device={props.sensor.deviceId}
          temperature={
            props.sensor.currentMeasurement
              ? props.sensor.currentMeasurement.temperature
              : "-"
          }
          humidity={
            props.sensor.currentMeasurement
              ? props.sensor.currentMeasurement.humidity
              : "-"
          }
        />
      </Grid>
    );
  } else if (props.sensor.type === "relay") {
    return (
      <Grid item xs={12} md={6} lg={4}>
        <RelayCard
          roomName={props.sensor.room}
          device={props.sensor.deviceId}
          name={props.sensor.name}
          command = {props.sensor.commandTopic}
          mqttClient = {props.mqttClient}
        />
      </Grid>
    );
  } else {
    return null;
  }
}
