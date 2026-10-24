const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { calculateProductPrice } = require('../services/pricingService');
const { getLatestRatesMap } = require('../services/metalRateService');
const FALLBACK_PRODUCTS = require('../data/productsData');

// @desc    Get all products with dynamic live pricing, search & filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      metalType,
      purity,
      search,
      isFeatured,
      isBestSeller,
      sort,
      page = 1,
      limit = 12,
      minPrice,
      maxPrice,
    } = req.query;

    const searchTokens = (search || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const query = {};

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (metalType) {
      query.metalType = metalType.toUpperCase();
    }
    if (purity) {
      query.purity = purity.toUpperCase();
    }
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (isBestSeller === 'true') {
      query.isBestSeller = true;
    }

    if (searchTokens.length > 0) {
      query.$and = searchTokens.map((tok) => {
        const rootWord = tok.endsWith('s') && tok.length > 3 ? tok.slice(0, -1) : tok;
        const escapedTok = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedRoot = rootWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`(${escapedTok}|${escapedRoot})`, 'i');
        return {
          $or: [
            { name: { $regex: pattern } },
            { description: { $regex: pattern } },
            { category: { $regex: pattern } },
            { subcategory: { $regex: pattern } },
            { metalType: { $regex: pattern } },
            { purity: { $regex: pattern } },
            { sku: { $regex: pattern } },
          ],
        };
      });
    }

    const ratesMap = await getLatestRatesMap();
    let products = [];
    let dbQueried = false;

    if (mongoose.connection.readyState === 1) {
      try {
        products = await Product.find(query).sort({ createdAt: -1 });
        dbQueried = true;
      } catch (dbErr) {
        console.warn('[Products Controller] Database query error, using fallback catalog.');
      }
    }

    if (!dbQueried) {
      products = FALLBACK_PRODUCTS.filter((p) => {
        if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
        if (metalType && p.metalType.toUpperCase() !== metalType.toUpperCase()) return false;
        if (purity && p.purity.toUpperCase() !== purity.toUpperCase()) return false;
        if (isFeatured === 'true' && !p.isFeatured) return false;
        if (isBestSeller === 'true' && !p.isBestSeller) return false;

        if (searchTokens.length > 0) {
          const targetStr = `${p.name} ${p.description || ''} ${p.category} ${p.subcategory || ''} ${p.metalType} ${p.purity} ${p.sku}`.toLowerCase();
          const matchesAll = searchTokens.every((tok) => {
            const t = tok.toLowerCase();
            const root = t.endsWith('s') && t.length > 3 ? t.slice(0, -1) : t;
            return targetStr.includes(t) || targetStr.includes(root);
          });
          if (!matchesAll) return false;
        }

        return true;
      });
    }

    // Attach dynamic live price breakdown to each product synchronously (instant math)
    let calculatedProducts = products.map((prod) => {
      const prodData = typeof prod.toObject === 'function' ? prod.toObject() : prod;
      const priceInfo = calculateProductPrice(prodData, null, ratesMap);
      return {
        ...prodData,
        dynamicPricing: priceInfo,
        price: priceInfo.finalPrice, // computed live price
      };
    });

    // Price range filtering (since price is dynamic)
    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Infinity;
      calculatedProducts = calculatedProducts.filter((p) => p.price >= min && p.price <= max);
    }

    // Sorting
    if (sort === 'price_asc') {
      calculatedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      calculatedProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'weight_desc') {
      calculatedProducts.sort((a, b) => b.weight - a.weight);
    }

    // Pagination
    const totalCount = calculatedProducts.length;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = calculatedProducts.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      count: totalCount,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      currentPage: pageNum,
      products: paginatedProducts,
      ratesMap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details with live price breakdown
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.connection.readyState === 1) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          product = await Product.findById(id);
        } else {
          product = await Product.findOne({ slug: id });
        }
      } catch (err) {
        console.warn('[Products Controller] DB unavailable during getProductById lookup.');
      }
    }

    if (!product) {
      product = FALLBACK_PRODUCTS.find((p) => p._id === id || p.slug === id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const ratesMap = await getLatestRatesMap();
    const prodData = typeof product.toObject === 'function' ? product.toObject() : product;
    const priceInfo = calculateProductPrice(prodData, null, ratesMap);

    res.json({
      success: true,
      product: {
        ...prodData,
        dynamicPricing: priceInfo,
        price: priceInfo.finalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of product categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    let categories = [];
    if (mongoose.connection.readyState === 1) {
      try {
        categories = await Category.find({}).sort({ name: 1 });
      } catch (err) {
        console.warn('[Products Controller] DB unavailable during getCategories lookup.');
      }
    }

    if (!categories || categories.length === 0) {
      categories = [
        { name: 'Rings', slug: 'rings' },
        { name: 'Necklaces', slug: 'necklaces' },
        { name: 'Earrings', slug: 'earrings' },
        { name: 'Bracelets', slug: 'bracelets' },
        { name: 'Bangles', slug: 'bangles' },
        { name: 'Chains', slug: 'chains' },
        { name: 'Pendants', slug: 'pendants' },
      ];
    }

    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
};
