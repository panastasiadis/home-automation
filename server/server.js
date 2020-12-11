const express = require("express");
const bodyParser = require("body-parser");
var app = express();

const aedesBroker = require("./aedes_broker");
const db = require("./api/models/db");
const routesApi = require("./api/routes/index");

app.use("/api", routesApi);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db.connectDb(() => {
  // server listens to 3000
  const server = app.listen(3000, function () {
    console.log("App: Running on port ", server.address().port);

    //connect to the mqtt broker
    aedesBroker.connect();

    app.get("/", function (req, res) {
      res.send("hello world!");
      console.log("Homepage is displayed");
    });

    app.post("/command", (req, res) => {
      console.log(req.body.topic, req.body.message);
      const topic = req.body.topic;
      const msg = req.body.message;

      aedesBroker.publishMessage(topic, msg);
      res.status(200).send("Message sent to mqtt");
    });

  });
});


