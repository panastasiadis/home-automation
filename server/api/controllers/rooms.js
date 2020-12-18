const Room = require("../models/rooms").Room;

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.roomsList = (req, res) => {

  //.select("_id") to request only the ids
  Room.find({}).exec((err, roomDocs) => {
    console.log(roomDocs);
    if (roomDocs.length === 0) {
      sendJsonResponse(res, 404, { message: "No rooms found" });
      return;
    } else if (err) {
      sendJsonResponse(res, 404, err);
      return;
    }
    sendJsonResponse(res, 200, roomDocs);
  });
};

module.exports.roomReadOne = (req, res) => {
  if (req.params && req.params.roomname) {
    Room.findById(req.params.roomname).exec((err, roomDoc) => {
      if (!roomDoc) {
        sendJsonResponse(res, 404, {
          message: "roomname " + req.params.roomname + " not found",
        });
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, roomDoc);
    });
  } else {
    sendJsonResponse(res, 404, {
      message: "No roomname in request",
    });
  }
};
