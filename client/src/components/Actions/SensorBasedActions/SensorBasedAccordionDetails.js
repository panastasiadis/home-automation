import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { getMeasurementUnitsName } from '../../../utils/SensorSpecific';
import RoomIcon from '@material-ui/icons/Room';
import RouterIcon from '@material-ui/icons/Router';
import BlurCircularIcon from '@material-ui/icons/BlurCircular';

const useStyles = makeStyles((theme) => ({
  accordionContent: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    borderRadius: '10px',
  },
  whenDescription: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    flexWrap: 'wrap',
  },
  whenSensorDescription: {
    borderRadius: '10px',
    backgroundColor: 'white',
    // color: theme.palette.secondary.main,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    flexWrap: 'wrap',
  },
  labelDynamicContent: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: '10px',
  },
  deviceInfoIndividual: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    // borderStyle: "solid",
    // borderColor: theme.palette.secondar.main,
    borderRadius: '10px',
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
  deviceInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function TimerActionContent(props) {
  const classes = useStyles();

  let message;
  if (props.comparisonType && props.quantity) {
    message = `When ${
      props.measurementType
    } is ${props.comparisonType.toLowerCase()} ${
      props.quantity
    } ${getMeasurementUnitsName(props.measurementType)}.`;
  } else if (props.option) {
    message = `When the value of ${props.measurementType} is "${props.option}".`;
  }

  return (
    <div className={classes.accordionContent}>
      <div className={classes.whenDescription}>
        <Typography variant="subtitle1">{message}</Typography>
      </div>
      <div className={classes.whenSensorDescription}>
        <Typography variant="subtitle1" color="secondary">
          {'Sensor: ' + props.measurementSensorType}
        </Typography>
      </div>
      <div className={classes.whenSensorDescription}>
        <div className={classes.roomInfo}>
          <RoomIcon />
          <Typography variant="subtitle1">
            {props.measurementRoomName}
          </Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <BlurCircularIcon />
          <Typography variant="subtitle1">
            {props.measurementSensorName}
          </Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <RouterIcon />
          <Typography variant="subtitle1">
            {props.measurementDeviceId}
          </Typography>
        </div>
      </div>
    </div>
  );
}
