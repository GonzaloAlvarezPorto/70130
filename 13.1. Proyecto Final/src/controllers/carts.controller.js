const Ticket = require("../daos/mongo/models/ticket.model");
const CartsDTO = require("../dto/carts.dto");
const { cartsService, productService, ticketService, userService } = require("../services");

const generateUniqueCode = () => {
    return 'CART-' + Math.random().toString(36).substr(2, 9); // Genera un código alfanumérico aleatorio
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
        const fullName = req.user.full_name;  // Construye el nombre completo a partir de firstName y lastName
        const code = generateUniqueCode();  // Genera el código único automáticamente

        // Asegúrate de que userId exista
        if (!userId) {
            return res.status(400).json({ error: 'Usuario no autenticado o sin id' });
        }

        // Incluye clientName como fullName en los datos del carrito
        const cartData = {
            ...req.body,
            code,
            clientId: userId,
            clientName: fullName  // Establece clientName como el nombre completo del usuario autenticado
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
            const carts = await this.service.getCarts({});  // Obtener todos los carritos

            // Verificar si no se encontraron carritos
            if (carts.length === 0) {
                return res.status(404).json({ message: 'No se encontraron carritos' });
            }

            const cartDTO = carts.map(cart => new CartsDTO(cart));

            // Si hay carritos, enviarlos como respuesta
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

            // Obtener el carrito de la base de datos
            const cart = await this.service.getCart({ _id: cartId });

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            // Actualizar los productos
            updatedProducts.forEach(product => {
                // Encontrar el producto en el carrito usando el nombre del producto
                const existingProduct = cart.products.find(p => p.product === product.product);
                if (existingProduct) {
                    // Si el producto ya existe, actualizar la cantidad
                    existingProduct.quantity = product.quantity;
                    existingProduct.price = product.price
                } else {
                    // Si el producto no existe, agregarlo al carrito
                    cart.products.push(product);
                }
            });

            // Guardar el carrito actualizado
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
            if(!deletedCart){
                return res.status(404).json({error: 'Carrito no encontrado'})
            }

            res.json({message: 'Carrito eliminado correctamente'})
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al eliminar el carrito' });
        }
    }

    addProductToCart = async (req, res) => {
        const { cid } = req.params;
        const { products } = req.body;
    
        // Validar que `products` sea un array y contenga al menos un producto
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Debe proporcionar al menos un producto en el body" });
        }
    
        try {
            const cart = await this.service.getCart({ _id: cid });
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
    
            // Iterar sobre cada producto en el array y agregarlo al carrito
            products.forEach(({ product, quantity, price }) => {
                // Validar que el producto tenga `product`, `quantity` y `price`
                if (!product || quantity == null || price == null) {
                    throw new Error("Cada producto debe tener `product`, `quantity` y `price`");
                }
    
                // Verificar si el producto ya existe en el carrito
                const existingProduct = cart.products.find(p => p.product === product);
                if (existingProduct) {
                    // Si existe, sumar la cantidad
                    existingProduct.quantity += quantity;
                } else {
                    // Si no existe, agregar el producto nuevo
                    cart.products.push({ product, quantity, price });
                }
            });
    
            // Guardar los cambios en el carrito
            await cart.save();
    
            res.status(200).json({ message: "Productos agregados al carrito", cart });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al agregar productos al carrito' });
        }
    };
    
    purchaseCart = async (req, res) => {
        const { cid } = req.params;  // Carrito ID
        try {
            // Obtener el carrito desde la base de datos
            const cart = await this.service.getCart({ _id: cid });
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
    
            const unavailableProducts = [];  // Productos que no se pudieron comprar
            const purchasedProducts = [];    // Productos comprados exitosamente
    
            // Iterar sobre los productos en el carrito
            for (let product of cart.products) {
                const { product: productName, quantity, price } = product;
    
                // Verificar si el producto existe en el inventario
                const productInStock = await this.productService.getProduct({ title: productName });
    
                if (!productInStock) {
                    unavailableProducts.push({ title: productName, reason: "Producto no encontrado" });
                    continue;  // Si el producto no se encuentra, saltamos a la siguiente iteración
                }
    
                // Verificar si hay suficiente stock para la cantidad solicitada
                if (productInStock.stock < quantity) {
                    unavailableProducts.push({ title: productName, reason: `No hay suficiente stock. Stock disponible: ${productInStock.stock}` });
                    continue;  // Si no hay stock suficiente, saltamos a la siguiente iteración
                }
    
                // Si hay suficiente stock, realizar la compra
                purchasedProducts.push({ title: productName, quantity, price });
    
                // Restar la cantidad del producto del inventario
                productInStock.stock -= quantity;
                await productInStock.save();  // Guardar la actualización del stock
            }
    
            // Si hay productos comprados, generar un ticket
            if (purchasedProducts.length > 0) {
                const purchaser = cart.clientName;  // Usar el clientName del carrito como purchaser
    
                // Calcular el monto total de la compra
                const totalAmount = purchasedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
    
                // Crear un ticket usando ticketService
                const ticket = await this.ticketService.createTicket({
                    purchaser: purchaser,  // clientName como purchaser
                    amount: totalAmount,
                    products: purchasedProducts
                });
    
                console.log("Ticket generado:", ticket);
            }
    
            // Filtrar el carrito para que contenga solo los productos no comprados
            cart.products = cart.products.filter(p => unavailableProducts.some(u => u.title === p.product));
    
            // Guardar el carrito actualizado
            await cart.save();
    
            // Responder con los resultados de la compra
            if (unavailableProducts.length > 0) {
                return res.status(400).json({
                    message: "Algunos productos no se pudieron procesar debido a falta de stock",
                    unavailableProducts,
                });
            }
    
            res.status(200).json({ message: "Compra procesada correctamente", cart });
    
        } catch (error) {
            console.error(error);  // Log del error para debugging
            res.status(500).json({ error: 'Error al procesar la compra' });
        }
    };
    
    
    
    
    
}

module.exports = {
    CartsController
};
