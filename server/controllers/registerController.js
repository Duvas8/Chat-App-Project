const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const registerNewUser = async(obj) => {
    const usersDB = await User.find()
    const { username, password} = obj;  
    if(!username || !password) return res.status(400).json("missing username or password");
    const duplicate = usersDB.find(per => per.username === username);
    if(duplicate)return res.status(409).json("Username Already Taken");
    try {
      const hashedPwd = await bcrypt.hash(password, 10);
      const newUser  = {username:username, password:hashedPwd}
      const registerUser = new User(newUser);
      await registerUser.save();
      return 'New User Registered!';
    } catch (err) {
      res.status(500).json({"message" : err.message })
    }
    
  }
  module.exports = { registerNewUser };