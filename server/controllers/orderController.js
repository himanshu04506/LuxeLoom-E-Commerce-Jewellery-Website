const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Address = require('../models/Address');
const { calculateProductPrice } = require('../services/pricingService');
const { createRazorpayOrder } = require('../services/razorpayService');
const { FREE_SHIPPING_THRESHOLD, DEFAULT_DELIVERY_CHARGE } = require('../config/constants');

// @desc    Create new order & initialize payment order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { addressId, customAddress } = req.body;

    let shippingAddress;
    if (addressId) {
      const addr = await Address.findOne({ _id: addressId, user: req.user._id });
      if (!addr) return res.status(400).json({ success: false, message: 'Invalid shipping address selected.' });
      shippingAddress = {
        fullName: addr.fullName,
        phone: addr.phone,
        house: addr.house,
        street: addr.street,
        locality: addr.locality,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        landmark: addr.landmark,
        latitude: addr.latitude,
        longitude: addr.longitude,
      };
    } else if (customAddress) {
      shippingAddress = customAddress;
    } else {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }

    // Get user cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    // Recalculate all item prices strictly on backend & verify stock
    const orderItems = [];
    let subtotal = 0;
    let totalMetalCharges = 0;
    let totalMakingCharges = 0;
    let totalWastageCharges = 0;
    let totalStoneCharges = 0;
    let totalGst = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ success: false, message: 'Product in cart is no longer available.' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
        });
      }

      // Compute live dynamic price snapshot
      const pricing = await calculateProductPrice(product);
      const qty = item.quantity;

      const itemMetalTotal = pricing.baseMetalPrice * qty;
      const itemMakingTotal = pricing.makingCharges * qty;
      const itemWastageTotal = pricing.wastageCharges * qty;
      const itemStoneTotal = pricing.stoneCharges * qty;
      const itemSubtotal = pricing.subtotal * qty;
      const itemGst = pricing.gst * qty;
      const itemFinalTotal = pricing.finalPrice * qty;

      totalMetalCharges += itemMetalTotal;
      totalMakingCharges += itemMakingTotal;
      totalWastageCharges += itemWastageTotal;
      totalStoneCharges += itemStoneTotal;
      subtotal += itemSubtotal;
      totalGst += itemGst;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        weight: product.weight,
        metalType: product.metalType,
        purity: product.purity,
        quantity: qty,
        ratePerGramAtPurchase: pricing.ratePerGram,
        baseMetalPrice: pricing.baseMetalPrice,
        makingCharges: pricing.makingCharges,
        wastageCharges: pricing.wastageCharges,
        stoneCharges: pricing.stoneCharges,
        subtotal: pricing.subtotal,
        gst: pricing.gst,
        finalUnitPrice: pricing.finalPrice,
        totalItemPrice: itemFinalTotal,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
      });
    }

    const deliveryCharges = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_DELIVERY_CHARGE;
    const grandTotal = subtotal + totalGst + deliveryCharges;

    const uniqueNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${uniqueNum}`;
    const trackingId = `TRK-${uniqueNum}`;

    // Create Razorpay payment order
    const razorpayOrder = await createRazorpayOrder(grandTotal, orderId);

    const newOrder = await Order.create({
      orderId,
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      metalCharges: totalMetalCharges,
      makingCharges: totalMakingCharges,
      wastageCharges: totalWastageCharges,
      stoneCharges: totalStoneCharges,
      gst: totalGst,
      deliveryCharges,
      totalAmount: grandTotal,
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      razorpayOrderId: razorpayOrder.id,
      trackingId,
      deliveryCoordinates: {
        latitude: shippingAddress.latitude || 28.6139,
        longitude: shippingAddress.longitude || 77.2090,
      },
      timeline: [
        {
          status: 'PLACED',
          comment: 'Order placed successfully. Awaiting payment confirmation.',
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully. Proceed to payment.',
      order: newOrder,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_luxeloom12345',
      razorpayOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's order history
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.json({ success: true, orders: [] });
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order detail
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.startsWith('ORD-')) {
      order = await Order.findOne({ orderId: id });
    } else {
      order = await Order.findById(id);
    }

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Check ownership or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled after dispatch.' });
    }

    order.orderStatus = 'CANCELLED';
    order.timeline.push({
      status: 'CANCELLED',
      comment: 'Order cancelled by customer.',
      timestamp: new Date(),
    });
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully.', order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
};
