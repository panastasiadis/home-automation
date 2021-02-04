import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { getSensorOption } from '../../../utils/SensorSpecific';

const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  menuItem: {
    padding: theme.spacing(1),
  },
}));

export default function SensorOptionsMenu(props) {
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    props.selectOption(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    setSelectedOption('');
  }, [props.clearEntries]);

  const sensorOptions = getSensorOption(props.outputType);
  return (
    <div>
      <FormControl required className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Option</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={selectedOption}
          onChange={handleChange}
        >
          {sensorOptions
            ? sensorOptions.map((el, index) => {
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
