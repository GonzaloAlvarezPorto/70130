const CartsDTO = require("../dto/carts.dto");
const { cartsService, productService, ticketService, userService } = require("../services");

const generateUniqueCode = () => {
    return 'CART-' + Math.random().toString(36).substr(2, 9);
};

class CartsController {
    constructor() {
        this.service = cartsService;
        this.productService = productService;
        this.ticketService = ticketService;
        this.userService = userService
    }

    createCart = async (req, res) => {
        const userId = req.user.id;
        const fullName = req.user.full_name;
        const code = generateUniqueCode();

        if (!userId) {
            return res.status(400).json({ error: 'Usuario no autenticado o sin id' });
        }

        const cartData = {
            ...req.body,
            code,
            clientId: userId,
            clientName: fullName
        };

        try {
            const newCart = await this.service.createCart(cartData);

            res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    };

    getCart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cart = await this.service.getCart({ _id: cid })
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" })
            }

            res.json(cart);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener el carrito' });
        }
    }

    getCarts = async (req, res) => {
        try {
            const carts = await this.service.getCarts({});

            if (carts.length === 0) {
                return res.status(404).json({ message: 'No se encontraron carritos' });
            }

            const cartDTO = carts.map(cart => new CartsDTO(cart));

            res.json(cartDTO);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener los carritos' });
        }
    };

    updateCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const updatedProducts = req.body.products;

            const cart = await this.service.getCart({ _id: cartId });

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            updatedProducts.forEach(product => {

                const existingProduct = cart.products.find(p => p.product === product.product);
                if (existingProduct) {

                    existingProduct.quantity = product.quantity;
                    existingProduct.price = product.price
                } else {

                    cart.products.push(product);
                }
            });

            await cart.save();

            res.status(200).json({
                message: 'Carrito actualizado con éxito',
                cart: cart
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al actualizar el carrito' });
        }
    };



    deleteCart = async (req, res) => {
        const { cid } = req.params;

        try {
            const deletedCart = await this.service.deleteCart(cid);
            if (!deletedCart) {
                return res.status(404).json({ error: 'Carrito no encontrado' })
            }

            res.json({ message: 'Carrito eliminado correctamente' })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al eliminar el carrito' });
        }
    }

    addProductToCart = async (req, res) => {
        const { cid } = req.params;
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Debe proporcionar al menos un producto en el body" });
        }

        try {
            const cart = await this.service.getCart({ _id: cid });
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            products.forEach(({ product, quantity, price }) => {

                if (!product || quantity == null || price == null) {
                    throw new Error("Cada producto debe tener `product`, `quantity` y `price`");
                }

                const existingProduct = cart.products.find(p => p.product === product);
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    cart.products.push({ product, quantity, price });
                }
            });

            await cart.save();

            res.status(200).json({ message: "Productos agregados al carrito", cart });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al agregar productos al carrito' });
        }
    };

    purchaseCart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cart = await this.service.getCart({ _id: cid });
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            const unavailableProducts = [];
            const purchasedProducts = [];
            
            for (let product of cart.products) {
                const { product: productName, quantity, price } = product;

                const productInStock = await this.productService.getProduct({ title: productName });

                if (!productInStock) {
                    unavailableProducts.push({ title: productName, reason: "Producto no encontrado" });
                    continue;
                }

                if (productInStock.stock < quantity) {
                    unavailableProducts.push({ title: productName, reason: `No hay suficiente stock. Stock disponible: ${productInStock.stock}` });
                    continue;
                }

                purchasedProducts.push({ title: productName, quantity, price });

                productInStock.stock -= quantity;
                await productInStock.save();
            }

            if (purchasedProducts.length > 0) {
                const purchaser = cart.clientName;
                
                const totalAmount = purchasedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);

                const ticket = await this.ticketService.createTicket({
                    purchaser: purchaser,
                    amount: totalAmount,
                    products: purchasedProducts
                });

                console.log("Ticket generado:", ticket);
            }

            cart.products = cart.products.filter(p => unavailableProducts.some(u => u.title === p.product));

            await cart.save();

            if (unavailableProducts.length > 0) {
                return res.status(400).json({
                    message: "Algunos productos no se pudieron procesar debido a falta de stock",
                    unavailableProducts,
                });
            }

            res.status(200).json({ message: "Compra procesada correctamente", cart });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al procesar la compra' });
        }
    };





}

module.exports = {
    CartsController
};
