const { Router } = require('express');
const { authentication } = require('../middleware/auth.middleware');
const { UserManagerMongo } = require('../daos/mongo/userManager.mongo.js');
const { createHash, isValidPassword } = require('../utils/bcrypt.js');
const passport = require('passport');
const { generateToken, authTokenMiddleware } = require('../utils/jsonwebtoken.js');

const router = Router()
const userService = new UserManagerMongo()

//NO VA ACÁ PERO ES MOMENTÁNEO
router.get('/current', authTokenMiddleware, (req, res) => {
    res.send('datos sensibles')
})

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!email || !password || !first_name) {
        return res.status(400).send({ status: 'error', message: 'deben venir todos los campos requeridos' });
    }

    const userFound = await userService.getUser({ email })
    if (userFound) {
        return res.status(401).send({ status: 'error', error: 'el usuario con ese mail ya existe' })
    }

    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password)
    }

    const result = await userService.createUser(newUser);

    res.send({status:'success', data: result});
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ status: 'error', message: 'deben venir todos los campos requeridos' });
    }

    const userFound = await userService.getUser({email});

    if(!userFound){
        return res.send({status:'error', error:'no existe el usuario'})
    }

    if(!isValidPassword(password, userFound.password)){
        return res.send({status:'error', error:'las credenciales no coinciden'});
        }
        
        //Esta línea se agregó para hacer el ejemplo con webToken
        const token = generateToken({
            id: userFound._id,
            email : userFound.email,
            role: userFound.role === 'admin'
        });
        
        res.send({
            status:'success',
            message: 'logged',
            token //Esta línea se agregó para hacer el ejemplo con webToken
        });
})

router.post('/sessions/changepass', async (req, res) => {
    const { email, password } = req.body;

    const userFound = await userService.getUser({ email });

    if (!userFound) {
        return res.send({ status: 'error', error: 'no existe el usuario' })
    }

    // const result = await userService.updateuser(user)

    res.send('constraseña actualizada correctamente');
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send({ status: 'error', error })
    })
    res.send('logout')
})

module.exports = router;