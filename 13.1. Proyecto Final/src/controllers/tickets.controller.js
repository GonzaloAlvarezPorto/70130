const { ticketModel } = require('../daos/mongo/models/ticket.model');
const { sendEmail } = require('../utils/sendEmail');

class TicketsController {
    // Crear un nuevo ticket
    createTicket = async (req, res) => {
        const { amount, purchaser } = req.body; // Suponemos que el cuerpo contiene la cantidad total y el correo del comprador

        try {
            const newTicket = new ticketModel({
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

    enviarMail = async (req, res) => {
        try {
            await sendEmail()
            res.send('mail enviado');
        } catch (error) {
            console.log(error);

        }
    }
}

module.exports = TicketsController;
