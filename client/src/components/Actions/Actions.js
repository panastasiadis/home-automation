import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ActionCard from './ActionCard';
import axios from 'axios';
import NoContentPage from '../NoContentPage';
import ActionsSpeedDial from './ActionsSpeedDial';
import { backendApiUrl } from '../../utils/Config';

const URL = backendApiUrl.server + 'api/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

export default function MaterialUIPickers(props) {
  const classes = useStyles();
  const [actionData, setActions] = useState({
    actions: [],
    isFetching: false,
  });
  const [effectUpdate, setEffectUpdate] = useState(null);

  const rerenderOnActionChange = (id) => {
    setEffectUpdate(id);
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setActions({ actions: [], isFetching: true });
        const response = await axios.get(URL);
        setActions({ actions: response.data, isFetching: false });
      } catch (error) {
        console.log(error);
        setActions({ actions: [], isFetching: false });
      }
    };

    fetchDevices();

    return () => {
      console.log('unmounting actions');
    };
  }, [effectUpdate]);

  return (
    <div className={classes.root}>
      {actionData.actions.length !== 0 ? (
        actionData.actions.map((action) => {
          return (
            <div className={classes.root} key={action._id}>
              <ActionCard
                action={action}
                updateActions={rerenderOnActionChange}
              />
            </div>
          );
        })
      ) : (
        <NoContentPage displayItem="Actions" />
      )}
      <ActionsSpeedDial
        sensors={props.sensors}
        updateActions={rerenderOnActionChange}
      />
    </div>
  );
}
