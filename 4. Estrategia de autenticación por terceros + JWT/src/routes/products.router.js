const express = require('express');
const router = express.Router();
const ProductsManagerMongo = require('../daos/mongo/productsManager.mongo.js');

const productsManager = new ProductsManagerMongo();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;

        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);
        const sortOption = sort === 'desc' ? { precio: -1 } : (sort === 'asc' ? { precio: 1 } : {});
        const filter = query ? { category: new RegExp(query, 'i') } : {};

        const products = await productsManager.getProducts(filter, sortOption, limitInt, (pageInt - 1) * limitInt);
        const allProducts = await productsManager.getProducts(filter);
        const totalProducts = allProducts.length;
        const totalPages = Math.ceil(totalProducts / limitInt);
        const hasPrevPage = pageInt > 1;
        const hasNextPage = pageInt < totalPages;
        const prevPage = hasPrevPage ? pageInt - 1 : null;
        const nextPage = hasNextPage ? pageInt + 1 : null;
        const prevLink = `limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`;
        const nextLink = `limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`;

        res.render('home', {
            Productos: products,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            currentPage: pageInt,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            limit: limitInt,
            sort: sort,
            query: query
        });

        console.log({
            status: 'success',
            payload: products,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: pageInt,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.post('/', async (req, res) => {
    try {
        const { body } = req;

        const productoCreado = await productsManager.createProduct(body);
        res.send({ status: 'success', data: productoCreado });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).send('Error al crear el producto');
    }
});

router.get('/realtimeproducts', (req,res) => {
    res.render('realTimeProducts')
})

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productsManager.getProductById({ _id: productId });
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al obtener el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const result = await productsManager.deleteProduct(productId);
        if (result) {
            res.send({ status: 'success', message: 'Producto eliminado' });
        } else {
            res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
    }
});

module.exports = router;
