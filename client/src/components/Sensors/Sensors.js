import React from "react";
import Sensor from "./Sensor";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import NoContentPage from "../NoContentPage";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Sensors(props) {
  const classes = useStyles();

  let sensors = props.sensors;
  if (props.filtered === "room") {
    sensors = props.sensors.filter((sensor) => sensor.room === props.selected);
  } else if (props.filtered === "sensor-type") {
    sensors = props.sensors.filter((sensor) => sensor.type === props.selected);
  }

  if (sensors.length === 0) {
    return (
      <Paper className={classes.paper} elevation={10}>
        <NoContentPage displayItem={"Devices"} />
      </Paper>
    );
  }

  return (
    <Grid container spacing={3} justify="center">
      {sensors.map((sensor) => {
        return <Sensor sensor={sensor} key={sensor.name} />;
      })}
    </Grid>

  );
}
