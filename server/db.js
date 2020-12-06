const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://panagiotis_an:3101@cluster0.9glmt.mongodb.net/my-home-auto-db?retryWrites=true&w=majority";

let dbClient;
let mongodb;

const connectDb = (callbackFunc) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  //Get the default connection
  const db = mongoose.connection;

  // MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  //   .then((client) => {
  //     dbClient = client;

  //     console.log("MongoDB: Connected to Database");
  //     db = client.db("my-home-auto-db");
  //     mongodb = db;
  //     callbackFunc();
  //   })
  //   .catch((error) => console.error(error));
  db.on("connected", () => {
    console.log("MongoDB: Connected to Database");
    callbackFunc();
  });

  db.on("disconnected", () => {
    console.log("MongoDB: Mongoose disconnected!");
  });

  db.on("error", (err) => {
    console.log("MongoDB: Mongoose connection error: " + err);
  });

};

const getDb = () => {
  return mongodb;
};

const closeDb = () => {
  dbClient.close();
};

const storeSensorData = (sensorObj) => {
  let update;
  let query;
  if (sensorObj.type === "temperature-humidity") {
    const startTime = getFixedDate(0, 0);
    const endTime = getFixedDate(59, 59);
    const nowDate = getFixedDate();

    const splittedStr = sensorObj.payload.split("-");
    const temperature = parseFloat(splittedStr[0]);
    const humidity = parseFloat(splittedStr[1]);

    query = {
      deviceId: sensorObj.deviceId,
      room: sensorObj.room,
      startTime: startTime,
      endTime: endTime,
    };

    update = {
      $push: {
        measurements: {
          temperature: temperature,
          humidity: humidity,
          timestamp: nowDate,
        },
      },
      $inc: {
        measurement_counter: 1,
        temperatures_sum: temperature,
        humidities_sum: humidity,
      },
    };

    getDb()
      .collection("measurements")
      .updateOne(query, update, { upsert: true });
  } else if (sensorObj.type === "lightbulb") {
    query = {
      deviceId: sensorObj.deviceId,
      room: sensorObj.room,
      type: "lightbulb",
    };
    update = {
      $set: {
        commands: { openCommand: "ON", closeCommand: "OFF" },
        current_state: "OFF",
        commandTopic: sensorObj.topic,
      },
    };

    getDb().collection("relays").updateOne(query, update, {
      upsert: true,
    });
  } else if (sensorObj.type === "lightbulb/state") {
    query = {
      deviceId: sensorObj.deviceId,
      room: sensorObj.room,
      type: "lightbulb",
    };

    update = {
      $set: {
        current_state: sensorObj.payload,
      },
    };

    getDb().collection("relays").updateOne(query, update, { upsert: true });
  }
};

const getMeasurements = (callbackFunc) => {
  // date = getFixedDate(0,0,3,4,12,2020);
  // console.log(date);
  getDb()
    .collection("measurements")
    .find({})
    .toArray()
    .then((results) => {
      console.log(results);
      callbackFunc(results);
    })
    .catch((error) => {
      console.error();
    });
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

module.exports = {
  connectDb,
  getDb,
  closeDb,
  storeSensorData,
  getMeasurements,
};
