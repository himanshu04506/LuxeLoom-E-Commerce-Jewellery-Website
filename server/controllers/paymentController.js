const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { verifyPaymentSignature } = require('../services/razorpayService');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// @desc    Verify Razorpay payment signature & update inventory/order status
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order reference not found.' });
    }

    const isValidSignature = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValidSignature) {
      // Record payment failure
      await Payment.create({
        order: order._id,
        razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || 'N/A',
        razorpaySignature: razorpaySignature || 'N/A',
        amount: order.totalAmount,
        status: 'FAILED',
        failureReason: 'Razorpay HMAC signature verification failed.',
      });

      order.paymentStatus = 'FAILED';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Security signature mismatch.',
      });
    }

    // Payment Successful
    order.paymentStatus = 'PAID';
    order.orderStatus = 'PAYMENT_CONFIRMED';
    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
    order.timeline.push({
      status: 'PAYMENT_CONFIRMED',
      comment: `Payment of ₹${order.totalAmount.toLocaleString('en-IN')} confirmed via Razorpay.`,
      timestamp: new Date(),
    });

    await order.save();

    // Create payment transaction log
    await Payment.create({
      order: order._id,
      razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      razorpaySignature: razorpaySignature || 'mock_signature',
      amount: order.totalAmount,
      status: 'SUCCESS',
    });

    // Atomic inventory deduction
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Send Order Confirmation Email
    const user = await User.findById(req.user._id);
    if (user) {
      sendOrderConfirmationEmail(user, order);
    }

    res.json({
      success: true,
      message: 'Payment verified & order confirmed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyPayment,
};
