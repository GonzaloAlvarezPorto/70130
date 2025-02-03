const jwt = require('jsonwebtoken');
const { configObject } = require('../config');

const generateToken = user => {
    return jwt.sign(user, configObject.private_key, { expiresIn: '1d' });
};

const authTokenMiddleware = (req, res, next) => {
    console.log('Headers recibidos:', req.headers); // 🔥 Verifica todos los headers

    const authHeader = req.headers['authorization'];
    console.log('Auth Header recibido:', authHeader); // 🔥 Debe mostrar "Bearer ey..."

    if (!authHeader) return res.status(401).send({ status: 'error', error: 'not authenticated' });

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token); // 🔥 Debe mostrar solo el token

    if (!token) return res.status(401).send({ status: 'error', error: 'No auth token' });

    jwt.verify(token, configObject.private_key, (error, userDecoded) => {
        if (error) {
            console.log('Error al verificar el token:', error);
            return res.status(403).send({ status: 'error', error: 'token no válido' });
        }
        console.log('Token decodificado:', userDecoded); // 🔥 Debe mostrar el usuario

        req.user = userDecoded;
        next();
    });
};


module.exports = {
    generateToken,
    authTokenMiddleware
}
