const { UserManagerMongo } = require("../daos/mongo/userManager.mongo");

const userService = new UserManagerMongo(); //UserDaoMongo se debe llamar
// const productService = new ProductsManagerMongo();

module.exports = {
    userService
}