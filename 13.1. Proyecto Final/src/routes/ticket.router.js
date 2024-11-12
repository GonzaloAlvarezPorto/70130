const express = require('express');
const router = express.Router();
const TicketsController = require('../controllers/tickets.controller');

const {
   createTicket,
   enviarMail
} = new TicketsController();

// Ruta para crear un ticket
router.post('/tickets', createTicket);

router.get('/email', enviarMail);

module.exports = router;
