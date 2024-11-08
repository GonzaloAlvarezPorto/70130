const jwt = require('jsonwebtoken');
const { configObject } = require('../config');

const generateToken = user => {
    return jwt.sign(user, configObject.private_key, { expiresIn: '1d' });
};

const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send({ status: 'error', error: 'not authenticated' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send({ status: 'error', error: 'No auth token' });

    jwt.verify(token, configObject.private_key, (error, userDecoded) => {
        if (error) return res.status(403).send({ status: 'error', error: 'token no válido' });
        req.user = userDecoded;
        next();
    });
};


module.exports = {
    generateToken,
    authTokenMiddleware
}
