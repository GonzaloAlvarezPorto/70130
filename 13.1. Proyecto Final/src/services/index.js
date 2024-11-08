const { CartsDaoMongo } = require("../daos/mongo/cartsDao.mongo.js");
const { CartsRepository } = require("../repositories/carts.repository.js");
const { ProductsDaoMongo } = require("../daos/mongo/productsDao.mongo.js");
const { ProductsRepository } = require("../repositories/products.repository.js");
const { UsersDaoMongo } = require("../daos/mongo/usersDao.mongo.js");
const { UsersRepository } = require("../repositories/users.repository.js");
const { TicketDaoMongo } = require("../daos/mongo/ticketDao.mongo.js");
const { TicketRepository } = require("../repositories/ticket.repository.js");

const userService = new UsersRepository(new UsersDaoMongo);
const productService = new ProductsRepository(new ProductsDaoMongo);
const cartsService = new CartsRepository(new CartsDaoMongo);
const ticketService = new TicketRepository(new TicketDaoMongo);

module.exports = {
    userService,
    productService,
    cartsService,
    ticketService
}