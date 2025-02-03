const { faker } = require("@faker-js/faker");

function generateMockProducts(count) {
    const products = [];

    for (let i = 0; i < count; i++) {
        const title = faker.commerce.productName(); // Genera un nombre de producto
        const description = faker.commerce.productDescription(); // Genera una descripción del producto
        const code = faker.number.int({ min: 18, max: 99 }); // Usa alphaNumeric de faker.random
        const price = parseFloat(faker.commerce.price()); // Genera un precio aleatorio
        const status = faker.datatype.boolean() // Genera un valor booleano aleatorio para el estado
        const stock = faker.number.int({ min: 18, max: 99 }); // Genera una cantidad de stock aleatoria
        const category = faker.commerce.department(); // Genera una categoría aleatoria

        // Crear un objeto de producto con los valores generados
        products.push({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
        });
    }

    return products;
}

module.exports = generateMockProducts;
