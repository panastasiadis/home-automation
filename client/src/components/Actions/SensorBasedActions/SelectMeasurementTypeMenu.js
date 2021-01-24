import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {getMeasurementNamesByType} from "../../../utils/SensorSpecific";

const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 130,
  },
  menuItem: {
    padding: theme.spacing(1),
  },
}));



export default function MeasurementTypesMenu(props) {
  const classes = useStyles();
  const [selectedType, setSelectedType] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setSelectedType(event.target.value);
    props.selectMeasurementType(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const measurementTypes = getMeasurementNamesByType(props.type);
  return (
    <div>
      <FormControl required className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Measurement</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={selectedType}
          onChange={handleChange}
        >
          {measurementTypes
            ? measurementTypes.map((el, index) => {
                return (
                  <MenuItem value={el} key={index}>
                    {el}
                  </MenuItem>
                );
              })
            : null}
        </Select>
      </FormControl>
    </div>
  );
}
