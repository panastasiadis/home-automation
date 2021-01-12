import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
// import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import icon from "../assets/thermometer.png";
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
    marginLeft: 12,
  },
}));

export default function OutlinedCard(props) {
  const classes = useStyles();

  const [currTempHum, setCurrTempHum] = useState({
    temperature: "Loading...",
    humidity: "Loading...",
  });

  useEffect(() => {
    const client = mqttService.getClient();

    const messageHandler = (topic, payload, packet) => {
      console.log(payload.toString(), topic);
      if (topic === props.topic) {
        const splitStr = payload.toString().split("-");
        setCurrTempHum({ temperature: splitStr[0], humidity: splitStr[1] });
      }
    };

    client.on("message", messageHandler);

    return () => {
      console.log("unmounting temp-hum");
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
          Temperature & Humidity
        </Typography>
        <Typography className={classes.pos} color="secondary">
          {props.device}
        </Typography>
      </CardContent>
      <CardMedia className={classes.media} image={icon} title="Temperature" />
      <CardContent>
        <Typography variant="h6" className={classes.degrees}>
          {currTempHum.temperature} &#8451;
          <br />
        </Typography>
        <Typography variant="h6" className={classes.degrees}>
          {currTempHum.humidity} %
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
}
