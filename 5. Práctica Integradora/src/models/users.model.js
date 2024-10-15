//Hecho con el profe en clase
const { Schema, model } = require('mongoose');

// colección en la que guardaremos nuestros documentos
const userCollection = 'users';

// definir el esquema de nuestros documentos
const userSchema = new Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: String,
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

const userModel = model(userCollection, userSchema)

module.exports = {
    userModel
}