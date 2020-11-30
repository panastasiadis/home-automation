const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://panagiotis_an:3101@cluster0.9glmt.mongodb.net/my-home-auto-db?retryWrites=true&w=majority";

let dbClient;
let mongodb;

const connectDb = (callbackFunc) => {
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    dbClient = client;

    console.log("MongoDB: Connected to Database");
    db = client.db("my-home-auto-db");
    db.collection('devices');
    mongodb = db;
    callbackFunc();
  })
  .catch((error) => console.error(error));
}

const getDb = () => {
    return mongodb;
}

const closeDb = () => {
    dbClient.close();
}

module.exports = {
    connectDb,
    getDb,
    closeDb
};