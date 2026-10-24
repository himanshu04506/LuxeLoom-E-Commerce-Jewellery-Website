const express = require('express');
const router = express.Router();
const { getTickets, createTicket, getTicketById, addMessageToTicket, chatbotRespond } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chatbot', chatbotRespond);

router.use(protect);
router.get('/', getTickets);
router.post('/', createTicket);
router.get('/:ticketId', getTicketById);
router.post('/:ticketId/messages', addMessageToTicket);

module.exports = router;
