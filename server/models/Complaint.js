const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Product damaged',
        'Wrong product',
        'Missing item',
        'Delivery issue',
        'Payment issue',
        'Return request',
        'Exchange request',
        'Other',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    attachments: [String],
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'],
      default: 'OPEN',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ['USER', 'SUPPORT', 'BOT'],
          required: true,
        },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
