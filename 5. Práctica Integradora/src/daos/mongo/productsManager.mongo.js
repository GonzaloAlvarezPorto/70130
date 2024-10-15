const { productModel } = require("../../models/products.model");

class ProductsManagerMongo {
    constructor() {
        this.model = productModel;
    }

    getProducts = async (filter, sort, limit, skip) => {
        try {
            const products = await this.model.find(filter)
                .sort(sort)
                .limit(limit)
                .skip(skip);
            return products;
        } catch (error) {
            console.error('Error en getProducts:', error);
        }
    }
    

    getProductById = async (opts) => await this.model.findOne(opts)
    createProduct = async (newProduct) => await this.model.create(newProduct);

    deleteProduct = async (productId) => await this.model.findByIdAndDelete(productId);
}

module.exports = ProductsManagerMongo;