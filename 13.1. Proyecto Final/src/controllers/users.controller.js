const UserDTO = require("../dto/users.dto");
const { userService } = require("../services");
const { createHash } = require("../utils/bcrypt");

class UsersController {
    constructor() {
        this.service = userService;
    }

    createUser = async (req, res) => {

        let userData = req.body;

        try {
            // Hashear la contraseña antes de crear el usuario
            userData.password = createHash(userData.password);

            const newUser = await this.service.createUser(userData);

            const userDTO = new UserDTO(newUser);

            res.status(201).json({userDTO, message:'Usuario registrado con éxito'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }

    getUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const user = await this.service.getUser({_id: uid});
            if(!user){
                return res.status(404).json({error: "Usuario no encontrado" });
            }
            const userDTO = new UserDTO(user);

            res.json(userDTO);
        }
        catch(error){
            console.log(error);
            res.status(500).json({ error: 'Error al obtener el usuario' });
        }
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.service.getUsers({});

            const usersDTO = users.map(user => new UserDTO(user));

            res.send({ status: 'success', data: usersDTO });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    }

    updateUser = async (req, res) => {
        const { uid } = req.params;
        let updatedData = req.body;

        try {
            if (updatedData.password) {
                updatedData.password = createHash(updatedData.password);
            }

            const updatedUser = await this.service.updateUser(uid, updatedData);
            if (!updatedUser) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Usar DTO para estructurar la respuesta
            const userDTO = new UserDTO(updatedUser);

            res.json(userDTO);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
    }

    deleteUser = async (req, res) => {
        const { uid } = req.params;
    
        try {
            const deletedUser = await this.service.deleteUser(uid);
            if (!deletedUser) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            // Usar DTO para estructurar la respuesta del usuario eliminado
            const userDTO = new UserDTO(deletedUser);
    
            res.json({
                message: 'Usuario eliminado correctamente',
                user: userDTO // Incluir el DTO del usuario eliminado
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
    }
}

module.exports = {
    UsersController
}
