require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const scheduled = require("./api/controllers/actions")
const app = express();

const aedesBroker = require("./aedes_broker");
const db = require("./api/models/db");
const routesApi = require("./api/routes/index");
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(cors());

app.use("/api", routesApi);

app.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.headers["authorization"];
  if (!token) {
    return next();
  } //if no token, continue

  token = token.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});



db.connectDb(() => {
  // server listens to 3000
  const server = app.listen(port, function () {
    console.log("App: Running on port ", server.address().port);

    //connect to the mqtt broker
    aedesBroker.connect();

    app.get("/", (req, res) => {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid user to access it." });
      }
      // res.send("hello world!", req.user.name);
      res.status(200).send(req.user.name)
      console.log("Homepage is displayed");
    });

    app.post("/command", (req, res) => {
      console.log(req.body.topic, req.body.message);
      const topic = req.body.topic;
      const msg = req.body.message;

      aedesBroker.publishMessage(topic, msg);
      res.status(200).send("Message sent to mqtt");
    });

    app.get("/active-sensors", (req, res) => {
      res.send(aedesBroker.getActiveSensors());
    });
  });
});
