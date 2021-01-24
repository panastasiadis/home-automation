import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Box from "@material-ui/core/Box";

import RouterIcon from "@material-ui/icons/Router";
import RoomIcon from "@material-ui/icons/Room";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";
import CircularProgress from "@material-ui/core/CircularProgress";

import BrightnessIcon from "../../assets/brightness.svg";
import mqttService from "../../utils/MQTT";

const useStyles = makeStyles((theme) => ({
  root: {
    // width: "100%",
    backgroundColor: "white",
    borderRadius: "10px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: "column",
  },
  info: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    borderRadius: "10px",
    // backgroundColor: theme.palette.secondary.main,
    // border:`2px solid ${theme.palette.secondary.main}`,
    margin: theme.spacing(1),
  },
  deviceInfoIndividual: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
  divContent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(2),
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
  progressBar: {
    textAlign: "center",
    // padding: theme.spacing(1),
    width: "100%",
  },
  brightnessIcon: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${BrightnessIcon})`,
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    width: 30,
    height: 30,
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
}));

function CircularProgressWithLabel(props) {
  const classes = useStyles();

  let value = props.value;
  if (props.value > 100) {
    value = 100;
  }
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={value} size={100} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <div className={classes.divContent}>
          <div className={classes.brightnessIcon} />
          <Typography
            variant="body2"
            component="div"
            color="textSecondary"
          >{`${Math.round(value)}%`}</Typography>
        </div>
      </Box>
    </Box>
  );
}


export default function OutlinedCard(props) {
  const classes = useStyles();

  const [currBrightness, setCurrBrightness] = useState({
    brightness: "Loading...",
    percentage: 0,
  });

  React.useEffect(() => {
    const client = mqttService.getClient();

    const messageHandler = (topic, payload, packet) => {
      console.log(payload.toString(), topic);
      if (topic === props.topic) {
        const luxStr = payload.toString();
        const luxPercentage = parseFloat(luxStr);
        setCurrBrightness({ brightness: luxStr, percentage: luxPercentage });
      }
    };

    client.on("message", messageHandler);

    return () => {
      console.log("unmounting light intensity");
      client.off("message", messageHandler);
    };
  }, [props.topic]);

  return (
    <div className={classes.root}>
      <div className={classes.divContent}>
        <div className={classes.progressBar}>
          <CircularProgressWithLabel value={currBrightness.percentage} />
        </div>
        <Typography className={classes.degrees}>
          {`${currBrightness.brightness} lux`}
        </Typography>
      </div>
      <div className={classes.info}>
        <div className={classes.roomInfo}>
          <RoomIcon />
          <Typography variant="h5">{props.roomName}</Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <BlurCircularIcon />
          <Typography variant="subtitle1">{props.sensorName}</Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <RouterIcon />
          <Typography variant="subtitle1">{props.device}</Typography>
        </div>
      </div>
    </div>
  );
}
