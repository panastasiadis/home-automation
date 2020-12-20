import axios from "axios";
import mqttService from "./MQTT";
import React, { useEffect, useState, useRef } from "react";
import Sensor from "./Sensor";

const URL = "http://localhost:5000/active-sensors";
const client = mqttService.getClient(() => {});
mqttService.subscribe(client, "+/+/device");
let i = 0;
let messageHandler;
mqttService.onMessage(client, (topic, payload) =>
messageHandler(topic, payload)
);

const FetcherΜQTT = () => {
  const [data, setData] = useState({ sensors: [], isFetching: false });
  const dataRef = useRef(data);

  messageHandler = (topic, payload) => {

    const newData = {
      sensors: dataRef.current.sensors.map((sensorItem) => {
        // console.log("SensorItem", sensorItem);

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
    };
    dataRef.current = newData;
    setData(newData);
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

    fetchDevices();
  }, []);

  return data.sensors.map((sensor) => {
    return <Sensor sensor={sensor} mqttClient={client} key={sensor.name} />;
  });
};

export default FetcherΜQTT;
