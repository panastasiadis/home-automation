import axios from "axios";
import mqttService from "./MQTT";
import React, { useEffect, useState, useRef } from "react";
import Sensors from "./Sensors";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Switch, Route } from "react-router-dom";
import AlertMessage from "./AlertMessage";

// import { Typography } from "@material-ui/core";

const URL = "http://192.168.1.66:5000/active-sensors";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  appBarSpacer: theme.mixins.toolbar,
}));

const FetcherΜQTT = () => {
  const classes = useStyles();

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

    const messageHandler = (client, topic, payload) => {
      if (topic === "browser") {
        const infoObj = JSON.parse(payload.toString());
        if (infoObj.action === "disconnected") {
          const newData = {
            sensors: dataRef.current.sensors.filter((sensor) => {
              if (sensor.deviceId === infoObj.deviceId) {
                mqttService.unsubscribe(client, sensor.pubTopic);
              }
              return sensor.deviceId !== infoObj.deviceId;
            }),
            alertMessage: {
              // show: true,
              device: infoObj.deviceId,
              reason: infoObj.action,
            },
          };
          dataRef.current = newData;
          setData(newData);
        } else if (infoObj.action === "connected") {
          const existingSensor = dataRef.current.sensors.find(
            (el) => el.deviceId === infoObj.newSensors[0].deviceId
          );
          if (existingSensor) {
            console.log("Exists!!! No action taken!");
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
        }
        return;
      }
      const message = payload.toString();

      const newData = {
        sensors: dataRef.current.sensors.map((sensorItem) => {
          // console.log("SensorItem", sensorItem);

          if (sensorItem.pubTopic === topic) {
            if (sensorItem.type === "temperature-humidity") {
              const splitStr = message.split("-");

              sensorItem.currentMeasurement = {
                temperature: splitStr[0],
                humidity: splitStr[1],
                // timestamp: getFixedDate(),
              };
            }
          }
          return sensorItem;
        }),
      };
      dataRef.current = newData;
      setData(newData);
    };

    const client = mqttService.getClient(() => {});

    mqttService.onMessage(client, (client, topic, payload) =>
      messageHandler(client, topic, payload)
    );
  }, []);

  return (
    <main>
      <div className={classes.appBarSpacer} />
      <AlertMessage alertMessage={data.alertMessage} />
      <Switch>
        <Route exact path="/">
          <Container maxWidth="lg" className={classes.container}>
            <Sensors sensors={data.sensors} />;
          </Container>
        </Route>
        <Route exact path="/rooms">
          <h2>Here are displayed the rooms of the house.</h2>;
        </Route>
      </Switch>
    </main>
  );
};

export default FetcherΜQTT;
