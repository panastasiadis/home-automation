import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import RouterIcon from "@material-ui/icons/Router";
import RoomIcon from "@material-ui/icons/Room";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";

const useStyles = makeStyles((theme) => ({
  root: {
    // width: "100%",
    backgroundColor: "white",
    borderRadius: "10px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: "column",
  },
  info: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    borderRadius: "10px",
    // backgroundColor: theme.palette.secondary.main,
    // border:`2px solid ${theme.palette.secondary.main}`,
    margin: theme.spacing(1),
  },
  deviceInfoIndividual: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
  divContent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  roomInfo: {
    display: "flex",
    justifyContent: "center",
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
}));

export default function OutlinedCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.info}>
        <div className={classes.roomInfo}>
          <RoomIcon />
          <Typography variant="h5">{props.roomName}</Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <BlurCircularIcon />
          <Typography variant="subtitle1" component="subtitle1">
            {props.name}
          </Typography>
        </div>
        <div className={classes.deviceInfoIndividual}>
          <RouterIcon />
          <Typography variant="subtitle1" component="subtitle1">
            {props.device}
          </Typography>
        </div>
      </div>
    </div>
  );
}
