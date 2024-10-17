const { Router } = require("express");
const { userModel } = require("../models/users.model");
const { UsersManagerMongo } = require("../daos/mongo/usersManager.mongo");

const router = Router();
const usersManager = new UsersManagerMongo();

router.get('/', async(req, res) => {
    try {
        const users = await userModel.find();
        res.send({status:'success', data: users});
    } catch (error) {
        console.log(error);
    }
})

router.post('/', async (req, res) => {

    const userData = req.body;

    try {
        const newUser = await usersManager.createUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;