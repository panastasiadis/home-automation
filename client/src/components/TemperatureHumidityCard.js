import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
// import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import temperature from "../assets/temperature/thermometer.svg";
import humidity from "../assets/temperature/humidity.svg";
import RouterIcon from "@material-ui/icons/Router";
import RoomIcon from "@material-ui/icons/Room";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";

import mqttService from "../utils/MQTT";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "10px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  degrees: {
    textAlign: "center",
    backgroundColor: theme.palette.secondary.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    color: "white",
    borderRadius: "20px",
    fontWeight: "bold",
  },
  imageTemperature: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${temperature})`,
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    width: 70,
    height: 70,
  },
  imageHumidity: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${humidity})`,
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    width: 70,
    height: 70,
  },
  divContent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  info: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    borderColor: theme.palette.secondary.main,
    borderRadius: "10px",
    margin: theme.spacing(1),
  },
  deviceInfoIndividual: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    // borderStyle: "solid",
    // borderColor: theme.palette.secondar.main,
    borderRadius: "10px",
  },
  roomInfo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    // borderStyle: "solid",
    // borderColor: theme.palette.secondar.main,
    borderRadius: "10px",
  },
  tempHum: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  // boldTitle: {
  //   borderBottom: "dashed"
  // },
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
    <div className={classes.root}>
      <div className={classes.tempHum}>
        <div className={classes.divContent}>
          <Typography variant="h6" component="h6">
            Temperature
          </Typography>
          <div className={classes.imageTemperature} />
          <Typography
            variant="subtitle1"
            component="subtitle1"
            className={classes.degrees}
          >
            {currTempHum.temperature} &#8451;
            <br />
          </Typography>
        </div>
        <div className={classes.divContent}>
          <Typography variant="h6" component="h6">
            Humidity
          </Typography>
          <div className={classes.imageHumidity} />
          <Typography
            variant="subtitle1"
            component="subtitle1"
            className={classes.degrees}
          >
            {currTempHum.humidity} %
            <br />
          </Typography>
        </div>
      </div>
      <div className={classes.info}>
        <div className={classes.roomInfo}>
          <RoomIcon />
          <Typography variant="subtitle1" component="subtitle1">
            {props.roomName}
          </Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <BlurCircularIcon />
          <Typography variant="subtitle1" component="subtitle1">
            {props.sensorName}
          </Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <RouterIcon />
          <Typography variant="subtitle1" component="subtitle1">
            {props.device}
          </Typography>
        </div>
      </div>
    </div>
  );
}
