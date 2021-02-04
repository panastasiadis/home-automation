import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import RouterIcon from '@material-ui/icons/Router';
import RoomIcon from '@material-ui/icons/Room';
import BlurCircularIcon from '@material-ui/icons/BlurCircular';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import DeleteActionDialog from './common/DeleteActionDialog';
import TimerActionAccordionDetails from './TimerActions/TimerActionAccordionDetails';
import SensorBasedAccordionDetails from './SensorBasedActions/SensorBasedAccordionDetails';
import LocationActionAccordionDetails from './LocationBasedActions/LocationActionAccordionDetails';
import { commandsByType } from '../../utils/SensorSpecific';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  command: {
    color: theme.palette.primary.main,
    fontSize: theme.typography.pxToRem(15),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    flexShrink: 0,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '10px',
    backgroundColor: theme.palette.secondary.main,
  },
  headingCommand: {
    // borderStyle: "dashed",
    borderColor: theme.palette.secondary.main,
    borderRadius: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  heading: {
    // fontSize: theme.typography.pxToRem(15),
    // padding: theme.spacing(1),
    width: '100px',
    margin: theme.spacing(1),
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
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

  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function ActionCard(props) {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let details = null;
  switch (props.action.actionCategory) {
    case 'Timer Action':
      let date;
      let recurrenceMessage;
      if (props.action.recurrenceNumber) {
        recurrenceMessage = `Every ${props.action.recurrenceNumber} ${props.action.recurrenceTimeUnit}`;
      } else {
        recurrenceMessage = 'None';
      }
      date = new Date(props.action.startTime);
      details = (
        <TimerActionAccordionDetails
          recurrenceMessage={recurrenceMessage}
          date={date}
        />
      );
      break;
    case 'Sensor-Based Action':
      details = (
        <SensorBasedAccordionDetails
          measurementType={props.action.measurementType}
          quantity={props.action.quantity}
          comparisonType={props.action.comparisonType}
          measurementSensorName={props.action.measurementSensorName}
          measurementDeviceId={props.action.measurementDeviceId}
          measurementRoomName={props.action.measurementRoomName}
          measurementSensorType={props.action.measurementSensorType}
          option={props.action.option}
        />
      );
      break;
    case 'Location-Based Action':
      details = <LocationActionAccordionDetails radius={props.action.radius} />;
      break;
    default:
      break;
  }

  const commandDescription = commandsByType(
    props.action.sensorType,
    props.action.command
  );
  const registrationDate = new Date(props.action.registrationDate);
  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div className={classes.summary}>
            <div className={classes.headingCommand}>
              <Typography variant="subtitle1" className={classes.heading}>
                {props.action.actionCategory}
              </Typography>
              <Typography className={classes.command}>
                {props.action.sensorType + ' | '}
                {commandDescription.description}
              </Typography>
            </div>

            <div className={classes.deviceInfo}>
              <div className={classes.roomInfo}>
                <RoomIcon />
                <Typography variant="subtitle1">
                  {props.action.roomName}
                </Typography>
              </div>
              <div className={classes.deviceInfoIndividual}>
                <BlurCircularIcon />
                <Typography variant="subtitle1">
                  {props.action.sensorName}
                </Typography>
              </div>
              <div className={classes.deviceInfoIndividual}>
                <RouterIcon />
                <Typography variant="subtitle1">
                  {props.action.deviceId}
                </Typography>
              </div>
            </div>
            <Typography className={classes.secondaryHeading}>
              {'Registered on: '}
              {registrationDate.toLocaleString()}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>{details}</AccordionDetails>
        <Divider />
        <div className={classes.deleteButton}>
          <DeleteActionDialog
            action={props.action}
            updateActions={props.updateActions}
          />
        </div>
      </Accordion>
    </div>
  );
}
