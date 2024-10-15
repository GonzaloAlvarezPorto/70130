const { Router } = require('express');
const CartsManagerMongo = require('../daos/mongo/cartsManager.mongo');
const { cartModel } = require('../models/carts.model');

const router = Router();
const cartsManager = new CartsManagerMongo();

router.get('/', async (req, res) => {
    try {
        const carts = await cartsManager.getCarts();
        if (carts.length === 0) {
            return res.status(404).json({ message: 'No hay carritos en la base de datos' });
        }
        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los carritos' });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: 'El carrito está vacío o mal formado' });
        }

        const newCart = new cartModel({ products });
        await newCart.save();

        res.status(201).json({ success: true, message: 'Carrito creado con éxito', cart: newCart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ success: false, message: 'Error al crear el carrito', error });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate('products.id'); 

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        const updatedCart = await cartsManager.addProductToCart(cartId, productId, quantity);
        if (!updatedCart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto al carrito' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(product => !product.id.equals(pid));

        await cart.save();
        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await cartModel.findByIdAndUpdate(
            cid,
            { products },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ message: 'Carrito actualizado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el carrito', error });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const product = cart.products.find(product => product.id.equals(pid));

        if (product) {
            product.quantity = quantity;
        } else {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        await cart.save();
        res.status(200).json({ message: 'Cantidad del producto actualizada', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cartModel.findByIdAndUpdate(
            cid,
            { products: [] },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ message: 'Todos los productos eliminados del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar los productos del carrito', error });
    }
});

module.exports = router;
