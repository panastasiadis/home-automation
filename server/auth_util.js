// generate token using secret from process.env.JWT_SECRET
var jwt = require("jsonwebtoken");

// generate token and return it
function generateToken(user) {
  if (!user) {
    return null;
  }

  let u = {
    userId: user.userId,
    name: user.name,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24, // expires in 24 hours
  });
}

// return basic user details
function getCleanUser(user) {
  if (!user) {
    return null;
  }

  return {
    userId: user.userId,
    name: user.name,
    username: user.username,
    isAdmin: user.isAdmin,
  };
}

module.exports = {
  generateToken,
  getCleanUser,
};
