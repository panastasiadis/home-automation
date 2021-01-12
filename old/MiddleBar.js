import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Sensors from "./Sensors";
import Container from "@material-ui/core/Container";
import FilterByButton from "./FilterByButton";
import Dialog from "./DialogFilterBy";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const [selectedItem, selectItem] = React.useState({
    selected: "All",
    type: "all",
  });

  const rooms = [...new Set(props.sensors.map((sensor) => sensor.room))];
  const categories = [...new Set(props.sensors.map((sensor) => sensor.type))];

  const handleAllButton = () => {
    selectItem({
      selected: "All",
      type: "all",
    });
  };

  let currentlyDisplayedItem = "All";
  if (selectedItem.type === "room") {
    currentlyDisplayedItem = "Room: " + selectedItem.selected;
  } else if (selectedItem.type === "sensor-type") {
    currentlyDisplayedItem = "Sensor type: " + selectedItem.selected;
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar variant="dense">
          <Typography className={classes.title}>
            {currentlyDisplayedItem}
          </Typography>
          <Button color="inherit" onClick={handleAllButton}>
            All
          </Button>
          <Dialog
            contents={rooms}
            selectItem={selectItem}
            name="Rooms"
            type="room"
          />
          <Dialog
            contents={categories}
            selectItem={selectItem}
            name="Types"
            type="sensor-type"
          />
          <FilterByButton
            contents={rooms}
            selectItem={selectItem}
            name="Rooms"
            type="room"
          />
          <FilterByButton
            contents={categories}
            selectItem={selectItem}
            name="Types"
            type="sensor-type"
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className={classes.container}>
        <Sensors
          sensors={props.sensors}
          filtered={selectedItem.type}
          selected={selectedItem.selected}
        />
      </Container>
    </div>
  );
}
