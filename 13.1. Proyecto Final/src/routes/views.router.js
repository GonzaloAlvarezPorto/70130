const { Router } = require("express");
const ViewsController = require("../controllers/views.controller");

const router = Router();

const {
    index,
    login,
    register,
    createProduct,
    updateProduct,
    getProductsRealTime
} = new ViewsController()

router.get('/', index);

router.get('/login', login);

router.get('/register', register);

router.get('/createProducts', createProduct);

router.get('/updateProduct', updateProduct);

router.get('/realtimeproducts', getProductsRealTime);

module.exports = router;