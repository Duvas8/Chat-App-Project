const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, tokenPayload) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = tokenPayload.userInfo.username;
        console.log(req.user);

        req.roles = tokenPayload.userInfo.roles;
        console.log(req.roles);

        next();
    });
};

module.exports = authenticateToken;
