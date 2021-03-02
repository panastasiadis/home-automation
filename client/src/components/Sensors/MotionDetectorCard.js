import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

import RouterIcon from '@material-ui/icons/Router';
import RoomIcon from '@material-ui/icons/Room';
import BlurCircularIcon from '@material-ui/icons/BlurCircular';

import mqttService from '../../utils/MQTT';
import { Motion } from '../../utils/AssetImages';
import { NoMotion } from '../../utils/AssetImages';
import { backendApiUrl } from '../../utils/Config';

const useStyles = makeStyles((theme) => ({
  root: {
    // width: "100%",
    backgroundColor: 'white',
    borderRadius: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: "column",
  },
  info: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderRadius: '10px',
    margin: theme.spacing(1),
  },
  deviceInfoIndividual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
  divContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  motionImage: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${Motion})`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: 70,
    height: 70,
  },
  noMotionImage: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundImage: `url(${NoMotion})`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: 70,
    height: 70,
  },
  currentState: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  motionInfo: {
    textAlign: 'center',
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1),
    color: 'white',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
  roomInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: '10px',
  },
}));

export default function MotionCard(props) {
  const classes = useStyles();
  const [currMotionState, setCurrMotionState] = useState('Loading...');
  const motionStateRef = useRef(currMotionState);
  const [lastTimeDetection, setLastTimeDetection] = useState(
    'No detection yet'
  );
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        setLastTimeDetection('No detection yet');
        const response = await axios.get(
          `${backendApiUrl.server}api/measurements/${props.sensorName}`
        );

        if (response.data.length !== 0) {
          setLastTimeDetection(new Date(response.data[0]));
        }
      } catch (error) {
        console.log(error);
        setLastTimeDetection('No detection yet');
      }
    };

    fetchMeasurements();

    const client = mqttService.getClient();

    const messageHandler = (topic, payload, packet) => {
      console.log(payload.toString(), topic);

      if (topic === props.topic) {
        const motionState = payload.toString();
        if (
          motionStateRef.current === 'Motion detected' &&
          motionState === 'No motion detected'
        ) {
          fetchMeasurements();
        }
        motionStateRef.current = motionState;
        setCurrMotionState(motionState);
      }
    };

    client.on('message', messageHandler);

    return () => {
      console.log('unmounting motion detector');
      client.off('message', messageHandler);
    };
  }, [props.topic, props.sensorName]);
  console.log(currMotionState);
  return (
    <div className={classes.root}>
      <div className={classes.divContent}>
        {currMotionState === 'Motion detected' ? (
          <div className={classes.motionImage} />
        ) : (
          <div className={classes.noMotionImage} />
        )}
        <div className={classes.currentState}>
          <Typography className={classes.motionInfo} variant="subtitle2">
            {currMotionState}
          </Typography>
        </div>
        <div className={classes.currentState}>
          <Typography variant="body2" color="textSecondary">{`Last detection: ${
            lastTimeDetection.toLocaleString()
              ? lastTimeDetection.toLocaleString()
              : lastTimeDetection
          }`}</Typography>
        </div>
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
