const { Schema, model } = require('mongoose');

const productCollection = 'products'

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: {type: String, required: true},
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: {type: Number, required: true},
    category: { type: String, required: true }
});

const productModel = model(productCollection, productSchema);

module.exports = { productModel };