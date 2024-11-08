const { Router } = require("express");
const { CartsController } = require("../controllers/carts.controller");
const { authorization } = require("../middleware/passport/authorization.middleware");
const { passportCall } = require("../middleware/passport/passportCall");

const router = Router();

const {
    getCart,
    getCarts,
    createCart,
    updateCart,
    deleteCart,
    addProductToCart,
    purchaseCart
} = new CartsController();

router.get('/', getCarts);

router.get('/:cid', getCart);

router.post('/', passportCall('jwt'), authorization('user'), createCart);

router.put('/:cid', updateCart);

router.delete('/:cid', deleteCart);

router.post('/:cid/products', passportCall('jwt'), authorization('user'), addProductToCart)

router.post('/:cid/purchase', passportCall('jwt'), authorization('user'), purchaseCart)

module.exports = router;
