const express = require('express');

require('dotenv').config()
const axios = require('axios');

const USERS_URL = "http://localhost:3000/users"
const router = express.Router();

router.route('/').get(async (req,res)=> {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204);
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt;
    const response = await axios.get(USERS_URL)
    const {data:users} = response;
    const foundUser = users.find(per => per.refreshToken === refreshToken);
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true,  sameSite:'none', secure:true, maxAge: 24 * 60 * 60 * 1000})
        res.sendStatus(204)
    }
        
        const currentUser = {...foundUser, refreshToken:""}
              console.log(currentUser);
              await axios.put(USERS_URL, currentUser)
              res.clearCookie('jwt' , {httpOnly: true,  sameSite:'none', secure:true, maxAge: 24 * 60 * 60 * 1000})
              return res.sendStatus(204)
        }
)

  module.exports = router;