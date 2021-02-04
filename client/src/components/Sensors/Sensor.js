import React from 'react';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import RelayCard from './LightBulbCard';
import LightIntensityCard from './LightIntensityCard';
import TemperatureHumidityCard from './TemperatureHumidityCard';
import MotionDetectionCard from './MotionDetectorCard';
import HeatCard from './HeatCard';
import { SENSOR_TYPE } from '../../utils/SensorSpecific';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '10px',
  },
  title: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    borderRadius: '10px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textAlign: 'center',
  },
  roomTitle: {
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: '10px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: theme.spacing(1),
  },
}));

export default function SensorGridItem(props) {
  const classes = useStyles();
  if (props.sensor.type === SENSOR_TYPE.MOTION_DETECTOR) {
    return (
      <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
        <Paper className={classes.paper} elevation={6}>
          <Typography variant="h6" className={classes.title}>
            Motion Detector
          </Typography>
          <MotionDetectionCard
            topic={props.sensor.pubTopic}
            roomName={props.sensor.room}
            device={props.sensor.deviceId}
            sensorName={props.sensor.name}
          />
        </Paper>
      </Grid>
    );
  } else if (props.sensor.type === SENSOR_TYPE.LIGHT_INTENSITY) {
    return (
      <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
        <Paper className={classes.paper} elevation={6}>
          <Typography variant="h6" className={classes.title}>
            Room brightness
          </Typography>
          <LightIntensityCard
            topic={props.sensor.pubTopic}
            roomName={props.sensor.room}
            device={props.sensor.deviceId}
            sensorName={props.sensor.name}
          />
        </Paper>
      </Grid>
    );
  } else if (props.sensor.type === SENSOR_TYPE.TEMPERATURE_HUMIDITY) {
    return (
      <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
        <Paper className={classes.paper} elevation={6}>
          <Typography variant="h6" className={classes.title}>
            Temperature & Humidity
          </Typography>
          <TemperatureHumidityCard
            topic={props.sensor.pubTopic}
            roomName={props.sensor.room}
            device={props.sensor.deviceId}
            sensorName={props.sensor.name}
          />
        </Paper>
      </Grid>
    );
  } else if (props.sensor.type === SENSOR_TYPE.RELAY_LIGHTBULB) {
    return (
      <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
        <Paper className={classes.paper} elevation={6}>
          <Typography variant="h6" className={classes.title}>
            Lights
          </Typography>
          <RelayCard
            roomName={props.sensor.room}
            device={props.sensor.deviceId}
            name={props.sensor.name}
            command={props.sensor.commandTopic}
            topic={props.sensor.pubTopic}
          />
        </Paper>
      </Grid>
    );
  } else if (props.sensor.type === SENSOR_TYPE.RELAY_HEAT) {
    return (
      <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
        <Paper className={classes.paper} elevation={6}>
          <Typography variant="h6" className={classes.title}>
            Heat
          </Typography>
          <HeatCard
            roomName={props.sensor.room}
            device={props.sensor.deviceId}
            name={props.sensor.name}
            command={props.sensor.commandTopic}
            topic={props.sensor.pubTopic}
          />
        </Paper>
      </Grid>
    );
  } else {
    return null;
  }
}
