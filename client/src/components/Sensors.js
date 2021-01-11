import React from "react";
import Sensor from "./Sensor";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Sensors(props) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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
          <Paper className={fixedHeightPaper}>
            {<Typography>{"No devices found."}</Typography>}
          </Paper>
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
