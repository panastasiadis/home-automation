import React from "react";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";

export default function FilterByRoomButton(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItem = (ev) => {
    props.selectItem({selected: ev.nativeEvent.target.outerText, type: props.type});
    // console.log(selectedItem);
  };

  return (
    <React.Fragment>
      <Button
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {props.name}
      </Button>
      {props.contents.length !== 0 ? (
        <Popover
          id={id}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          // keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          onClose={handleClose}
        >
          {props.contents.map((item) => {
            return (
              <MenuItem onClick={handleMenuItem} key={item}>
                {item}
              </MenuItem>
            );
          })}
        </Popover>
      ) : null}
    </React.Fragment>
  );
}
