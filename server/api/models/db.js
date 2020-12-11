const mongoose = require("mongoose");

const url =
  "mongodb+srv://panagiotis_an:3101@cluster0.9glmt.mongodb.net/my-home-auto-db?retryWrites=true&w=majority";

const connectDb = (callbackFunc) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  //Get the default connection
  const db = mongoose.connection;

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

//close the connection to database and then allow the app to exit
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected through " + msg);
    callback();
  });
};

//Handle exit for database
process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    process.exit(0);
  });
});

//handle nodemon restart
process.once("SIGUSR2", function () {
  gracefulShutdown("nodemon restart", () => {
    process.kill(process.pid, "SIGUSR2");
  });
});

//! maybe delete this one because i dont use heroku
process.on("SIGTERM", () => {
  gracefulShutdown("Heroku app shutdown", () => {
    process.exit(0);
  });
});

module.exports = {connectDb};
