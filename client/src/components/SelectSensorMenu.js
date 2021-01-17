import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import RouterIcon from "@material-ui/icons/Router";
import RoomIcon from "@material-ui/icons/Room";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";

const useStyles = makeStyles((theme) => ({
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  menuItem: {
    padding: theme.spacing(1),
    display: "flex"
  },
}));

export default function ControlledOpenSelect(props) {
  const classes = useStyles();
  const [selectedSensor, setSelectedSensor] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setSelectedSensor(event.target.value);
    props.selectSensor(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  let commandSensors = null;
  if (props.sensors) {
    commandSensors = props.sensors.filter((sensor) => {
      return sensor.commandTopic;
    });
  }

  // console.log(selectedSensor);
  return (
    <div>
      <FormControl required className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Sensor</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={selectedSensor}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          {commandSensors
            ? commandSensors.map((sensor) => {
                return (
                  <MenuItem value={sensor} key={sensor.name}>
                    {/* <ListItemIcon>
                      <BlurCircularIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">{sensor.name}</Typography>
                    <ListItemIcon>
                      <RoomIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">{sensor.room}</Typography>
                    <ListItemIcon>
                      <RouterIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">{sensor.deviceId}</Typography> */}
                    <BlurCircularIcon />
                    {"  "}
                    {sensor.name}
                    {"  "}
                    <RoomIcon />
                    {"  "}
                    {sensor.room}
                    {"  "}
                    <RouterIcon />
                    {"  "}
                    {sensor.deviceId}
                  </MenuItem>
                );
              })
            : null}
        </Select>
      </FormControl>
    </div>
  );
}
