const express = require('express');
const User = require('../models/userModel')
const bcrypt = require('bcrypt')


const router = express.Router();

router.route('/').post(async (req,res)=> {
  const usersDB = await User.find()
    const { username, password} = req.body; 
    if(!username || !password) return res.status(400).json("missing username or password");
    const duplicate = usersDB.find(per => per.username === username);
    if(duplicate)return res.status(409).json("Username Already Taken");
    try {
      const hashedPwd = await bcrypt.hash(password, 10);
      const newUser  = {
        username:username,
        roles:{ "User":2001},
        password:hashedPwd
        }
      const registerUser = new User(newUser);
      await registerUser.save();
      res.json(newUser)
      return 'New User Registered!';
    } catch (err) {
      res.status(500).json({"message" : err.message })
    }
  })

  module.exports = router;