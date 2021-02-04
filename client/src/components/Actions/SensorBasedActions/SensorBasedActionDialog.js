import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import SelectSensorMenu from '../common/SelectSensorMenu';
import SelectCommandMenu from '../common/SelectCommandMenu';
import SelectComparedQuantityMenu from './SelectComparedQuantityMenu';
import SelectMeasurementTypeMenu from './SelectMeasurementTypeMenu';
import SelectSensorOptionsMenu from './SelectSensorOptionsMenu';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { backendApiUrl } from '../../../utils/Config';
import {
  commandsByType,
  getSensorOutputType,
} from '../../../utils/SensorSpecific';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  wrapDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    // alignItems: "center",
    flexDirection: 'column',
  },
  picker: {
    padding: theme.spacing(1),
  },
  cancelButton: {
    marginRight: theme.spacing(1),
  },
  label: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    // textAlign: "center",
    color: 'white',
    borderRadius: '10px',
  },
}));
export default function SensorBasedActionDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedWhenSensor, setSelectedWhenSensor] = React.useState('');
  const whenSensorRef = useRef(selectedWhenSensor);
  const [selectedCommandSensor, setSelectedCommandSensor] = React.useState('');
  const cmdSensorRef = useRef(selectedCommandSensor);

  const [selectedCommand, setSelectedCommand] = React.useState('');
  const [selectedMeasurementType, setSelectedMeasurementType] = React.useState(
    ''
  );

  const [selectedQuantity, setSelectedQuantity] = React.useState('');
  const [selectedComparisonType, setSelectedComparisonType] = React.useState(
    ''
  );
  const [selectedSensorOption, setSelectedSensorOption] = React.useState('');

  const [clearWhenEntries, setClearedWhenEntries] = React.useState(null);
  const [clearCmdEntries, setClearedCmdEntries] = React.useState(null);

  const [status, setStatus] = React.useState({ message: null, color: null });
  const [loading, setLoading] = React.useState(false);
  // console.log(selectedDate, selectedSensor, selectedRecurrence);

  const handleClose = () => {
    props.closeDialog();
    setOpen(false);
    setStatus({ message: null, color: null });
    setSelectedCommandSensor('');
    setSelectedWhenSensor('');
    setSelectedCommand('');
    setSelectedMeasurementType('');
    setSelectedQuantity('');
    setSelectedComparisonType('');
    setSelectedSensorOption('');
    setClearedWhenEntries(null);
    setClearedCmdEntries(null);
  };

  const addAction = () => {
    setStatus({ message: null, color: null });
    setLoading(true);

    let cmdOnFail;
    if (selectedCommandSensor) {
      const { commandOnFailure } = commandsByType(
        selectedCommandSensor.type,
        selectedCommand
      );
      cmdOnFail = commandOnFailure;
    }

    axios
      .post(backendApiUrl.server + 'api/sensorBasedActions', {
        sensorType: selectedCommandSensor.type,
        sensorName: selectedCommandSensor.name,
        deviceId: selectedCommandSensor.deviceId,
        roomName: selectedCommandSensor.room,
        command: selectedCommand,
        commandTopic: selectedCommandSensor.commandTopic,
        registrationDate: Date.now(),
        measurementSensorName: selectedWhenSensor.name,
        measurementDeviceId: selectedWhenSensor.deviceId,
        measurementRoomName: selectedWhenSensor.room,
        measurementSensorType: selectedWhenSensor.type,
        commandOnFailure: cmdOnFail,
        comparisonType: selectedComparisonType,
        quantity: selectedQuantity,
        measurementType: selectedMeasurementType,
        option: selectedSensorOption,
      })
      .then((response) => {
        // console.log(response.data)
        props.updateActions(response.data._id);
        setLoading(false);
        setStatus({ message: 'Action added successfully', color: 'green' });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
          setStatus({ message: error.response.data.message, color: 'red' });
        }
        setLoading(false);
      });
  };

  if (selectedCommandSensor !== cmdSensorRef.current) {
    setSelectedCommand('');
    cmdSensorRef.current = selectedCommandSensor;
    setClearedCmdEntries(Math.random());
  }

  if (selectedWhenSensor !== whenSensorRef.current) {
    setSelectedMeasurementType('');
    setSelectedQuantity('');
    setSelectedComparisonType('');
    setSelectedSensorOption('');
    whenSensorRef.current = selectedWhenSensor;
    setClearedWhenEntries(Math.random());
  }

  let whenSensorOutputMenu = null;
  if (getSensorOutputType(selectedWhenSensor.type) === 'measurement') {
    whenSensorOutputMenu = (
      <SelectComparedQuantityMenu
        selectComparison={setSelectedComparisonType}
        selectQuantity={setSelectedQuantity}
        clearEntries={clearWhenEntries}
      />
    );
  } else if (getSensorOutputType(selectedWhenSensor.type) === 'options') {
    whenSensorOutputMenu =
      selectedMeasurementType === '' ? null : (
        <div className={classes.picker}>
          <SelectSensorOptionsMenu
            selectOption={setSelectedSensorOption}
            outputType={selectedMeasurementType}
          />
        </div>
      );
  }

  return (
    <div className={classes.root}>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Sensor-Based Action</DialogTitle>
        <DialogContent dividers>
          <div className={classes.wrapDiv}>
            <div className={classes.picker}>
              <Typography className={classes.label} variant="subtitle1">
                Trigger
              </Typography>
              <SelectSensorMenu
                sensors={props.sensors}
                selectSensor={setSelectedCommandSensor}
                isCommandSensor={true}
              />
            </div>
            {selectedCommandSensor === '' ? null : (
              <div className={classes.picker}>
                <SelectCommandMenu
                  type={selectedCommandSensor.type}
                  selectCommand={setSelectedCommand}
                  clearEntries={clearCmdEntries}
                />
              </div>
            )}
            <div className={classes.picker}>
              <Typography className={classes.label} variant="subtitle1">
                When
              </Typography>
              <SelectSensorMenu
                sensors={props.sensors}
                selectSensor={setSelectedWhenSensor}
                isCommandSensor={false}
              />
            </div>
            {selectedWhenSensor === '' ? null : (
              <div>
                <div className={classes.picker}>
                  <SelectMeasurementTypeMenu
                    type={selectedWhenSensor.type}
                    selectMeasurementType={setSelectedMeasurementType}
                    clearEntries={clearWhenEntries}
                  />
                </div>
                {whenSensorOutputMenu}
              </div>
            )}

            {status.message && (
              <>
                <small style={{ color: status.color }}>{status.message}</small>
                <br />
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          {loading === true ? (
            <CircularProgress />
          ) : (
            <div>
              <Button
                className={classes.cancelButton}
                variant="contained"
                onClick={handleClose}
                color="primary"
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={addAction} color="primary">
                Add Action
              </Button>
            </div>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
