import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ScheduleIcon from "@material-ui/icons/Schedule";
import LoopIcon from "@material-ui/icons/Loop";
const useStyles = makeStyles((theme) => ({
  accordionContent: {
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    borderRadius: "10px",
  },
  timeInfoIndividual: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
  },
  dateLabel: {
    marginLeft: theme.spacing(1),

  }
}));

export default function TimerActionContent(props) {
  const classes = useStyles();

  return (
    <div className={classes.accordionContent}>
      <div className={classes.timeInfoIndividual}>
        <ScheduleIcon />
        <Typography className={classes.dateLabel} variant="subtitle1">
          {`Starting time: ${props.date.toLocaleString()}`}
        </Typography>
      </div>
      <div className={classes.timeInfoIndividual}>
        <LoopIcon />
        <Typography className={classes.dateLabel} variant="subtitle1">{props.recurrenceMessage}</Typography>
      </div>
    </div>
  );
}
