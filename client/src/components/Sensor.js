import TemperatureHumidityCard from "./TemperatureHumidityCard";
import React from "react";
import Grid from "@material-ui/core/Grid";
import RelayCard from "./RelayCard";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "10px",

  },

}));

export default function SensorGridItem(props) {
  const classes = useStyles();

  if (props.sensor.type === "temperature-humidity") {
    return (
      <Grid item xs={"auto"} md={"auto"} lg={"auto"}>
        <Paper className={classes.paper} elevation={6}>
          <TemperatureHumidityCard
            topic={props.sensor.pubTopic}
            roomName={props.sensor.room}
            device={props.sensor.deviceId}
            sensorName={props.sensor.name}
          />
        </Paper>
      </Grid>
    );
  } else if (props.sensor.type === "relay") {
    return (
      <Grid item xs={"auto"} md={"auto"} lg={"auto"}>
        <Paper className={classes.paper} elevation={6}>
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
