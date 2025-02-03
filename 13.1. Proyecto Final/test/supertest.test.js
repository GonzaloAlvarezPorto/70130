const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing de ecommerce', () => {
    let authToken;
    let productId;  // Para almacenar el ID del producto creado

    before(async () => {
        const loginResponse = await requester
            .post('/api/sessions/login')
            .send({ email: 'mauroviale@gmail.com', password: 'ppackk' });

        // Extraer el token de la cookie
        const cookies = loginResponse.headers['set-cookie'];
        if (!cookies) throw new Error('No se recibieron cookies de autenticación');

        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
        if (!tokenCookie) throw new Error('No se encontró el token en las cookies');

        authToken = tokenCookie.split(';')[0].split('=')[1];
    });

    describe('Test de productos', () => {
        it('El endpoint POST /api/products debe crear un producto correctamente', async () => {
            const mockProduct = {
                title: 'Lata de Coca Cola',
                description: 'Gaseosa Cola',
                code: 'LDCC001',
                price: 1300,
                status: true,
                stock: 2530,
                category: 'Bebidas'
            };

            const response = await requester
                .post('/api/products')
                .set('Cookie', `token=${authToken}`)
                .send(mockProduct);

            // console.log('Respuesta del servidor:', response.body);

            expect(response.status).to.equal(201);
            expect(response.body.data).to.have.property('id');
            productId = response.body.data.id;
        });

        it('El endpoint POST /api/products debe devolver error si el producto ya existe', async () => {
            const mockProduct = {
                title: 'Lata de Coca Cola',
                description: 'Gaseosa Cola',
                code: 'LDCC001',
                price: 1300,
                status: true,
                stock: 2530,
                category: 'Bebidas'
            };

            const response = await requester
                .post('/api/products')
                .set('Cookie', `token=${authToken}`)
                .send(mockProduct);

            // console.log('Respuesta del servidor:', response.body);

            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('El producto ya existe');
        });

        it('El endpoint GET /api/products debe obtener todos los productos', async () => {
            const response = await requester
                .get('/api/products')
                .set('Cookie', `token=${authToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.products).to.be.an('array');
        });

        it('El endpoint GET /api/products/:pid debe obtener un producto por ID', async () => {
            const response = await requester
                .get(`/api/products/${productId}`)
                .set('Cookie', `token=${authToken}`);

                // console.log('Respuesta GET /api/products/:pid:', response.body);

            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(productId);
        });

        it('El endpoint PUT /api/products/:pid debe actualizar un producto correctamente', async () => {
            const updatedProduct = {
                title: 'Lata de Pepsi',
                description: 'Gaseosa Cola',
                code: 'LDCC001',
                price: 6300,
                status: true,
                stock: 2530,
                category: 'Bebidas'
            };

            const response = await requester
                .put(`/api/products/${productId}`)
                .set('Cookie', `token=${authToken}`)
                .send(updatedProduct);

                // console.log('Respuesta GET /api/products/:pid:', response.body);


            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Producto actualizado con éxito');
            expect(response.body.product).to.have.property('title');
            expect(response.body.product).to.have.property('price');
        });

        it('El endpoint DELETE /api/products/:pid debe eliminar un producto correctamente', async () => {
            const response = await requester
                .delete(`/api/products/${productId}`)
                .set('Cookie', `token=${authToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Producto eliminado correctamente');
        });

        it('El endpoint DELETE /api/products/:pid debe devolver error si el producto no existe', async () => {
            const response = await requester
                .delete(`/api/products/${productId}`)
                .set('Cookie', `token=${authToken}`);

            expect(response.status).to.equal(404);
            expect(response.body.message).to.equal('Producto no encontrado');
        });
    });
});
