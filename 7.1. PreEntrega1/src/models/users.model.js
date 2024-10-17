const { Schema, model, Types } = require("mongoose");

const userCollection = 'users';

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String, 
        unique: true,
        required:true
    },
    age: Number,
    password: String,
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        default: () => new Types.ObjectId()
    },
    role: {
        type: String,
        default:'user'
    }
})

const userModel = model(userCollection, userSchema);

module.exports = {
    userModel
}