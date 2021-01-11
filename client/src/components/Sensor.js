import TemperatureHumidityCard from "./TemperatureHumidityCard";
import React from "react";
import Grid from "@material-ui/core/Grid";
import RelayCard from "./RelayCard";

export default function SensorGridItem(props) {
  if (props.sensor.type === "temperature-humidity") {
    return (
      <Grid item xs={12} md={6} lg={5}>
        <TemperatureHumidityCard
          topic={props.sensor.pubTopic}
          roomName={props.sensor.room}
          device={props.sensor.deviceId}
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
          command={props.sensor.commandTopic}
          topic={props.sensor.pubTopic}
        />
      </Grid>
    );
  } else {
    return null;
  }
}
