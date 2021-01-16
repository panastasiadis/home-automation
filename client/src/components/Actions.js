import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CollapsibleTable from "./CollapsibleTable";
import TimerActionDialog from "./TimerActionDialog";
import ActionCard from "./ActionCard";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function MaterialUIPickers(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ActionCard />
      {/* <CollapsibleTable /> */}
      <TimerActionDialog sensors={props.sensors} />
    </div>
  );
}
