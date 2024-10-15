const { userModel } = require("../../models/users.model")

class UserManagerMongo {
    constructor(){
        this.model = userModel;
    }

    getUser = async filter => await this.model.findOne(filter);
    createUser = async newUser => await this.model.create(newUser);
    getUsers = () => {}
    updateUser = () => {}
    deleteUser = () => {}
}

module.exports = {
    UserManagerMongo
}