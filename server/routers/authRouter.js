const express = require('express');

require('dotenv').config()
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt')

const USERS_URL = "http://localhost:3000/users"
const router = express.Router();


router.route('/login').post(async (req,res)=> {
  const { username, password} = req.body; 
   try {
        //check if the provided username and password mache a user
        const response = await axios.get(USERS_URL)
        const {data:users} = response;
        const foundUser = users.find(user => user.username === username);
        if(!foundUser)return res.sendStatus(401); //unauthorized
        //check if match password 
        const match = await bcrypt.compare(password, foundUser.password)
        if(match){
          const roles = Object.values(foundUser.roles).filter(Boolean)
            const tokenPayload = {
              userInfo:{
                username: foundUser.username,
                roles: roles,
                id:foundUser._id
                },
              };
              
              const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_SECRET_TOKEN, {expiresIn: "30s"});
              const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_SECRET_TOKEN, {expiresIn: "1d"});
              const currentUser = {...foundUser, refreshToken}
              console.log(currentUser);
              await axios.put(USERS_URL, currentUser)
              res.cookie('jwt' , refreshToken , {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
              res.header('Authorization', `Bearer ${accessToken}`);
              res.json({ accessToken: accessToken, roles: roles , id:foundUser._id, 'success' : `User ${username} Is Loged in`} );
        } else {
            return res.sendStatus(401)
        }
         } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
})

  module.exports = router;