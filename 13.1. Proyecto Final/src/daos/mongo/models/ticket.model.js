const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketCollection = 'ticket'

// Definimos el esquema para el Ticket
const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return `TICKET-${Math.floor(100000 + Math.random() * 900000)}`; // Genera un código único aleatorio
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now // Guardamos la fecha y hora actual al momento de crear el ticket
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true // El correo del usuario asociado a la compra
    }
});

// Creamos y exportamos el modelo basado en el esquema
const ticketModel = mongoose.model(ticketCollection, ticketSchema);
module.exports = {
    ticketModel
};
