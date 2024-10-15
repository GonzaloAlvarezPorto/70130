const jwt = require('jsonwebtoken');

const PRIVATE_KEY = 'CoderKeySEcret@para-la-firma';

const generateToken = user => jwt.sign(user, PRIVATE_KEY, { expiresIn: '1d' })

const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);

    if (!authHeader) return res.status(401).send({ status: 'error', error: 'not authenticated' })

    const token = authHeader.split('')[1];

    jwt.verify(token, PRIVATE_KEY, (error, usuarioExtraidoDelToken) => {
        req.user = usuarioExtraidoDelToken;
        next();
    })
}

module.exports = {
    generateToken,
    authTokenMiddleware,
    PRIVATE_KEY
}