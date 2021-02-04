import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import { getUser, removeUserSession } from '../utils/Common';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Sensors from './Sensors/Sensors';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from './DialogFilterBy';
import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Actions from './Actions/Actions';
import MenuBar from './MenuBar';

import { DashboardBackground, AppBarLogo } from '../utils/AssetImages';

function Copyright() {
  return (
    <Typography variant="body2" color="textPrimary" align="center">
      {'Copyright © '}
      {'Home Automation '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: theme.palette.secondary.main,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    paddingTop: 5,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(0),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(1),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: '10px',
    backgroundColor: theme.palette.secondary.main,
  },
  primaryAction: {
    borderRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  currentTab: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  hiMessage: {
    marginRight: theme.spacing(2),
  },
  behindBackground: {
    backgroundImage: `url(${DashboardBackground})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, selectItem] = React.useState({
    selected: 'All',
    type: 'all',
  });

  // handle click event of logout button
  const handleLogout = () => {
    // const mqttClient = mqttService.getClient();
    // mqttService.closeConnection(mqttClient);
    removeUserSession();
    props.history.push('/login');
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAllButton = () => {
    selectItem({
      selected: 'All',
      type: 'all',
    });
  };

  const showActions = () => {
    selectItem({
      selected: 'Actions',
      type: 'actions',
    });
  };

  let currentlyDisplayedItem = {
    tab: 'All',
    content: null,
  };
  switch (selectedItem.type) {
    case 'room':
      currentlyDisplayedItem.tab = 'Room';
      currentlyDisplayedItem.content = selectedItem.selected;
      break;
    case 'sensor-type':
      currentlyDisplayedItem.tab = 'Sensor Type';
      currentlyDisplayedItem.content = selectedItem.selected;
      break;
    case 'actions':
      currentlyDisplayedItem.tab = 'Actions';
      currentlyDisplayedItem.content = null;
      break;
    default:
      currentlyDisplayedItem.tab = 'All';
      currentlyDisplayedItem.content = null;
      break;
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
          <div className={classes.title}>
            <Link
              href="/"
              component={RouterLink}
              to="/"
              color="primary"
              underline="none"
              variant="h5"
            >
              {<img src={AppBarLogo} alt="" height={50} />}
            </Link>
          </div>

          <Typography variant="body2" className={classes.hiMessage}>
            {'Hi, '}
            {user.name}
          </Typography>
          <Button
            variant="contained"
            className={classes.primaryAction}
            onClick={handleLogout}
            color="primary"
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
        onClose={handleDrawerClose}
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
              <DashboardIcon color="primary" />
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
            name="Sensor Types"
            type="sensor-type"
          />
        </List>
        <Divider />
        <List>
          <ListItem button onClick={showActions}>
            <ListItemIcon>
              <AssignmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Actions" />
          </ListItem>

          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        </List>
      </Drawer>
      <div className={classes.behindBackground}>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <MenuBar
            selectItem={selectItem}
            rooms={rooms}
            categories={categories}
            showAllSensors={handleAllButton}
          />
          <div className={classes.currentTab}>
            <Typography variant="h5" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="h6">
              {currentlyDisplayedItem.tab}
              {currentlyDisplayedItem.tab === 'All' ||
              currentlyDisplayedItem.tab === 'Actions'
                ? null
                : ' | '}
              {currentlyDisplayedItem.content}
            </Typography>
          </div>
          <Container maxWidth="lg" className={classes.container}>
            {selectedItem.selected === 'Actions' ? (
              <div>
                <Paper className={classes.paper} elevation={10}>
                  <Actions sensors={props.sensors} />
                </Paper>
              </div>
            ) : (
              <Sensors
                sensors={props.sensors}
                filtered={selectedItem.type}
                selected={selectedItem.selected}
              />
            )}
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default withRouter(Dashboard);
