import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import LightBulbIcon from "../assets/lightbulb.png";
import Switch from "@material-ui/core/Switch";
import mqttService from "./MQTT";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 122,
    display: "flex",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    marginLeft: 12,
    width: 122,
    height: 122,
  },
  degrees: {
    textAlign: "center",
  },
}));

export default function OutlinedCard(props) {
  const classes = useStyles();

  const onChangeHandler = (ev) => {
    console.log(props.mqttClient, props.commandTopic);

    if (ev.target.checked) {
      mqttService.publishMessage(props.mqttClient, props.command, "ON");
    } else {
      mqttService.publishMessage(props.mqttClient, props.command, "OFF");
    }
  };

  return (
    <Card className={classes.root} variant="outlined">
      {/* <CardHeader title="Sensor" /> */}

      <CardContent>
        <Typography className={classes.title} color="secondary" gutterBottom>
          {props.roomName}
        </Typography>
        <Typography variant="h5" component="h2">
          {props.name}
        </Typography>
        <Typography className={classes.pos} color="secondary">
          {props.device}
        </Typography>
        <Switch onChange={onChangeHandler} />
      </CardContent>
      <CardMedia
        className={classes.media}
        image={LightBulbIcon}
        title="Lightbulb"
      />
    </Card>
  );
}
