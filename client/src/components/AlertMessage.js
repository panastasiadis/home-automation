import React, { useEffect, useState } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AlertMessage(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(props.alertMessage ? true : false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  // console.log(props.alertMessage);


  useEffect(() => {
    setOpen(props.alertMessage ? true : false);
  }, [props]);

  let device;
  let reason;
  if (props.alertMessage) {
    device = props.alertMessage.device;
    reason = props.alertMessage.reason;
  }

  let severity;
  if (reason === "connected") {
    severity = "success";
  } else if (reason === "disconnected") {
    severity = "error";
  }

  return (
    <div className={classes.root}>
      <Snackbar open={open} onClose={handleClose} autoHideDuration={3000}>
        <Alert severity={severity} onClose={handleClose}>
          {device} was {reason}
        </Alert>
      </Snackbar>
    </div>
  );
}
