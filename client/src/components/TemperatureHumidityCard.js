import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import icon from "../assets/thermometer.png"
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
    textAlign: 'center',
  }
}));

export default function OutlinedCard(props) {
  const classes = useStyles();
  
  
  const content = {
    roomName: 'roomName',
    device: 'deviceId',
    temperature: "-" ,
    humidity: "-",
    ...props.content
  };

  return (
    <Card className={classes.root} variant="outlined">
      {/* <CardHeader title="Sensor" /> */}

      <CardContent>
        <Typography className={classes.title} color="secondary" gutterBottom>
         {props.roomName}
        </Typography>
        <Typography variant="h5" component="h2">
          TempHum
        </Typography>
        <Typography className={classes.pos} color="secondary">
        {props.device}
        </Typography>
      </CardContent>
      <CardMedia
        className={classes.media}
        image={icon}
        title="Temperature"
      />
      <CardContent>
        <Typography variant="h5" className={classes.degrees} >
          {props.temperature} &#8451;
          <br />
          
        </Typography>
        <Typography variant="h5" className={classes.degrees} >
          {props.humidity} %
          <br />
          </Typography>

      </CardContent>
    </Card>
  );
}
