// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  // const token = req.cookies.token;
  const token = req.header('Authorization');
  // console.log("Inside authMiddleware "+token)
  
  if (token==='') {
    return res.status(401).json({ message: 'Authorization denied' });
  }
  try {
    // console.log("AuthMiddleware token:"+token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ username: decoded.username,uid: decoded.uid });
    console.log("User "+ req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
module.exports = authMiddleware;