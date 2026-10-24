const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const FALLBACK_PRODUCTS = require('../data/productsData');
const { calculateProductPrice } = require('../services/pricingService');

// In-memory cart store when MongoDB is offline
const IN_MEMORY_CARTS = new Map();

const findProductHelper = async (productId) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const prod = await Product.findById(productId);
      if (prod) return prod;
    } catch (err) {}
  }
  const idStr = String(productId);
  return FALLBACK_PRODUCTS.find((p) => String(p._id) === idStr || p.slug === idStr);
};

const getMemoryCart = (userId) => {
  const key = String(userId);
  if (!IN_MEMORY_CARTS.has(key)) {
    IN_MEMORY_CARTS.set(key, { items: [] });
  }
  return IN_MEMORY_CARTS.get(key);
};

// Helper to calculate cart totals dynamically from live product pricing
const computeCartDetails = async (cartItems) => {
  let subtotal = 0;
  let totalMetalCharges = 0;
  let totalMakingCharges = 0;
  let totalWastageCharges = 0;
  let totalStoneCharges = 0;
  let totalGst = 0;
  let totalAmount = 0;

  const items = [];

  for (const item of cartItems) {
    if (!item.product) continue;
    const prodId = item.product._id || item.product;
    const prod = await findProductHelper(prodId);
    if (!prod) continue;

    const prodData = typeof prod.toObject === 'function' ? prod.toObject() : prod;
    const pricing = calculateProductPrice(prodData);
    const qty = Number(item.quantity) || 1;

    const itemTotalSubtotal = pricing.subtotal * qty;
    const itemTotalGst = pricing.gst * qty;
    const itemTotalFinal = pricing.finalPrice * qty;

    totalMetalCharges += pricing.baseMetalPrice * qty;
    totalMakingCharges += pricing.makingCharges * qty;
    totalWastageCharges += pricing.wastageCharges * qty;
    totalStoneCharges += pricing.stoneCharges * qty;
    subtotal += itemTotalSubtotal;
    totalGst += itemTotalGst;
    totalAmount += itemTotalFinal;

    items.push({
      _id: item._id || `item_${prod._id}`,
      product: {
        _id: prod._id,
        name: prod.name,
        slug: prod.slug,
        category: prod.category,
        metalType: prod.metalType,
        purity: prod.purity,
        weight: prod.weight,
        images: prod.images,
        stock: prod.stock,
        sku: prod.sku,
      },
      quantity: qty,
      unitPricing: pricing,
      itemTotal: itemTotalFinal,
    });
  }

  return {
    items,
    metalCharges: totalMetalCharges,
    makingCharges: totalMakingCharges,
    wastageCharges: totalWastageCharges,
    stoneCharges: totalStoneCharges,
    subtotal,
    gst: totalGst,
    totalAmount,
    totalItemsCount: items.reduce((acc, item) => acc + item.quantity, 0),
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let cartItems = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
          cart = await Cart.create({ user: userId, items: [] });
        }
        cartItems = cart.items;
      } catch (err) {
        cartItems = getMemoryCart(userId).items;
      }
    } else {
      cartItems = getMemoryCart(userId).items;
    }

    const cartDetails = await computeCartDetails(cartItems);
    res.json({ success: true, cart: cartDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id || req.user.id;

    const product = await findProductHelper(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items remaining in stock.` });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
          cart = await Cart.create({ user: userId, items: [] });
        }
        const existingIndex = cart.items.findIndex(
          (item) => String(item.product) === String(productId)
        );
        if (existingIndex > -1) {
          const newQty = cart.items[existingIndex].quantity + quantity;
          if (product.stock < newQty) {
            return res.status(400).json({ success: false, message: `Cannot add more. Max available stock is ${product.stock}.` });
          }
          cart.items[existingIndex].quantity = newQty;
        } else {
          cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        const cartDetails = await computeCartDetails(cart.items);
        return res.json({ success: true, message: 'Item added to cart!', cart: cartDetails });
      } catch (err) {}
    }

    const memCart = getMemoryCart(userId);
    const existingIndex = memCart.items.findIndex(
      (item) => String(item.product) === String(productId)
    );
    if (existingIndex > -1) {
      const newQty = memCart.items[existingIndex].quantity + quantity;
      if (product.stock < newQty) {
        return res.status(400).json({ success: false, message: `Cannot add more. Max available stock is ${product.stock}.` });
      }
      memCart.items[existingIndex].quantity = newQty;
    } else {
      memCart.items.push({ product: productId, quantity, _id: `mem_${Date.now()}` });
    }

    const cartDetails = await computeCartDetails(memCart.items);
    res.json({ success: true, message: 'Item added to cart!', cart: cartDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
const updateCartQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
          const itemIndex = cart.items.findIndex((item) => String(item.product) === String(productId));
          if (itemIndex > -1) {
            if (quantity <= 0) {
              cart.items.splice(itemIndex, 1);
            } else {
              const product = await findProductHelper(productId);
              if (product && product.stock < quantity) {
                return res.status(400).json({ success: false, message: `Stock limit reached. Only ${product.stock} available.` });
              }
              cart.items[itemIndex].quantity = quantity;
            }
            await cart.save();
            const cartDetails = await computeCartDetails(cart.items);
            return res.json({ success: true, cart: cartDetails });
          }
        }
      } catch (err) {}
    }

    const memCart = getMemoryCart(userId);
    const itemIndex = memCart.items.findIndex((item) => String(item.product) === String(productId));
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        memCart.items.splice(itemIndex, 1);
      } else {
        const product = await findProductHelper(productId);
        if (product && product.stock < quantity) {
          return res.status(400).json({ success: false, message: `Stock limit reached. Only ${product.stock} available.` });
        }
        memCart.items[itemIndex].quantity = quantity;
      }
    }

    const cartDetails = await computeCartDetails(memCart.items);
    res.json({ success: true, cart: cartDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
          cart.items = cart.items.filter((item) => String(item.product) !== String(productId));
          await cart.save();
          const cartDetails = await computeCartDetails(cart.items);
          return res.json({ success: true, message: 'Item removed from cart', cart: cartDetails });
        }
      } catch (err) {}
    }

    const memCart = getMemoryCart(userId);
    memCart.items = memCart.items.filter((item) => String(item.product) !== String(productId));
    const cartDetails = await computeCartDetails(memCart.items);
    res.json({ success: true, message: 'Item removed from cart', cart: cartDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (mongoose.connection.readyState === 1) {
      try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
          cart.items = [];
          await cart.save();
        }
      } catch (err) {}
    }

    const memCart = getMemoryCart(userId);
    memCart.items = [];
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};

