//Hecho con el profe en clase
const { Schema, model } = require('mongoose');

// colección en la que guardaremos nuestros documentos
const userCollection = 'users';

// definir el esquema de nuestros documentos
const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    }
})


const userModel = model(userCollection, userSchema)

module.exports = {
    userModel
}