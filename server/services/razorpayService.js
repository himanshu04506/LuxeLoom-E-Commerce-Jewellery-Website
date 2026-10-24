const crypto = require('crypto');
const Razorpay = require('razorpay');

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_luxeloom12345') {
    try {
      razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } catch (e) {
      console.warn('[Razorpay] SDK init failed. Using demo payment simulator mode.');
    }
  }
  return razorpayInstance;
};

/**
 * Creates Razorpay order
 */
const createRazorpayOrder = async (amountInINR, receiptId) => {
  const instance = getRazorpayInstance();
  const amountInPaisa = Math.round(amountInINR * 100);

  if (instance) {
    try {
      const order = await instance.orders.create({
        amount: amountInPaisa,
        currency: 'INR',
        receipt: receiptId,
        payment_capture: 1,
      });
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        isMock: false,
      };
    } catch (err) {
      console.warn('[Razorpay] Order creation API failed, falling back to demo mode:', err.message);
    }
  }

  // Demo fallback order ID for test environment
  return {
    id: `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    amount: amountInPaisa,
    currency: 'INR',
    isMock: true,
  };
};

/**
 * Verifies Razorpay payment HMAC signature
 */
const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  // Demo mock orders auto-pass verification
  if (razorpayOrderId && razorpayOrderId.startsWith('order_mock_')) {
    return true;
  }

  if (!secret) return false;

  try {
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  } catch (err) {
    console.error('[Razorpay Signature Error]', err.message);
    return false;
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
};
