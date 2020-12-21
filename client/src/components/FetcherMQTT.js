import axios from "axios";
import mqttService from "./MQTT";
import React, { useEffect, useState, useRef } from "react";
import Sensor from "./Sensor";

const URL = "http://localhost:5000/active-sensors";

const convertTopicToInfo = (mqttTopic) => {
  const splitStr = mqttTopic.split("/");

  const [room, deviceId, sensorType, sensorName] = splitStr;

  return {
    room,
    deviceId,
    sensorType,
    sensorName,
  };
};

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
        // console.log(data, (i += 1));

        for (const sensor of response.data) {
          mqttService.subscribe(client, sensor.pubTopic);
        }
      } catch (error) {
        console.log(error);
        setData({ sensors: [] });
      }
    };

    fetchDevices();

    const messageHandler = (topic, payload) => {
      if (topic === "browser") {
        const infoObj = JSON.parse(payload.toString());
        if (infoObj.action === "disconnected") {
          const newData = {
            sensors: dataRef.current.sensors.filter(
              (sensor) => sensor.deviceId !== infoObj.deviceId
            ),
          };
          dataRef.current = newData;
          setData(newData);
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

    mqttService.onMessage(client, (topic, payload) =>
      messageHandler(topic, payload)
    );
  }, []);

  return data.sensors.map((sensor) => {
    return <Sensor sensor={sensor} key={sensor.name} />;
  });
};

export default FetcherΜQTT;
