const { query } = require("express");

const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const Room = require("./api/models/rooms").Room;
const SensorModel = require("./api/models/rooms").Sensor;
const Measurement = require("./api/models/rooms").Measurement;
const port = 1883;

activeSensors = [];

const connect = () => {
  server.listen(port, function () {
    console.log("Broker: mqtt server started and listening on port ", port);
  });

  aedes.on("clientReady", function (client) {
    console.log(
      "Broker: Client Connected: \x1b[33m" +
        (client ? client.id : client) +
        "\x1b[0m"
    );
  });

  //triggered when a client is disconnected from the broker
  aedes.on("clientDisconnect", function (client) {
    //log to console which client was disconnected
    console.log(
      "Broker: Client Disconnected: \x1b[31m" +
        (client ? client.id : client) +
        "\x1b[0m"
    );
  });

  //when an mqtt client subscribes to a topic
  aedes.on("subscribe", (subscriptions, client) => {
    //get the subs of the client
    const subs = subscriptions.map((s) => s.topic);

    //find client in active sensors array
    const device = activeSensors.find((element) => {
      if (element.client_id === client.id) {
        return element;
      }
    });

    if (device) {
      device.sub_protocols = subs;
    }

    //log to console the client subscriptions
    console.log(
      "Broker: MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m subscribed to topics: " +
        subscriptions.map((s) => s.topic).join(",")
    );
  });

  aedes.on("unsubscribe", function (subscriptions, client) {
    console.log(
      "Broker: MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m unsubscribed from topics: " +
        subscriptions.join(",")
    );
  });

  //subscribe to initial message in which all the clients should send with their info
  aedes.subscribe("+/+/device", (packet, cb) => {
    const msg = packet.payload.toString();
    const nodeInfo = convertTopicToInfo(packet.topic.toString());

    if (msg !== "offline") {
      //get and parse the device info that is included in the message
      const payloadObject = JSON.parse(msg);
      payloadObject.deviceId = nodeInfo.deviceId;
      payloadObject.room = nodeInfo.room;
      payloadObject.last_time_active = "now";
      console.log(payloadObject);
      activeSensors.push(payloadObject);

      storeDevice(nodeInfo.room, nodeInfo.deviceId, payloadObject.sensors);

      cb();
    } else {
      handleDisconnectedDevice(nodeInfo.room, nodeInfo.deviceId);
    }
  });
};

const publishMessage = (topic, message) => {
  aedes.publish({
    cmd: "publish",
    qos: 2,
    topic: topic,
    payload: message,
    retain: false,
  });
};

const deliverFunc = (packet, cb) => {
  const info = convertTopicToInfo(packet.topic.toString());
  console.log(packet.payload.toString(), packet.topic.toString());

  storeSensorData(
    info.room,
    info.deviceId,
    info.sensorName,
    packet.payload.toString()
  );

  cb();
};

const handleDisconnectedDevice = async (room, deviceId) => {
  const roomDoc = await Room.findById(room);
  const device = roomDoc.devices.id(deviceId);

  device.status = "disconnected";
  device.timeOfDisconnection = getFixedDate();

  device.sensors.forEach((sensor) => {
    if (sensor.subTopic) {
      console.log("topic to unsub from: " + sensor.subTopic);
      aedes.unsubscribe(sensor.subTopic, deliverFunc);
    }
  });

  await roomDoc.save();
};

const storeSensorData = async (room, deviceId, sensorName, payload) => {
  const roomDoc = await Room.findById(room);
  const device = roomDoc.devices.id(deviceId);

  sensor = device.sensors.find((sensor) => sensorName === sensor._id);

  if (sensor.sensorType === "Temperature-Humidity") {
    const splitStr = payload.split("-");
    currentMeasurement = {
      temperature: splitStr[0],
      humidity: splitStr[1],
      timestamp: getFixedDate(),
    };

    sensor.currentMeasurement = currentMeasurement;
    const query = {
      sensorId: sensor._id,
      startTime: getFixedDate(0, 0),
      endTime: getFixedDate(59, 59),
    };

    const update = {
      $push: {
        measurements: currentMeasurement,
      },
      $inc: {
        measurementsCounter: 1,
        temperaturesSum: splitStr[0],
        humiditiesSum: splitStr[1],
      },
    };
    await roomDoc.save();

    await Measurement.findOneAndUpdate(query, update, {
      upsert: true,
      new: true,
    });
  } else if (sensor.sensorType === "Relay") {
    sensor.currentState = payload;
    await roomDoc.save();
  }
};

//get current hour of today but specify minutes and seconds
const getFixedDate = (seconds, minutes, hours, day, month, year) => {
  const date = new Date();
  if (year === undefined) {
    year = date.getFullYear();
  }
  if (month === undefined) {
    month = date.getMonth();
  }
  if (day === undefined) {
    day = date.getDay();
  }

  if (hours === undefined) {
    hours = date.getHours();
  }

  if (minutes === undefined) {
    minutes = date.getMinutes();
  }

  if (seconds === undefined) {
    seconds = date.getSeconds();
  }

  const localDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      seconds
    )
  );

  return localDate;
};

const storeDevice = async (roomName, deviceId, sensors) => {
  //find if room exists
  let roomDoc = await Room.findById(roomName);

  //if not create a new entry in database
  if (!roomDoc) {
    roomDoc = new Room({
      _id: roomName,
    });
  }

  //add new device to room document
  //if exists nothing will be added(addToSet feature)
  console.log(roomDoc.devices.addToSet({ _id: deviceId }));

  const device = roomDoc.devices.id(deviceId);
  device.status = "connected";

  topicPrefix = roomName + "/" + deviceId + "/";

  //save the document
  storeDeviceSensors(sensors, topicPrefix, device);

  await roomDoc.save();
};

const storeDeviceSensors = (sensors, topicPrefix, deviceSubDoc) => {
  console.log(sensors);
  let sensorToStore;
  deviceSubDoc.sensors = [];
  for (const sensor of sensors) {
    if (sensor.type === "relay") {
      topicToSub = topicPrefix + sensor.type + "-state" + "/" + sensor.name;
      sensorToStore = new SensorModel.relay({
        commandTopic: topicPrefix + sensor.type + "/" + sensor.name,
        _id: sensor.name,
        subTopic: topicToSub,
      });
    } else if (sensor.type === "temperature-humidity") {
      topicToSub = topicPrefix + sensor.type + "/" + sensor.name;

      sensorToStore = new SensorModel.temperatureHumidity({
        _id: sensor.name,
        subTopic: topicToSub,
      });
    }

    deviceSubDoc.sensors.push(sensorToStore);

    aedes.subscribe(topicToSub, deliverFunc);
  }
};

const convertTopicToInfo = (mqttTopic) => {
  const splitStr = mqttTopic.split("/");

  [room, deviceId, sensorType, sensorName] = splitStr;

  return {
    room,
    deviceId,
    sensorType,
    sensorName,
  };
};

module.exports = { publishMessage, connect };
