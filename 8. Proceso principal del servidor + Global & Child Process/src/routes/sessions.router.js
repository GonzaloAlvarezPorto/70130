const { Router } = require('express');
const { authentication } = require('../middleware/auth.middleware');
const { UserManagerMongo } = require('../daos/mongo/userManager.mongo.js');
const { createHash, isValidPassword } = require('../utils/bcrypt.js');
const passport = require('passport');
const { generateToken, authTokenMiddleware } = require('../utils/jsonwebtoken.js');
const { passportCall } = require('../middleware/passport/passportCall.js');
const { authorization } = require('../middleware/passport/authorization.middleware.js');

const router = Router()
const userService = new UserManagerMongo()

//Configuracion de nuestras rutas

// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {

// });

// router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
//     req.session.user = req.user;
//     res.redirect('/')
// });


// router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
//     res.send({ status: 'success', message: 'usuario registrado' });
// })
// router.get('/failregister', async (req, res) => {
//     console.log('falló la estrategia');
//     res.send({ status: 'error', error: 'fallo estrategia' })
// })

// router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
//     if (!req.user) {
//         return res.status(401).send({ status: 'error', error: 'credenciales inválidas' })
//     }
//     req.session.user = {
//         email: req.user.email,
//     }
//     res.send({ status: 'success', message: 'usuario logueado' });
// })
// router.get('/faillogin', async (req, res) => {
//     console.log('falló el login');
//     res.send({ status: 'error', error: 'fallo el login' })
// })

//NO VA ACÁ PERO ES MOMENTÁNEO
// router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.send({ dataUser: req.user, message: 'datos sensibles' })
// })

router.get('/current', passportCall('jwt'), authorization('admin'), (req, res) => {
    res.send({ dataUser: req.user, message: 'datos sensibles' })
})

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'email y password son obligatorios' });
    }

    const userFound = await userService.getUser({ email })
    if (userFound) {
        return res.status(401).send({ status: 'error', error: 'el usuario ya existe' })
    }

    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password)
    }

    const result = await userService.createUser(newUser);

    res.send('usuario registrado correctamente');

    res.send('register');
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const userFound = await userService.getUser({ email });

    if (!userFound) {
        return res.send({ status: 'error', error: 'no existe el usuario' })
    }

    // if(userFound.email !== email || userFound.password !== password){
    //     return res.send({status:'error', error:'el email o la contraseña no coinciden'})
    // }

    if (userFound.email !== email || isValidPassword(password, userFound.password)) {
        return res.send({ status: 'error', error: 'el email o la contraseña no coinciden' })
    }

    // req.session.user = {
    //     email,
    //     isAdmin: userFound.role === 'admin'
    // };

    const token = generateToken({ id: userFound._id, role: userFound.role })

    res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    })

    res.send({
        status: 'success',
        data: userFound,
        token
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