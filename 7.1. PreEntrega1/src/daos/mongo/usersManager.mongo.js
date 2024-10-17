const { userModel } = require("../../models/users.model");
const { createHash } = require("../../utils/bcrypt");

class UsersManagerMongo {
    constructor() {
        this.model = userModel;
    }

    getUser = async filter => {

        try {
            const user = await this.model.findOne(filter);
            return user;
            
        } catch (error) {
            console.log('Error al obtener usuario:', error);
        }
    };

    getUsers = async () => {
        try {
            const users = await this.model.find();
            return ('Usuarios recuperados', users);
        } catch (error) {
            console.log('Error al obtener usuarios:', error);
        }
    };

    createUser = async newUser => {
        try {

            newUser.password = createHash(newUser.password); // Hashea la contraseña

            const createdUser = await this.model.create(newUser);
            console.log('Usuario creado:', createdUser);
            return createdUser; // Devuelve el usuario creado
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    };
}

module.exports = {
    UsersManagerMongo
};
