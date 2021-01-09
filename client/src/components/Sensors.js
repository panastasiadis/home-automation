import React from "react";
import Sensor from "./Sensor";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

export default function Sensors(props) {
  let sensors = props.sensors;
  if (props.filtered === "room") {
    sensors = props.sensors.filter((sensor) => sensor.room === props.selected);
  } else if (props.filtered === "sensor-type") {
    sensors = props.sensors.filter((sensor) => sensor.type === props.selected);
  }

  if (sensors.length === 0) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Typography>{"No devices found."}</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {sensors.map((sensor) => {
        return <Sensor sensor={sensor} key={sensor.name} />;
      })}
    </Grid>
  );
}
