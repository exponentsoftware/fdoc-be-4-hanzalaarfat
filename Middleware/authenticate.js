const jwt = require("jsonwebtoken");
// const User = require("../Models/User");

exports.requireSigninAdmin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const admin = jwt.verify(token, process.env.SECRET_KEY_ADMIN);
    req.user = admin;
    // console.log("admin .......", admin);
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }
  next();
};

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    // console.log("user .......", user);
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }
  next();
};
