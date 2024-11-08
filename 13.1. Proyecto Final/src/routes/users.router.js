const { Router } = require("express");
const { UsersController } = require("../controllers/users.controller");

const router = Router();

const {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = new UsersController();

router.get('/', getUsers); 

router.get('/:uid', getUser);

router.post('/', createUser);

router.put('/:uid', updateUser);

router.delete('/:uid', deleteUser);

module.exports = router;