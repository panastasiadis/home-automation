import React, { useEffect, useState, useRef } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import mqttService from "./MQTT";
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AlertMessage(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState([]);
  const infoRef = useRef(info);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const client = mqttService.getClient();

    const messageHandler = (client, topic, payload) => {
      if (topic === "browser") {
        const infoObj = JSON.parse(payload.toString());
        if (infoObj.action === "disconnected") {
          const newInfo = {
            deviceId: infoObj.deviceId,
            action: infoObj.action,
            severityType: "error"

          };
          infoRef.current = newInfo;
          setInfo(newInfo);
          handleOpen();
        }
        else if (infoObj.action === "connected") {
          const newInfo = {
            deviceId: infoObj.newSensors[0].deviceId,
            action: infoObj.action,
            severityType: "success"
          }
          infoRef.current = newInfo;
          setInfo(newInfo);
          handleOpen();
        }
      }
    };

    mqttService.onMessage(client, (client, topic, payload) => {
      messageHandler(client, topic, payload);
    });
  }, []);

  return (
    <div className={classes.root}>
    <Snackbar open={open} autoHideDuration={6000} anchorOrigin={ {vertical: "top", horizontal: "center"}}onClose={handleClose}>
      <Alert onClose={handleClose} severity={info.severityType}>
        {info.deviceId} was {info.action}
      </Alert>
    </Snackbar>
    </div>

  );

}
