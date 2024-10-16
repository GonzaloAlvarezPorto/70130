const { Router } = require('express');
const { authentication } = require('../middleware/auth.middleware');

const router = Router()

//Configuracion de nuestras rutas

router.post('/register', (req, res) => {
    res.send('register');
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username !== 'Fede'  || password !== 'El mejor') {
        return res.send('Login falló')
    }

    req.session.username = username;
    req.session.admin = true;

    res.send('logueado correctamente');
})

//NO VA ACÁ PERO ES MOMENTÁNEO
router.get('/current', authentication, (req, res) => {
    res.send('datos sensibles')
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send({ status: 'error', error })
    })
    res.send('logout')
})

module.exports = router;