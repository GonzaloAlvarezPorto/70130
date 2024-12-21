const { createTransport } = require("nodemailer");
const { ticketModel } = require("../daos/mongo/models/ticket.model");
const { configObject } = require("../config");

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user,
        pass: configObject.gmail_pass
    }
});

exports.sendEmail = async (ticketCode) => {
    try {
        const ticket = await ticketModel.findOne({ code: 'TICKET-165246' });
        
        if (!ticket) {
            console.log("Ticket no encontrado.");
            return;
        }

        const { code, purchase_datetime, amount, purchaser } = ticket;

        const message = `
            <div>
                <h1>Detalle de la Compra</h1>
                <p><strong>Código del Ticket:</strong> ${code}</p>
                <p><strong>Fecha de Compra:</strong> ${new Date(purchase_datetime).toLocaleDateString()}</p>
                <p><strong>Hora de Compra:</strong> ${new Date(purchase_datetime).toLocaleTimeString()}</p>
                <p><strong>Monto Total:</strong> $${amount.toFixed(2)}</p>
                <p><strong>Comprador:</strong> ${purchaser}</p>
            </div>
        `;

        await transport.sendMail({
            from: `Gonzalo Alvarez Porto <${configObject.gmail_user}>`,
            to: 'gonzaalvarezporto@gmail.com',
            subject: 'Detalles de su compra',
            html: message
        });

        console.log("Correo enviado exitosamente con los detalles de la compra.");
        
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
}
