const mongoose = require('mongoose');

const metalRateSchema = new mongoose.Schema(
  {
    metalType: {
      type: String,
      required: true,
      unique: true,
      enum: ['GOLD_24K', 'GOLD_22K', 'GOLD_18K', 'SILVER_925'],
    },
    ratePerGram: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    source: {
      type: String,
      default: 'LIVE_API',
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MetalRate', metalRateSchema);
