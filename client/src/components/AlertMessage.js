import React, { useEffect, useState, useRef } from "react";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import mqttService from "./MQTT";

export default function AlertMessage(props) {
  const [open, setOpen] = useState(true);
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

    const messageHandler = (topic, payload) => {
      if (topic === "browser") {
        const infoObj = JSON.parse(payload.toString());
        if (infoObj.action === "disconnected") {
          const newInfo = {
            deviceId: infoObj.deviceId,
            action: infoObj.action,
          };
          infoRef.current = newInfo;
          setInfo(newInfo);
          handleOpen();
        }
      }
    };

    mqttService.onMessage(client, (topic, payload) => {
      messageHandler(topic, payload);
    });
  }, []);

  // let snackBar = null;
  // if (info) {
  return (
    <Snackbar open={open} autoHideDuration={6000} anchorOrigin={ {vertical: "top", horizontal: "center"}}onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {/* {info.deviceId} was {info.action} */}
        kati
      </Alert>
    </Snackbar>
  );
  // }
  // return snackBar;
}
