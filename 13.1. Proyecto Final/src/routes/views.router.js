const { Router } = require("express");
const ViewsController = require("../controllers/views.controller");

const router = Router();

router.get('/', ViewsController.index);

router.get('/login', ViewsController.login);

router.get('/register', ViewsController.register);

router.get('/createProducts', ViewsController.createProduct);

router.get('/updateProduct', ViewsController.updateProduct);

module.exports = router;