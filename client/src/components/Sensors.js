import React from "react";
import Sensor from "./Sensor";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

export default function Sensors(props) {
  if (props.sensors.length === 0) {
    return <Typography>No devices found.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {props.sensors.map((sensor) => {
        return <Sensor sensor={sensor} key={sensor.name} />;
      })}
    </Grid>
  );
}
