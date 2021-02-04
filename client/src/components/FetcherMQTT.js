import axios from 'axios';
import mqttService from '../utils/MQTT';
import React, { useEffect, useState, useRef } from 'react';
import AlertMessage from './AlertMessage';
import Dashboard from './Dashboard';
import { backendApiUrl } from '../utils/Config';

const URL = backendApiUrl.server + 'api/activeSensors';

const FetcherΜQTT = () => {
  const [data, setData] = useState({ sensors: [] });
  const dataRef = useRef(data);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // setData({ sensors: data.sensors, isFetching: true });
        const response = await axios.get(URL);
        setData({ sensors: response.data });

        dataRef.current = { sensors: response.data };

        for (const sensor of response.data) {
          mqttService.subscribe(client, sensor.pubTopic);
        }
      } catch (error) {
        console.log(error);
        setData({ sensors: [] });
      }
    };

    fetchDevices();

    const client = mqttService.getClient();
    console.log(client);

    const messageHandler = (topic, payload, packet) => {
      console.log(payload.toString(), topic);

      if (topic === 'browser') {
        const infoObj = JSON.parse(payload.toString());
        if (infoObj.action === 'disconnected') {
          const newData = {
            sensors: dataRef.current.sensors.filter((sensor) => {
              if (sensor.deviceId === infoObj.deviceId) {
                mqttService.unsubscribe(client, sensor.pubTopic);
              }
              return sensor.deviceId !== infoObj.deviceId;
            }),
            alertMessage: {
              device: infoObj.deviceId,
              reason: infoObj.action,
            },
          };
          dataRef.current = newData;
          setData(newData);
        } else if (infoObj.action === 'connected') {
          const existingSensor = dataRef.current.sensors.find(
            (el) => el.deviceId === infoObj.newSensors[0].deviceId
          );
          if (existingSensor) {
            console.log('Exists!!! No action taken!');
            return;
          } else {
            const newData = {
              sensors: dataRef.current.sensors.concat(infoObj.newSensors),
              alertMessage: {
                // show: true,
                device: infoObj.newSensors[0].deviceId,
                reason: infoObj.action,
              },
            };
            for (const sensor of infoObj.newSensors) {
              mqttService.subscribe(client, sensor.pubTopic);
            }
            dataRef.current = newData;
            setData(newData);
          }
        } else if (infoObj.action === 'action') {
          console.log(infoObj);
          const newData = {
            sensors: dataRef.current.sensors,
            alertMessage: {
              reason: infoObj.action,
              actionCategory: infoObj.actionInfo.actionCategory,
              command: infoObj.actionInfo.command,
              roomName: infoObj.actionInfo.roomName,
              sensorType: infoObj.actionInfo.sensorType,
            },
          };
          dataRef.current = newData;
          setData(newData);
        }
        return;
      }
    };

    client.on('message', messageHandler);

    return () => {
      console.log('Dashboard was unmounted!');
      client.off('message', messageHandler);
    };
  }, []);

  return (
    <div>
      <AlertMessage alertMessage={data.alertMessage} />
      <Dashboard sensors={data.sensors} alertMessage={data.alertMessage} />
    </div>
  );
};

export default FetcherΜQTT;
