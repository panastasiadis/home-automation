import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import { getUser, removeUserSession } from "../utils/Common";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Sensors from "./Sensors";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Dialog from "./DialogFilterBy";
import mqttService from "./MQTT";

import { withRouter } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {"Home Automation "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: theme.palette.secondary.main,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  primaryAction: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  brand: {
    // lineHeight: 1,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    marginRight: 12,
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedItem, selectItem] = React.useState({
    selected: "All",
    type: "all",
  });

  // handle click event of logout button
  const handleLogout = () => {
    // const mqttClient = mqttService.getClient();
    // mqttService.closeConnection(mqttClient);
    removeUserSession();
    props.history.push("/login");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

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

  const rooms = [...new Set(props.sensors.map((sensor) => sensor.room))];
  const categories = [...new Set(props.sensors.map((sensor) => sensor.type))];
  const user = getUser();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          {/* <Link
            href="/"
            component={RouterLink}
            to="/"
            color="primary"
            underline="none"
            variant="h5"
            className={classes.brand}
          >
            {<img src={Logo} alt="" height={50} />}
          </Link> */}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard
          </Typography>
          <Typography
            component="h6"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {currentlyDisplayedItem}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            className={classes.primaryAction}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={handleAllButton}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="All" />
          </ListItem>
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
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Actions" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Sensors
            sensors={props.sensors}
            filtered={selectedItem.type}
            selected={selectedItem.selected}
          />
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

export default withRouter(Dashboard);
