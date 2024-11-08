//CAPA DE PERSISTENCIA
const { userModel } = require("./models/users.model");

class UsersDaoMongo {
    constructor() {
        this.model = userModel;
    }
    
    create = async newUser => await this.model.create(newUser);

    getBy = async filter => await this.model.findOne(filter);

    get = async () => await this.model.find();

    update = async (uid, updateData) => await this.model.findByIdAndUpdate(uid, updateData);

    delete = async uid => await this.model.findByIdAndDelete(uid);

}

module.exports = {
    UsersDaoMongo
};
