import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Switch from "@material-ui/core/Switch";
import mqttService from "../utils/MQTT";
import CircularProgress from "@material-ui/core/CircularProgress";

import lightBulbOpen from "../assets/lightbulb-open2.svg";
import lightBulbClosed from "../assets/lightbulb-closed2.svg";

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
    // marginLeft: theme.spacing(2),
    width: 122,
    height: 122,
    margin: theme.spacing(2),
  },
  degrees: {
    textAlign: "center",
  },
  circularProgress: {
    display: "inline",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function OutlinedCard(props) {
  const classes = useStyles();
  const [relayState, setRelayState] = useState("Loading State...");
  const switchValue = relayState === "ON" ? true : false;
  const [spinnerState, setSpinnerState] = useState({
    spinner: false,
    disabled: true,
  });

  const onChangeHandler = (ev) => {
    const client = mqttService.getClient();
    console.log(client, props.command);
    if (ev.target.checked) {
      mqttService.publishMessage(client, props.command, "ON");
    } else {
      mqttService.publishMessage(client, props.command, "OFF");
    }

    setSpinnerState({ spinner: true, disabled: true });
  };

  useEffect(() => {
    const client = mqttService.getClient();

    const messageHandler = (topic, payload, packet) => {
      console.log(payload.toString(), topic);
      if (topic === props.topic) {
        setRelayState(payload.toString());
        setSpinnerState({ spinner: false, disabled: false });
      }
    };

    client.on("message", messageHandler);

    return () => {
      console.log("unmounting relay");
      client.off("message", messageHandler);
    };
  }, [props.topic]);
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
        <Typography variant="h5" component="h2">
          {"Current State: "}
          {relayState}
        </Typography>
        <Typography className={classes.pos} color="secondary">
          {props.device}
        </Typography>
        <Switch
          onChange={onChangeHandler}
          checked={switchValue}
          disabled={spinnerState.disabled}
        />
        {spinnerState.spinner === true ? (
          <div className={classes.circularProgress}>
            <CircularProgress />
          </div>
        ) : null}
      </CardContent>
      <CardMedia
        className={classes.media}
        image={relayState === "ON" ? lightBulbOpen : lightBulbClosed}
        title="Lightbulb"
      />
    </Card>
  );
}
