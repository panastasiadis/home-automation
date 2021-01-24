import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {commandsByType} from "../../../utils/SensorSpecific";

const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  menuItem: {
    padding: theme.spacing(1),
  },
}));



export default function CommandMenu(props) {
  const classes = useStyles();
  const [selectedCommand, setSelectedCommand] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setSelectedCommand(event.target.value);
    props.selectCommand(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const commandsArray = commandsByType(props.type);
  return (
    <div>
      <FormControl required className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Command</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={selectedCommand}
          onChange={handleChange}
        >
          {commandsArray
            ? commandsArray.map((el, index) => {
                return (
                  <MenuItem value={el.command} key={index}>
                    {el.description}
                  </MenuItem>
                );
              })
            : null}
        </Select>
      </FormControl>
    </div>
  );
}
