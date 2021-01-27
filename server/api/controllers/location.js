const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.getClientLocation = (req, res) => {
    console.log(req.body);
    sendJsonResponse(res, 200, {"message": "success"});
}