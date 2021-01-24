import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 14,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function CustomizedSelects(props) {
  const classes = useStyles();
  const [quantity, setQuantity] = React.useState("");
  const [comparison, setComparison] = React.useState("");
  const handleChange = (event) => {
    setComparison(event.target.value);
    props.selectComparison(event.target.value);
  };

  const handleInput = (event) => {
    setQuantity(event.target.value);
    props.selectQuantity(event.target.value);
  };
  return (
    <div>
      <FormControl className={classes.margin} focused>
        <InputLabel required id="demo-customized-select-label">
          Compare
        </InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={comparison}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"Below"}>Below</MenuItem>
          <MenuItem value={"Over"}>Over</MenuItem>
          <MenuItem value={"Equal To"}>Equal To</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.margin} focused>
        <InputLabel required htmlFor="demo-customized-textbox">Quantity</InputLabel>
        <BootstrapInput
          type="number"
          id="demo-customized-textbox"
          value={quantity}
          onChange={handleInput}
        />
      </FormControl>
    </div>
  );
}
