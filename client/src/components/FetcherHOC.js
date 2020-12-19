import axios from "axios";
import TemperatureHumidityCard from "./TemperatureHumidityCard";
import RelayCard from "./RelayCard";
import Grid from "@material-ui/core/Grid";
import mqttService from "./MQTT";
import React, { useEffect, useState, useRef } from "react";

const URL = "http://localhost:5000/active-sensors";
let i = 0;
const client = mqttService.getClient(() => {});

const FetcherHooks = () => {
  const [data, setData] = useState({ sensors: [], isFetching: false });
  const dataRef = useRef(data);

  const messageHandler = (topic, payload) => {
    const newData = {
      sensors: dataRef.current.sensors.map((sensorItem) => {
        console.log("SensorItem", sensorItem);

        if (sensorItem.pubTopic === topic) {
          if (sensorItem.type === "temperature-humidity") {
            const splitStr = payload.toString().split("-");

            sensorItem.currentMeasurement = {
              temperature: splitStr[0],
              humidity: splitStr[1],
              // timestamp: getFixedDate(),
            };
          }
        }
        return sensorItem;
      }),
      isFetching: false,
    }
    dataRef.current = newData;
    setData(newData)
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setData({ sensors: data.sensors, isFetching: true });
        const response = await axios.get(URL);
        setData({ sensors: response.data, isFetching: false });
        dataRef.current = { sensors: response.data, isFetching: false };
        console.log(data, (i += 1));

        for (const sensor of response.data) {
          mqttService.subscribe(client, sensor.pubTopic);
        }
      } catch (error) {
        console.log(error);
        setData({ sensors: data.sensors, isFetching: false });
      }
    };
    mqttService.onMessage(client, (topic, payload) =>
      messageHandler(topic, payload)
    );

    fetchDevices();
  }, []);

  console.log(data, (i += 1));

  return data.sensors.map((sensor) => {
    if (sensor.type === "temperature-humidity") {
      return (
        <Grid item xs={12} md={6} lg={4} key={sensor.name}>
          <TemperatureHumidityCard
            roomName={sensor.room}
            device={sensor.deviceId}
            temperature={
              sensor.currentMeasurement
                ? sensor.currentMeasurement.temperature
                : "-"
            }
            humidity={
              sensor.currentMeasurement
                ? sensor.currentMeasurement.humidity
                : "-"
            }
          />
        </Grid>
      );
    }
    return null;
  });
};

export default FetcherHooks;
