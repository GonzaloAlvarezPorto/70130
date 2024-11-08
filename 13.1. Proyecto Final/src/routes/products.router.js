const { Router } = require("express");
const { ProductsController } = require("../controllers/products.controller");
const { authorization } = require("../middleware/passport/authorization.middleware");
const { passportCall } = require("../middleware/passport/passportCall");

const router = Router();

const {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductsController();

router.get('/', getProducts);

router.get('/:pid', getProduct);

router.post('/', passportCall('jwt'), authorization('admin'), createProduct);

router.put('/:pid', passportCall('jwt'), authorization('admin'), updateProduct);

router.delete('/:pid', passportCall('jwt'), authorization('admin'), deleteProduct);

module.exports = router;