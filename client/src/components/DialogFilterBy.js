import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import Typography from "@material-ui/core/Typography";
import RoomIcon from "@material-ui/icons/Room";
import CategoryIcon from "@material-ui/icons/Category";
// const capitalize = (s) => {
//   return s && s[0].toUpperCase() + s.slice(1);
// };

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  dialogPaper: {
    // minWidth: "50vh",
  },
  emptyContentLabel: {
    margin:36,
  },
}));

export function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(undefined);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <div className={classes.root}>

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
                <ListItemText primary={item} />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography
          variant="body1"
          color="secondary"
          align="center"
          className={classes.emptyContentLabel}
        >
          {"No "}
          {props.name}
          {" found."}
        </Typography>
      )}
    </Dialog>
    </div>
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

  return (
    <div>
      <ListItem button onClick={handleClickOpen}>
        <ListItemIcon>
          {props.type === "room" ? <RoomIcon color="primary"/> : <CategoryIcon color="primary"/>}
        </ListItemIcon>
        <ListItemText primary={props.name} />
      </ListItem>
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
