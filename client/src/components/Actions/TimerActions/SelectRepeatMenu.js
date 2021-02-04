import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function CustomizedSelects(props) {
  const classes = useStyles();
  const [recurrence, setRecurrence] = React.useState('');
  const [timeUnits, setTimeUnits] = React.useState('');
  console.log(recurrence);
  const handleChange = (event) => {
    setTimeUnits(event.target.value);
    props.selectTimeUnits(event.target.value);
  };

  const handleInput = (event) => {
    setRecurrence(event.target.value);
    props.selectRecurrence(event.target.value);
  };
  return (
    <div>
      <FormControl className={classes.margin} focused>
        <InputLabel htmlFor="demo-customized-textbox">
          Recurrence every
        </InputLabel>
        <BootstrapInput
          type="number"
          id="demo-customized-textbox"
          value={recurrence}
          onChange={handleInput}
        />
      </FormControl>
      <FormControl className={classes.margin} focused>
        <InputLabel id="demo-customized-select-label">Units</InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={timeUnits}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'Minutes'}>Minutes</MenuItem>
          <MenuItem value={'Hours'}>Hours</MenuItem>
          <MenuItem value={'Days'}>Days</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
