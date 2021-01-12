import TemperatureHumidityCard from "./TemperatureHumidityCard";
import React from "react";
import Grid from "@material-ui/core/Grid";
import RelayCard from "./RelayCard";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: theme.palette.secondary.main,
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function SensorGridItem(props) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  if (props.sensor.type === "temperature-humidity") {
    return (
      <Grid item xs={12} md={6} lg={5}>
        <Paper className={fixedHeightPaper} elevation={6}>
          <TemperatureHumidityCard
            topic={props.sensor.pubTopic}
            roomName={props.sensor.room}
            device={props.sensor.deviceId}
          />
        </Paper>
      </Grid>
    );
  } else if (props.sensor.type === "relay") {
    return (
      <Grid item xs={12} md={6} lg={4}>
        <Paper className={fixedHeightPaper} elevation={6}>
          <RelayCard
            roomName={props.sensor.room}
            device={props.sensor.deviceId}
            name={props.sensor.name}
            command={props.sensor.commandTopic}
            topic={props.sensor.pubTopic}
          />
        </Paper>
      </Grid>
    );
  } else {
    return null;
  }
}
