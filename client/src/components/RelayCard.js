import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import LightBulbIcon from "../assets/lightbulb.png";
import Switch from "@material-ui/core/Switch";
import mqttService from "../utils/MQTT";

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
  const [relayState, setRelayState] = useState("OFF");
  // const [switchState, setSwitchState] = React.useState(false);

  // const handleSwitchChange = (event) => {
  //   setSwitchState(event.target.checked);
  // };

  const onChangeHandler = (ev) => {
    const client = mqttService.getClient();
    console.log(client, props.command);

    if (ev.target.checked) {
      mqttService.publishMessage(client, props.command, "ON");
    } else {
      mqttService.publishMessage(client, props.command, "OFF");
    }
  };

  useEffect(() => {
    const client = mqttService.getClient();

    const messageHandler = (topic, payload, packet) => {
      console.log(payload.toString(), topic);
      if (topic === props.topic) {
        setRelayState(payload.toString());
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
