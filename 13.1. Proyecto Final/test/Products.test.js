const mongoose = require('mongoose')
const Assert = require('node:assert');
const { ProductsDaoMongo } = require('../src/daos/mongo/productsDao.mongo');

mongoose.connect('mongodb://127.0.0.1:27017/c70130test');

const assert = Assert.strict;

describe('Testing de Products Dao', function () {
    before(function () {
        this.productsDao = new ProductsDaoMongo()
    })

    beforeEach(function () {
        mongoose.connection.collections.products.drop()
        this.timeout(5000)
    })

    it('El dao debe poder obtener todos los productos', async function () {

        const result = await this.productsDao.get()
        assert.strictEqual(Array.isArray(result), true);
    })

    it('El dao debe agregar un producto a la BBDD', async function () {
        let mockProduct = {
            title: 'Lata de Coca Cola',
            description: 'Gaseosa Cola',
            code: 'LDCC001',
            price: 1300,
            status: true,
            stock: 2530,
            category: 'Bebidas'
        }

        const result = await this.productsDao.create(mockProduct);

        assert.ok(result._id)
    })

    it('El Dao puede obtener a un producto por id', async function () {
        let mockProduct = {
            title: 'Lata de Coca Cola',
            description: 'Gaseosa Cola',
            code: 'LDCC001',
            price: 1300,
            status: true,
            stock: 2530,
            category: 'Bebidas'
        }

        const result = await this.productsDao.create(mockProduct)

        const product = await this.productsDao.getBy({ id: result._id })
        assert.strictEqual(typeof product, 'object')
    })

    it('El Dao debe poder actualizar un producto por id', async function () {
        let mockProduct = {
            title: 'Lata de Coca Cola',
            description: 'Gaseosa Cola',
            code: 'LDCC001',
            price: 1300,
            status: true,
            stock: 2530,
            category: 'Bebidas'
        };

        const createdProduct = await this.productsDao.create(mockProduct);

        const updatedData = {
            title: 'Lata de Pepsi',
            price: 1500
        };

        const updatedProduct = await this.productsDao.update(createdProduct._id, updatedData);

        assert.strictEqual(updatedProduct.title, updatedData.title);
        assert.strictEqual(updatedProduct.price, updatedData.price);
    });

    it('El Dao debe poder eliminar un producto por id', async function () {

        let mockProduct = {
            title: 'Lata de Coca Cola',
            description: 'Gaseosa Cola',
            code: 'LDCC001',
            price: 1300,
            status: true,
            stock: 2530,
            category: 'Bebidas'
        };

        const createdProduct = await this.productsDao.create(mockProduct);

        const deletedProduct = await this.productsDao.delete(createdProduct._id);

        assert.strictEqual(deletedProduct._id.toString(), createdProduct._id.toString());

        const product = await this.productsDao.getBy({ id: createdProduct._id });
        assert.strictEqual(product, null);
    });

    it('El Dao debe poder obtener productos con filtros, ordenamiento, límite y salto', async function () {

        const mockProducts = [
            {
                title: 'Lata de Coca Cola',
                description: 'Gaseosa Cola',
                code: 'LDCC001',
                price: 1300,
                status: true,
                stock: 2530,
                category: 'Bebidas'
            },
            {
                title: 'Lata de Pepsi',
                description: 'Gaseosa Pepsi',
                code: 'LDCC002',
                price: 1200,
                status: true,
                stock: 2000,
                category: 'Bebidas'
            },
            {
                title: 'Agua Mineral',
                description: 'Agua sin gas',
                code: 'LDCC003',
                price: 800,
                status: true,
                stock: 1500,
                category: 'Bebidas'
            },
            {
                title: 'Jugo de Naranja',
                description: 'Jugo natural',
                code: 'LDCC004',
                price: 1000,
                status: true,
                stock: 1000,
                category: 'Jugos'
            }
        ];

        await this.productsDao.create(mockProducts[0]);
        await this.productsDao.create(mockProducts[1]);
        await this.productsDao.create(mockProducts[2]);
        await this.productsDao.create(mockProducts[3]);

        const filter = { category: 'Bebidas' };
        const sort = { price: 1 };
        const limit = 2;
        const skip = 1;

        const result = await this.productsDao.getProducts(filter, sort, limit, skip);

        assert.strictEqual(Array.isArray(result), true);

        assert.strictEqual(result.length, 2);

        assert.strictEqual(result[0].title, 'Lata de Pepsi');
        assert.strictEqual(result[1].title, 'Lata de Coca Cola');
    });
})