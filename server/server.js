var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const AedesBroker = require("./aedes_broker").MqttBroker;
const db = require("./db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db.connectDb(() => {
  // server listens to 3000
  const server = app.listen(3000, function () {
    console.log("App: Running on port ", server.address().port);

    const broker = new AedesBroker();
    //access the mqtt broker
    broker.connect();

    app.get("/", function (req, res) {
      res.send("hello world!");
      console.log("Homepage is displayed");
    });
    

    app.post("/command", (req, res) => {
      console.log(req.body.topic, req.body.message);
      const topic = req.body.topic;
      const msg = req.body.message;
    
      broker.publishMessage(topic, msg);
      res.status(200).send("Message sent to mqtt");
    });

    app.get("/measurements", function (req, res) {
      res.send("hello world!");
      console.log("ho");
    });

    app.get("/devices", function (req, res) {
      // res.send("hello world!");
      res.status(200).send(broker.activeSensors);
      console.log("ho");
    });
  });
});




process.on("SIGINT", () => {
  console.log("Closing...");
  db.closeDb();
  process.exit();
});
