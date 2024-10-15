const { Router } = require('express');
const { authentication } = require('../middleware/auth.middleware');
const { UserManagerMongo } = require('../daos/mongo/userManager.mongo.js');

const router = Router()
const userService = new UserManagerMongo()
//Configuracion de nuestras rutas

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'email y password son obligatorios' });
    }

    const userFound = await userService.getUser({ email })
    if(userFound){
        return res.status(401).send({status: 'error', error: 'el usuario ya existe'})
    }

    const newUser = {
        first_name,
        last_name,
        email,
        password
    }

    const result = await userService.createUser(newUser);

    res.send('usuario registrado correctamente');

    res.send('register');
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const userFound = await userService.getUser({email});

    if(!userFound){
        return res.send({status:'error', error:'no existe el usuario'})
    }

    if(userFound.email !== email || userFound.password !== password){
        return res.send({status:'error', error:'el email o la contraseña no coinciden'})
    }

    req.session.user = {
        email,
        isAdmin: userFound.role === 'admin'
    };

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