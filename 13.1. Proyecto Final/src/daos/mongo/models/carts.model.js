const { Schema, model } = require('mongoose');

const cartCollection = 'carts';

const cartSchema = new Schema({
    code: { type: String, unique: true, required: true },
    clientName: { type: String, required: true },
    products: [
        {
            product: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: {type: Number, required: true},
            
        }
    ]
});

cartSchema.virtual('totalAmount').get(function () {
    return this.products.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);
});

cartSchema.set('toJSON', { virtuals: true });

const cartModel = model(cartCollection, cartSchema);

module.exports = { cartModel };
