import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import Typography from "@material-ui/core/Typography";

const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  dialogPaper: {
    minWidth: "80vh",
  },
  emptyContentLabel: {
    marginLeft: 36,
    marginBottom: 12,
  },
}));

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(undefined);
  };

  const handleListItemClick = (value) => {
    onClose(value.toLowerCase());
  };

  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">{props.name}</DialogTitle>
      {props.contents.length !== 0 ? (
        <List>
          {props.contents.map((item) => {
            return (
              <ListItem
                button
                onClick={() => handleListItemClick(item)}
                key={item}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    {props.type === "room" ? (
                      <MeetingRoomIcon />
                    ) : (
                      <DeviceHubIcon />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={capitalize(item)} />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography
          variant="body1"
          color="secondary"
          align="left"
          className={classes.emptyContentLabel}
        >
          {"No "}
          {props.name}
          {" found."}
        </Typography>
      )}
    </Dialog>
  );
}

export default function SimpleDialogDemo(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(undefined);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
    if (value) {
      props.selectItem({ selected: value, type: props.type });
    }
  };
  console.log(selectedValue);

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.name}
      </Button>
      <SimpleDialog
        name={props.name}
        type={props.type}
        contents={props.contents}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
