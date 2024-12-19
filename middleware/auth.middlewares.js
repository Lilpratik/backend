const User = require("../models/user.models");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// module.exports.userVerification = (req, res) => {
//   const token  = req.cookies.token;
//   if(!token) {
//     return res.json({ status: false });
//   }
//   jwt .verify(token, process.env.TOKEN_KEY, async (err, data) => {
//     if(err) {
//       return res.json({ status: false });
//     } else {
//       const user = await User.findOne(data.id)
//       if(user) return res.json({ status: true, user: user.username });
//       else return res.json({ status: false })
//     }
//   })
// }

module.exports.authenticateToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    if(!token) {
      return res.status(401).json({ message: "Access denied, token missing!" });
    }

    // use the JWT_SECRET environment variable for token userVerification
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;  //  attach user info to the request objects for access in the next middleware
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token or expired token" });
  }
};

module.exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied, you don't have permission to access this resource" });
    }
    next();
  };
};
