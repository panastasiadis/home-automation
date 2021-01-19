import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import TimerIcon from "@material-ui/icons/Timer";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";
import TimerActionDialog from "./TimerActionDialog";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  action: {
    margin: theme.spacing(2),
  },
}));

export default function OpenIconSpeedDial(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedAction, setSelectedAction] = React.useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const selectTimerAction = () => {
    setSelectedAction("timerAction");
  };

  const closeDialog = () => {
    setSelectedAction(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let dialog = null;
  switch (selectedAction) {
    case "timerAction":
      dialog = (
        <TimerActionDialog
          sensors={props.sensors}
          updateActions={props.updateActions}
          closeDialog={closeDialog}
        />
      );
      break;

    default:
      break;
  }

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon"
        className={classes.speedDial}
        icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <SpeedDialAction
          className={classes.action}
          icon={<BlurCircularIcon />}
          tooltipTitle={"Sensor Driven"}
          tooltipOpen
          onClick={handleClose}
        />
        <SpeedDialAction
          className={classes.action}
          icon={<EditLocationIcon />}
          tooltipTitle={"Location Based"}
          tooltipOpen
          onClick={handleClose}
        />
        <SpeedDialAction
          className={classes.action}
          icon={<TimerIcon />}
          tooltipTitle={"Scheduled"}
          tooltipOpen
          onClick={selectTimerAction}
        />
        {/* <TimerActionDialog
          sensors={props.sensors}
          updateActions={props.updateActions}
        /> */}
        {dialog}
        {/* {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))} */}
      </SpeedDial>
    </div>
  );
}
