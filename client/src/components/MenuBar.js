import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { SimpleDialog } from "./DialogFilterBy";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = React.useState({
    open: false,
    dialogItems: null,
  });
  const [selectedValue, setSelectedValue] = React.useState(undefined);

  const handleClickOpenRooms = () => {
    setOpenDialog({
      open: true,
      dialogItems: {
        contents: props.rooms,
        name: "Rooms",
        type: "room",
      },
    });
  };

  const handleClickOpenTypes = () => {
    setOpenDialog({
      open: true,
      dialogItems: {
        contents: props.categories,
        name: "Sensor Types",
        type: "sensor-type",
      },
    });
  };

  const handleClose = (value) => {
    setOpenDialog({ open: false, dialogItems: null });
    setSelectedValue(value);
    if (value) {
      props.selectItem({ selected: value, type: openDialog.dialogItems.type });
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Button size="small" onClick={props.showAllSensors} color="inherit">
            All
          </Button>
          <Button size="small" onClick={handleClickOpenRooms} color="inherit">
            Rooms
          </Button>
          <Button size="small" onClick={handleClickOpenTypes} color="inherit">
            Types
          </Button>
        </Toolbar>
      </AppBar>
      {openDialog.dialogItems !== null ? (
        <SimpleDialog
          name={openDialog.dialogItems.name}
          type={openDialog.dialogItems.type}
          contents={openDialog.dialogItems.contents}
          selectedValue={selectedValue}
          open={openDialog.open}
          onClose={handleClose}
        />
      ) : null}
    </div>
  );
}
