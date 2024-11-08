const express = require('express');
const router = express.Router();
const TicketsController = require('../controllers/tickets.controller');

// Ruta para crear un ticket
router.post('/tickets', TicketsController.createTicket);

module.exports = router;
