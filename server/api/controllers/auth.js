require("dotenv").config();

const utils = require("../../util");
const jwt = require("jsonwebtoken");

// static user details
const userData = {
  userId: "789879",
  password: "1312",
  name: "Home Owner",
  username: "homeowner",
  isAdmin: true,
};

module.exports.userSignIn = (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;
  console.log(user, pwd);
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password is required.",
    });
  }

  // return 401 status if the credential is not match.
  if (user !== userData.username || pwd !== userData.password) {
    return res.status(401).json({
      error: true,
      message: "Username or Password is wrong.",
    });
  }

  // generate token
  const token = utils.generateToken(userData);
  // get basic user details
  const userObj = utils.getCleanUser(userData);
  // return the token along with user details
  return res.json({ user: userObj, token });
};

module.exports.verifyToken = (req, res) => {
  let token = req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required.",
    });
  }

  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid token.",
      });
    }

    // return 401 status if the userId does not match.
    if (user.userId !== userData.userId) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    }

    // get basic user details
    let userObj = utils.getCleanUser(userData);
    return res.json({ user: userObj, token });
  });
};
