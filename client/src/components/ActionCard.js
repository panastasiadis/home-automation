import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    // flexWrap: 'wrap',
    // "& > *": {
    //   margin: theme.spacing(1),
    //   width: theme.spacing(16),
    //   height: theme.spacing(16),
    // },
  },
}));

export default function SimplePaper() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <Typography variant="h6" component="h6">
          Sensor
        </Typography>
        <Typography variant="h6" component="h6">
          Room
        </Typography>
        <Typography variant="h6" component="h6">
          Device
        </Typography>
      </Paper>
    </div>
  );
}
