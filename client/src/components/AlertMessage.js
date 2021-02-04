import React, { useEffect, useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { actionsByType } from '../utils/SensorSpecific';

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

  const [open, setOpen] = useState(props.alertMessage ? true : false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
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
  if (reason === 'connected') {
    severity = 'success';
  } else if (reason === 'disconnected') {
    severity = 'error';
  } else if (reason === 'action') {
    severity = 'info';
  }

  let notificationMessage;
  if (reason === 'action') {
    const actionMessage = actionsByType(
      props.alertMessage.sensorType,
      props.alertMessage.command
    );
    notificationMessage = `${props.alertMessage.actionCategory}: ${actionMessage} (${props.alertMessage.sensorType} | ${props.alertMessage.roomName})`;
  } else {
    notificationMessage = `${device} was ${reason}`;
  }

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={severity} onClose={handleClose}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
