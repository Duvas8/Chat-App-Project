const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshAccessToken = async (req, res) => {
    console.log(req);
    console.log("test");
    try {
        const usersDB = await User.find();
console.log("test usersDB", usersDB);

const cookies = req.cookies;
console.log("test cookies", cookies);


        if (!cookies?.jwt) {
            return res.sendStatus(401);
        }

        const refreshToken = cookies.jwt;

        const foundUser = usersDB.find((per) => per.refreshToken === refreshToken);

        if (!foundUser) {
            console.log(refreshToken);
            return res.sendStatus(403); // Unauthorized
        }

        const roles = Object.values(foundUser.roles).filter(Boolean);
        const tokenPayload = {
            userInfo: {
                username: foundUser.username,
                roles: roles,
                id: foundUser._id,
            },
        };

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);
            if (tokenPayload.userInfo.username !== decoded.userInfo.username) {
                return res.sendStatus(403); // Forbidden
            }

            const newAccessToken = jwt.sign(
                tokenPayload,
                process.env.ACCESS_SECRET_TOKEN,
                { expiresIn: '30s' }
            );

            res.json({ accessToken: newAccessToken });
        } catch (error) {
            console.log(error);
            res.sendStatus(403); // Forbidden
        }
    } catch (err) {
        console.error('Error finding users:', err);
        res.sendStatus(500); // Internal Server Error
    }
};

module.exports = { refreshAccessToken };
