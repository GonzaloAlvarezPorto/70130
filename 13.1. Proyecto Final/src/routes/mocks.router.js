const { Router } = require("express");
const generateMockUsers = require("../utils/mockUserGenerator");
const { userModel } = require("../daos/mongo/models/users.model");
const generateMockProducts = require("../utils/mockProductsGerator");
const { productModel } = require("../daos/mongo/models/products.model"); // Asegúrate de tener el modelo de productos

const router = Router();

// Genera usuarios de prueba
router.get('/mockingusers', (req, res) => {
    const mockUsers = generateMockUsers(50);
    res.status(200).json(mockUsers);
});

// Genera y guarda datos (usuarios y productos) en la base de datos
router.post('/generateData', async (req, res) => {
    const { users, products } = req.body;

    // Validación para los usuarios
    if (typeof users !== 'number' || users <= 0) {
        return res.status(400).json({ error: 'Debe proporcionar un número válido de usuarios.' });
    }

    // Validación para los productos
    if (typeof products !== 'number' || products <= 0) {
        return res.status(400).json({ error: 'Debe proporcionar un número válido de productos.' });
    }

    try {
        // Generación de usuarios
        const mockUsers = generateMockUsers(users);
        const usersToInsert = mockUsers.map(user => ({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            age: user.age,
            password: user.password,
            role: user.role
        }));

        await userModel.insertMany(usersToInsert);

        // Generación de productos
        const mockProducts = generateMockProducts(products);
        const productsToInsert = mockProducts.map(product => ({
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category
        }));

        await productModel.insertMany(productsToInsert);

        return res.status(200).json({
            message: `${users} usuarios y ${products} productos generados e insertados correctamente en la base de datos.`,
            users: usersToInsert,
            products: productsToInsert
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocurrió un error al insertar los usuarios y productos en la base de datos.' });
    }
});

// Obtiene productos generados
router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockProducts(50);
    res.status(200).json(mockProducts);
});

module.exports = router;
