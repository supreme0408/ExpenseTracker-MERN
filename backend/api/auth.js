const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.post('/register',async (req,res)=>{
    try {
        const { username, email,password } = req.body;
        
        if (password==='') {
          return res.status(400).json({ message: 'Password is required' });
        }
    
        const saltRounds = 8;
    
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const count = await User.countDocuments();
        let userId;
        if(count<10){
          userId = "UA0"+ (count+1);
        }
        else{
          userId = "UA"+ (count+1);
        }
    
        const newUser = new User({ username, email, password: hashedPassword,uid:userId });
    
        await newUser.save();
        console.log("Register Success: User registered successfully with Uid "+userId);
        res.status(201).json({ message: 'User registered successfully with UserId '+userId });
      } catch (error) {
        console.log("Register Error:"+error.message);
        res.status(500).json({ message: error.message });
      }
})

router.post('/login',async(req,res)=>{
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
          console.log("Login Error: User not found");
          return res.status(404).json({ message: 'User not found' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          console.log("Login Error: Invalid password");
          return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ username: user.username, uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({token, message:'Login Success' });
        console.log("Login Success: User Logged in successfully");
      } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: error.message });
      }
})

router.get('/user',authMiddleware,async (req, res) => {
  try {
    
    const user = req.user; // User object set in the middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send the user data as a response
    res.status(200).json({
      uid: user.uid,
      username: user.username,
      email: user.email,
      netBalance: user.netBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout',(req, res) => {
  // Clear the session/token or perform any necessary logout operations
  // For example, if using tokens, you might invalidate the token or clear it from the client-side
  res.clearCookie('token'); // Clear token from cookies
  console.log("Logout Success: User Logged out successfully");
  res.status(200).json({ message: 'Logged out successfully' });
})
module.exports = router;