const { Router } = require("express");
const { generateToken } = require("../utils/jsonwebtoken");
const { isValidPassword } = require("../utils/bcrypt");
const { UsersManagerMongo } = require("../daos/mongo/usersManager.mongo");
const passport = require("passport");
const { passportCall } = require("../middleware/passport/passportCall");
const { authorization } = require("../middleware/passport/authorization.middleware");

const userService = new UsersManagerMongo();

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const userFound = await userService.getUser({ email });

    if (!userFound) {
        return res.send({ status: 'error', error: 'no existe el usuario' })
    }

    if (userFound.email !== email || isValidPassword(password, userFound.password)) {
        return res.send({ status: 'error', error: 'el email o la contraseña no coinciden' })
    }

    const token = generateToken({ id: userFound._id, role: userFound.role })

    res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }).send({
        status: 'success',
        data: userFound,
        token
    });
})

router.get('/current', passportCall('jwt'), authorization('admin'), (req, res) => {
    res.send({dataUser: req.user, message:'datos sensibles'})
})

module.exports = router;