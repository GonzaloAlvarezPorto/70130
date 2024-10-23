const Router = require('express');
const { UsersController } = require('../controllers/users.controller.js');
const { passportCall } = require('../middleware/passport/passportCall.js');

const router = Router();

const {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = new UsersController();

// router.get('/', passportCall('jwt'), getUsers)

router.get('/', getUsers)

router.post('/', createUser)

router.get('/:uid', getUser)

router.put('/:uid', updateUser)

router.delete('/:uid', deleteUser)

module.exports = router;