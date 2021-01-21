import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import temperature from "../assets/temperature/thermometer.svg";
import humidity from "../assets/temperature/humidity.svg";
import RouterIcon from "@material-ui/icons/Router";
import RoomIcon from "@material-ui/icons/Room";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";
import axios from "axios";

import mqttService from "../utils/MQTT";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "45vh",
    backgroundColor: "white",
    borderRadius: "10px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
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
    width: 50,
    height: 50,
  },
  imageHumidity: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${humidity})`,
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    width: 50,
    height: 50,
  },
  divContent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(1),
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

    borderRadius: "10px",
  },
  tempHum: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  averageMeasurementsDiv: {
    // flexGrow: 1,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    // justifyContent: "space-around",
    padding: theme.spacing(1),
    // flexWrap: "wrap",
  },
}));

export default function OutlinedCard(props) {
  const classes = useStyles();

  const [averageData, setAverageData] = useState({
    avgTemp: null,
    avgHum: null,
    isFetching: false,
  });

  const [currTempHum, setCurrTempHum] = useState({
    temperature: "Loading...",
    humidity: "Loading...",
  });

  let displayedAvg = "Few Samples";

  if (averageData.avgTemp !== null) {
    displayedAvg = `${Math.round(averageData.avgTemp)}\u00B0C /
    ${Math.round(averageData.avgHum)}%`;
  }

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setAverageData({ avgTemp: null, avgHum: null, isFetching: true });
        const response = await axios.get(
          `http://192.168.1.66:5000/api/measurements/${props.sensorName}`
        );
        setAverageData({
          avgTemp: response.data.avgTemp,
          avgHum: response.data.avgHum,
          isFetching: false,
        });
      } catch (error) {
        console.log(error);
        setAverageData({ avgTemp: null, avgHum: null, isFetching: false });
      }
    };

    fetchDevices();

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
  }, [props.topic, props.sensorName]);

  return (
    <div className={classes.root}>
      <div className={classes.tempHum}>
        <div className={classes.divContent}>
          <Typography variant="subtitle1" component="subtitle1">
            Temperature
          </Typography>
          <div className={classes.imageTemperature} />
          <Typography className={classes.degrees}>
            {`${currTempHum.temperature} \u00B0C`}
            <br />
          </Typography>
        </div>
        <div className={classes.divContent}>
          <Typography variant="subtitle1" component="subtitle1">
            Humidity
          </Typography>
          <div className={classes.imageHumidity} />
          <Typography className={classes.degrees}>
            {currTempHum.humidity} %
            <br />
          </Typography>
        </div>
      </div>
      <div className={classes.averageMeasurementsDiv}>
        <Typography variant="subtitle1">{"Average"}</Typography>
        <Typography className={classes.degrees}>{displayedAvg}</Typography>
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
