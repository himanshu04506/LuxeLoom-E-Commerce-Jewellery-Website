const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const MetalRate = require('../models/MetalRate');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');
const { getLatestRatesMap } = require('../services/metalRateService');
const { sendOrderStatusEmail } = require('../services/emailService');
const { FALLBACK_USERS, findUserById } = require('../data/fallbackUsers');


// @desc    Get admin dashboard metrics & analytics summary
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['PLACED', 'PAYMENT_CONFIRMED', 'PROCESSING'] } });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 3 } });
    const failedPayments = await Payment.countDocuments({ status: 'FAILED' });
    const openComplaints = await Complaint.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } });

    // Aggregate total sales from confirmed/paid orders
    const salesData = await Order.aggregate([
      { $match: { paymentStatus: 'PAID' } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    const rates = await getLatestRatesMap();
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalSales,
        pendingOrders,
        lowStockProducts,
        failedPayments,
        openComplaints,
        rates,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Add Product
// @route   POST /api/admin/products
// @access  Private/Admin
const addProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      metalType,
      purity,
      weight,
      makingCharges,
      wastagePercentage,
      stoneCharges,
      gstPercentage,
      images,
      stock,
      sku,
      isFeatured,
      isBestSeller,
    } = req.body;

    if (!name || !description || !category || !metalType || !purity || !weight || !sku) {
      return res.status(400).json({ success: false, message: 'Please provide all required product fields.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      subcategory: subcategory || 'General',
      metalType: metalType.toUpperCase(),
      purity: purity.toUpperCase(),
      weight: Number(weight),
      makingCharges: Number(makingCharges) || 500,
      wastagePercentage: Number(wastagePercentage) || 3.0,
      stoneCharges: Number(stoneCharges) || 0,
      gstPercentage: Number(gstPercentage) || 3.0,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'],
      stock: Number(stock) || 10,
      sku: sku.toUpperCase(),
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
    });

    res.status(201).json({ success: true, message: 'Product added successfully!', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Edit Product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, message: 'Product updated successfully.', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Delete Product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Get All Orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.orderStatus = status;

    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('user', 'name email phone');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Update Order Status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, comment } = req.body;
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.orderStatus = orderStatus;
    order.timeline.push({
      status: orderStatus,
      comment: comment || `Order status updated to ${orderStatus} by system admin.`,
      timestamp: new Date(),
    });

    await order.save();

    // Notify customer by email
    if (order.user && order.user.email) {
      sendOrderStatusEmail(order.user, order, orderStatus);
    }

    res.json({ success: true, message: `Order status updated to ${orderStatus}.`, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Update Metal Rates
// @route   PUT /api/admin/metal-rates
// @access  Private/Admin
const updateMetalRates = async (req, res, next) => {
  try {
    const { rates } = req.body; // e.g. { GOLD_24K: 7300, GOLD_22K: 6700, GOLD_18K: 5480, SILVER_925: 90 }

    if (!rates) return res.status(400).json({ success: false, message: 'Rates object is required.' });

    for (const [key, value] of Object.entries(rates)) {
      if (value > 0) {
        await MetalRate.findOneAndUpdate(
          { metalType: key },
          { ratePerGram: Number(value), source: 'ADMIN_OVERRIDE', effectiveDate: new Date() },
          { upsert: true }
        );
      }
    }

    const updatedRates = await getLatestRatesMap();
    res.json({ success: true, message: 'Metal rates updated successfully!', rates: updatedRates });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Get All Support Complaints
// @route   GET /api/admin/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('order', 'orderId orderStatus');
    res.json({ success: true, complaints });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Get All Registered Users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    let users = [];
    if (mongoose.connection.readyState === 1) {
      try {
        users = await User.find({}).sort({ createdAt: -1 });
      } catch (err) {
        console.warn('[Admin Controller] DB unavailable for getAllUsers.');
      }
    }

    if (!users || users.length === 0) {
      users = FALLBACK_USERS.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
      }));
    }

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Toggle User Active Status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(userId);
        if (user) {
          user.isActive = !user.isActive;
          await user.save();
          return res.json({ success: true, message: `User status changed to ${user.isActive ? 'Active' : 'Disabled'}.`, user });
        }
      } catch (err) {
        console.warn('[Admin Controller] DB error during toggleUserStatus.');
      }
    }

    user = findUserById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = !user.isActive;
    res.json({ success: true, message: `User status changed to ${user.isActive ? 'Active' : 'Disabled'}.`, user });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAdminStats,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  updateMetalRates,
  getAllComplaints,
  getAllUsers,
  toggleUserStatus,
};
