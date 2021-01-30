import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import mqttService from "../../utils/MQTT";
import CircularProgress from "@material-ui/core/CircularProgress";

import {LightBulbOpen} from "../../utils/AssetImages";
import {LightBulbClosed} from "../../utils/AssetImages";

import RouterIcon from "@material-ui/icons/Router";
import RoomIcon from "@material-ui/icons/Room";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";

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
  imageLightOpen: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${LightBulbOpen})`,
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    width: 70,
    height: 70,
  },
  imageLightClosed: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${LightBulbClosed})`,
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    width: 70,
    height: 70,
  },
  currentState: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  onOff: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    color: theme.palette.secondary.main,
    borderStyle: "dashed",
    borderColor: theme.palette.secondary.main,
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
  circularProgress: {
    display: "inline",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function OutlinedCard(props) {
  const classes = useStyles();
  const [relayState, setRelayState] = useState("Loading...");
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
    <div className={classes.root}>
      <div className={classes.divContent}>
        {relayState === "ON" ? (
          <div className={classes.imageLightOpen} />
        ) : (
          <div className={classes.imageLightClosed} />
        )}
        <div className={classes.currentState}>
          <Typography variant="subtitle1">{"Current state "}</Typography>
          <Typography className={classes.onOff} variant="subtitle2">
            {relayState}
          </Typography>
        </div>

        {spinnerState.spinner === true ? (
          <div className={classes.circularProgress}>
            <CircularProgress />
          </div>
        ) : null}
        <Switch
          onChange={onChangeHandler}
          checked={switchValue}
          disabled={spinnerState.disabled}
        />
      </div>
      <div className={classes.info}>
        <div className={classes.roomInfo}>
          <RoomIcon />
          <Typography variant="h5">{props.roomName}</Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <BlurCircularIcon />
          <Typography variant="subtitle1">{props.name}</Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <RouterIcon />
          <Typography variant="subtitle1">{props.device}</Typography>
        </div>
      </div>
    </div>
  );
}
