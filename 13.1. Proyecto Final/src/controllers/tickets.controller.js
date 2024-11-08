const Ticket = require('../models/ticket.model');

class TicketsController {
    // Crear un nuevo ticket
    createTicket = async (req, res) => {
        const { amount, purchaser } = req.body; // Suponemos que el cuerpo contiene la cantidad total y el correo del comprador

        try {
            const newTicket = new Ticket({
                amount,
                purchaser
            });

            // Guardar el ticket en la base de datos
            await newTicket.save();

            // Devolver el ticket creado
            res.status(201).json({
                message: 'Ticket creado con éxito',
                ticket: newTicket
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el ticket' });
        }
    };
}

module.exports = new TicketsController();
