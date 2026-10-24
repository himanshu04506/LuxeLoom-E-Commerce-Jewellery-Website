const Complaint = require('../models/Complaint');
const Order = require('../models/Order');
const { SUPPORT_PHONE } = require('../config/constants');

// @desc    Get user's support tickets
// @route   GET /api/support
// @access  Private
const getTickets = async (req, res, next) => {
  try {
    const tickets = await Complaint.find({ user: req.user._id })
      .populate('order', 'orderId orderStatus totalAmount')
      .sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new complaint ticket
// @route   POST /api/support
// @access  Private
const createTicket = async (req, res, next) => {
  try {
    const { orderId, category, description, attachments, priority } = req.body;

    if (!category || !description) {
      return res.status(400).json({ success: false, message: 'Category and description are required.' });
    }

    let order;
    if (orderId) {
      order = await Order.findOne({ $or: [{ _id: orderId }, { orderId }] });
    }

    const ticketId = `TICKET-${Math.floor(10000 + Math.random() * 90000)}`;

    const ticket = await Complaint.create({
      ticketId,
      user: req.user._id,
      order: order ? order._id : null,
      category,
      description,
      attachments: attachments || [],
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      messages: [
        {
          sender: 'USER',
          text: description,
          timestamp: new Date(),
        },
        {
          sender: 'BOT',
          text: `Thank you for reaching out. Ticket ${ticketId} has been submitted. Our concierge team will review your case shortly.`,
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully!',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID
// @route   GET /api/support/:ticketId
// @access  Private
const getTicketById = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Complaint.findOne({
      $or: [{ ticketId }, { _id: ticketId }],
    }).populate('order');

    if (!ticket) return res.status(404).json({ success: false, message: 'Support ticket not found.' });

    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized access.' });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Add message to ticket thread
// @route   POST /api/support/:ticketId/messages
// @access  Private
const addMessageToTicket = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Message text is required.' });

    const ticket = await Complaint.findOne({
      $or: [{ ticketId: req.params.ticketId }, { _id: req.params.ticketId }],
    });

    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const sender = req.user.role === 'ADMIN' ? 'SUPPORT' : 'USER';
    ticket.messages.push({ sender, text, timestamp: new Date() });
    if (sender === 'SUPPORT' && ticket.status === 'OPEN') {
      ticket.status = 'IN_PROGRESS';
    }
    await ticket.save();

    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Automated Chatbot response API
// @route   POST /api/support/chatbot
// @access  Public / Private
const chatbotRespond = async (req, res, next) => {
  try {
    const { message, orderId } = req.body;
    const query = (message || '').toLowerCase().trim();

    let reply = '';
    let actionRequired = false;
    let escalatePhone = false;

    // Rule-based decision tree
    if (query.includes('where is my order') || query.includes('status') || query.includes('track')) {
      if (orderId) {
        const order = await Order.findOne({ $or: [{ orderId }, { trackingId: orderId }] });
        if (order) {
          reply = `Order #${order.orderId} is currently in state: ${order.orderStatus}. You can view the live map tracking on your tracking page.`;
        } else {
          reply = `I could not find an order matching "${orderId}". Please verify your Order ID from your dashboard.`;
        }
      } else {
        reply = 'To check your order status, please provide your Order ID (e.g. ORD-100823) or select it from your dashboard.';
      }
    } else if (query.includes('arrive') || query.includes('when') || query.includes('delivery time')) {
      reply = 'Standard luxury insured delivery takes 2 to 4 business days across India. All shipments are fully insured against loss or damage in transit.';
    } else if (query.includes('return') || query.includes('exchange') || query.includes('refund')) {
      reply = 'LuxeLoom offers a 15-day no-questions-asked return and exchange policy on all certified gold and silver jewellery items. Would you like to create a return ticket now?';
      actionRequired = true;
    } else if (query.includes('payment') || query.includes('fail') || query.includes('deducted')) {
      reply = 'If your payment was deducted but the order is pending, don’t worry! Razorpay automatically reconciles within 2 hours or refunds to your bank within 3-5 business days. You can also retry payment from your checkout page.';
    } else if (query.includes('defect') || query.includes('damage') || query.includes('wrong') || query.includes('missing')) {
      reply = 'We apologize for the issue with your item. Please click "Raise Complaint/Issue" below to submit photos and receive an immediate replacement.';
      actionRequired = true;
    } else {
      reply = `I am your LuxeLoom Automated Concierge. I couldn't automatically resolve your query. Would you like to speak directly with our senior phone support team?`;
      escalatePhone = true;
    }

    res.json({
      success: true,
      reply,
      actionRequired,
      escalatePhone,
      supportPhone: SUPPORT_PHONE,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  createTicket,
  getTicketById,
  addMessageToTicket,
  chatbotRespond,
};
