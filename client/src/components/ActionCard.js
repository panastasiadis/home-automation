import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import RouterIcon from "@material-ui/icons/Router";
import RoomIcon from "@material-ui/icons/Room";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ScheduleIcon from "@material-ui/icons/Schedule";
import LoopIcon from "@material-ui/icons/Loop";
import Divider from "@material-ui/core/Divider";
import DeleteActionDialog from "./DeleteActionDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  command: {
    color: theme.palette.primary.main,
    fontSize: theme.typography.pxToRem(15),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    flexShrink: 0,
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "10px",
  },
  headingCommand: {
    borderStyle: "dashed",
    borderColor: theme.palette.secondary.main,
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    // [theme.breakpoints.down("xs")]: {
    //   display: "none",
    // },
  },
  summary: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  deviceInfoIndividual: {
    display: "flex",
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
  deviceInfo: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(2),
    },
  },
  accordionContent: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    borderRadius: "5px",
  },
  timeInfoIndividual: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
  },
  deleteButton: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function ActionCard(props) {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let recurrenceMessage;

  if (props.action.recurrenceNumber) {
    recurrenceMessage = `Every ${props.action.recurrenceNumber} ${props.action.recurrenceTimeUnit}`;
  } else {
    recurrenceMessage = "None";
  }

  const date = new Date(props.action.startTime);
  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div className={classes.summary}>
            <div className={classes.headingCommand}>
              <Typography
                variant="h1"
                component="h1"
                className={classes.heading}
              >
                {props.action.actionCategory}
              </Typography>
              <Typography className={classes.command}>
                {props.action.command}
              </Typography>
            </div>

            <div className={classes.deviceInfo}>
              <div className={classes.deviceInfoIndividual}>
                <BlurCircularIcon />
                <Typography variant="subtitle1" component="subtitle1">
                  {props.action.sensorName}
                </Typography>
              </div>
              <div className={classes.deviceInfoIndividual}>
                <RoomIcon />
                <Typography variant="subtitle1" component="subtitle1">
                  {props.action.roomName}
                </Typography>
              </div>
              <div className={classes.deviceInfoIndividual}>
                <RouterIcon />
                <Typography variant="subtitle1" component="subtitle1">
                  {props.action.deviceId}
                </Typography>
              </div>
            </div>
            <Typography className={classes.secondaryHeading}>
              {"Registered on: "}
              {date.toLocaleString()}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionContent}>
            <div className={classes.timeInfoIndividual}>
              <ScheduleIcon />
              <Typography variant="subtitle1" component="subtitle1">
                {date.toLocaleString()}
              </Typography>
            </div>
            <div className={classes.timeInfoIndividual}>
              <LoopIcon />
              <Typography variant="subtitle1" component="subtitle1">
                {recurrenceMessage}
              </Typography>
            </div>
          </div>
        </AccordionDetails>
        <Divider />
        <div className={classes.deleteButton}>
          <DeleteActionDialog action={props.action} updateActions={props.updateActions} />
        </div>
      </Accordion>
    </div>
  );
}
