const { Router } = require("express");
const ViewsController = require("../controllers/views.controller");

const router = Router();

router.get('/', ViewsController.index);

router.get('/login', ViewsController.login);

router.get('/register', ViewsController.register);

module.exports = router;