const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    precio: { type: Number, required: true }
});

const productModel = model('Product', productSchema);

module.exports = { productModel };