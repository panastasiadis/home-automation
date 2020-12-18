import React, { Component } from "react";
import axios from "axios";
import TemperatureHumidityCard from "./TemperatureHumidityCard";
import RelayCard from "./RelayCard";
import Grid from "@material-ui/core/Grid";

const ROOMS_URL = "http://localhost:5000/api/rooms";

class Fetcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      rooms: [],
    };
  }

  componentDidMount = () => {
    this.fetchRoomsAsync();
  };

  render = () => {
    return gridItemsChooser(this.state.rooms);
  };

  async fetchRoomsAsync() {
    try {
      this.setState({ ...this.state, isFetching: true });
      const response = await axios.get(ROOMS_URL);
      this.setState({ rooms: response.data, isFetching: false });
    } catch (e) {
      console.log(e);
      this.setState({ ...this.state, isFetching: false });
    }
  }
}

const gridItemsChooser = (rooms) => {
  let gridItems = null;
  for (const room of rooms) {
    const roomName = room._id;
    for (const device of room.devices) {
      const deviceName = device._id;
      gridItems = device.sensors.map((sensor) => {
        if (sensor.sensorType === "Temperature-Humidity") {
          return (
            <Grid item xs={12} md={6} lg={4} key={sensor._id}>
              <TemperatureHumidityCard
                roomName={roomName}
                device={deviceName}
                temperature={sensor.currentMeasurement.temperature}
                humidity={sensor.currentMeasurement.humidity}
              />
            </Grid>
          );
        } else if (sensor.sensorType === "Relay") {
          return <Grid item xs={12} md={6} lg={4} key={sensor._id}>
            <RelayCard>

            </RelayCard>
          </Grid>;
        }
      });
    }
  }
  return gridItems;
};

export default Fetcher;
