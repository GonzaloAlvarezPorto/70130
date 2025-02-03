const mongoose = require('mongoose');
const chai = require('chai');
const { ProductsDaoMongo } = require('../src/daos/mongo/productsDao.mongo');


const expect = chai.expect;
mongoose.connect('mongodb://127.0.0.1:27017/c70130test');

describe('Testing de Products Dao', function () {
    before(function () {
        this.productsDao = new ProductsDaoMongo();
    });

    beforeEach(function () {
        mongoose.connection.collections.products.drop();
        this.timeout(5000);
    });

    it('El dao debe poder obtener todos los productos', async function () {
        const result = await this.productsDao.get();
        expect(result).to.be.an('array'); // Verifica que sea un array
    });

    it('El dao debe agregar un producto a la BBDD', async function () {
        let mockProduct = {
            title: 'Lata de Coca Cola',
            description: 'Gaseosa Cola',
            code: 'LDCC001',
            price: 1300,
            status: true,
            stock: 2530,
            category: 'Bebidas'
        };

        const result = await this.productsDao.create(mockProduct);
        expect(result).to.have.property('_id'); // Verifica que tenga la propiedad _id
    });

    it('El Dao puede obtener a un producto por id', async function () {
        let mockProduct = {
            title: 'Lata de Coca Cola',
            description: 'Gaseosa Cola',
            code: 'LDCC001',
            price: 1300,
            status: true,
            stock: 2530,
            category: 'Bebidas'
        };

        const result = await this.productsDao.create(mockProduct);
        const product = await this.productsDao.getBy({ _id: result._id })
        
        expect(product).to.be.an('object'); // Verifica que sea un objeto
    });

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
        expect(updatedProduct.title).to.equal(updatedData.title); // Verifica el título actualizado
        expect(updatedProduct.price).to.equal(updatedData.price); // Verifica el precio actualizado
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

        expect(deletedProduct._id.toString()).to.equal(createdProduct._id.toString()); // Verifica que el ID coincida

        const product = await this.productsDao.getBy({ id: createdProduct._id });
        expect(product).to.be.null; // Verifica que el producto sea null después de eliminarlo
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

        expect(result).to.be.an('array'); // Verifica que sea un array
        expect(result).to.have.lengthOf(2); // Verifica que tenga 2 elementos
        expect(result[0].title).to.equal('Lata de Pepsi'); // Verifica el primer producto
        expect(result[1].title).to.equal('Lata de Coca Cola'); // Verifica el segundo producto
    });
});