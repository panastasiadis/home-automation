const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

module.exports.sensorsList = (req, res) => {
    sendJsonResponse(res, 200, {"status" : "success"});
};


module.exports.sensorsByRoom = (req, res) => {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.sensorsByDevice = (req, res) => {
    sendJsonResponse(res, 200, {"status" : "success"});
};