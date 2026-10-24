const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: { type: String, required: true },
  sku: { type: String },
  weight: { type: Number, required: true },
  metalType: { type: String, required: true },
  purity: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  ratePerGramAtPurchase: { type: Number, required: true },
  baseMetalPrice: { type: Number, required: true },
  makingCharges: { type: Number, required: true },
  wastageCharges: { type: Number, required: true },
  stoneCharges: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  gst: { type: Number, required: true },
  finalUnitPrice: { type: Number, required: true },
  totalItemPrice: { type: Number, required: true },
  image: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      house: String,
      street: String,
      locality: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
      latitude: Number,
      longitude: Number,
    },
    subtotal: { type: Number, required: true },
    metalCharges: { type: Number, required: true },
    makingCharges: { type: Number, required: true },
    wastageCharges: { type: Number, required: true },
    stoneCharges: { type: Number, required: true },
    gst: { type: Number, required: true },
    deliveryCharges: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    orderStatus: {
      type: String,
      enum: [
        'PLACED',
        'PAYMENT_CONFIRMED',
        'PROCESSING',
        'PACKED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'RETURNED',
      ],
      default: 'PLACED',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    trackingId: { type: String },
    deliveryCoordinates: {
      latitude: { type: Number, default: 28.6139 },
      longitude: { type: Number, default: 77.2090 },
      lastUpdated: { type: Date, default: Date.now },
    },
    timeline: [
      {
        status: { type: String },
        comment: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
