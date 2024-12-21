const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketCollection = 'ticket'

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return `TICKET-${Math.floor(100000 + Math.random() * 900000)}`;
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true 
    }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
module.exports = {
    ticketModel
};
