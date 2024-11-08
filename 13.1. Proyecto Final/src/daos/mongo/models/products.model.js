const { Schema, model } = require('mongoose');

const productCollection = 'products'

const productSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: {type: Number, required: true}
});

const productModel = model(productCollection, productSchema);

module.exports = { productModel };