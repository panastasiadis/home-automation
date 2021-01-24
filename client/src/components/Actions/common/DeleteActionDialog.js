import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import { backendApiUrl } from "../../../utils/Config";

export default function ResponsiveDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const deleteAction = () => {
    setError(null);

    axios
      .delete(`${backendApiUrl.server}api/actions/${props.action._id}`, {
        data: props.action._id,
      })
      .then((response) => {
        props.updateActions(
          props.action._id.toString() + Math.random().toString(16).substr(2, 8)
        );
        setOpen(false);
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response) {
          if (error.response.status === 404) {
            setError(error.response.data.message);
          }
        } else setError("Something went wrong. Please try again later.");
      });
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} color="primary">
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this action?
          </DialogContentText>
          {error && (
            <>
              <small style={{ color: "red" }}>{error}</small>
              <br />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            onClick={handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            autoFocus
            onClick={deleteAction}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
