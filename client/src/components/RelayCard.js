import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import LightBulbIcon from "../assets/lightbulb.png";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 122,
    display: "flex",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    marginLeft: 12,
    width: 122,
    height: 122,
  },
  degrees: {
    textAlign: "center",
  },
}));

export default function OutlinedCard(props) {
  const classes = useStyles();

  const content = {
    roomName: "roomName",
    device: "deviceId",
    ...props.content,
  };
  const roomsUrl = "http://localhost:5000/api/rooms/";
  return (
    <Card className={classes.root} variant="outlined">
      {/* <CardHeader title="Sensor" /> */}

      <CardContent>
        <Typography className={classes.title} color="secondary" gutterBottom>
          {content.roomName}
        </Typography>
        <Typography variant="h5" component="h2">
          Lightbulb
        </Typography>
        <Typography className={classes.pos} color="secondary">
          {content.device}
        </Typography>
        <Switch
          onChange={() => {
            fetch(roomsUrl)
              .then((res) => res.json())
              .then((result) => {
                console.log(result);
              });
          }}
        />
      </CardContent>
      <CardMedia
        className={classes.media}
        image={LightBulbIcon}
        title="Lightbulb"
      />
    </Card>
  );
}
