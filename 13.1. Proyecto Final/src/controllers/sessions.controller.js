const { userService } = require("../services");
const { isValidPassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jsonwebtoken");
const UserDTO = require("../dto/users.dto")

class SessionsController {
    constructor() {
        this.userService = userService;
    }

    loginSession = async (req, res) => {
        const { email, password } = req.body;

        try {
            const userFound = await this.userService.getUser({ email });

            if (!userFound) {
                return res.status(404).render('error', { message: 'No existe el usuario' });
            }

            if (!isValidPassword(password, userFound.password)) {
                return res.status(401).render('error', { message: 'El email o la contraseña no coinciden' });
            }

            const token = generateToken({
                id: userFound._id,
                role: userFound.role,
                full_name: `${userFound.first_name} ${userFound.last_name}`,
                email: `${userFound.email}`
            });

            res.cookie('token', token, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            });

            if (userFound.role === 'admin') {
                return res.render('users/admin', {
                    message: `Bienvenido, ${userFound.first_name}`,
                    user: userFound
                });
            } else if (userFound.role === 'user') {
                return res.render('users/user', {
                    message: `Bienvenido, ${userFound.first_name}`,
                    user: userFound
                });
            } else {
                return res.status(403).render('error', { message: 'Rol no autorizado' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).render('error', { message: 'Error interno del servidor' });
        }
    }

    currentSession = (req, res) => {
        const userDTO = new UserDTO(req.user);

        res.send({
            dataUser: userDTO,
            message: `Datos sensibles`
        });
    };
}

module.exports = {
    SessionsController
}
