const mongoose = require('mongoose');
const { DEFAULT_METAL_RATES } = require('../config/constants');
const MetalRate = require('../models/MetalRate');

/**
 * Maps product metalType and purity to MetalRate record key
 */
const getMetalKey = (metalType, purity) => {
  const metal = (metalType || '').toUpperCase();
  const pur = (purity || '').toUpperCase();

  if (metal === 'SILVER') return 'SILVER_925';
  if (pur.includes('24')) return 'GOLD_24K';
  if (pur.includes('22')) return 'GOLD_22K';
  if (pur.includes('18')) return 'GOLD_18K';
  return 'GOLD_22K'; // default
};

/**
 * Fetches current rate per gram for a given metal and purity
 */
const getRatePerGram = async (metalType, purity) => {
  const key = getMetalKey(metalType, purity);
  if (mongoose.connection.readyState === 1) {
    try {
      const record = await MetalRate.findOne({ metalType: key });
      if (record && record.ratePerGram > 0) {
        return record.ratePerGram;
      }
    } catch (err) {
      console.warn(`[Pricing Engine] Failed to fetch rate from DB for ${key}, using fallback.`);
    }
  }
  return DEFAULT_METAL_RATES[key] || 6645;
};


/**
 * Calculates item price breakdown based on product data and active metal rates map
 */
const calculateProductPrice = (product, customRate = null, ratesMap = null) => {
  const key = getMetalKey(product.metalType, product.purity);
  let ratePerGram = customRate;

  if (!ratePerGram) {
    if (ratesMap && ratesMap[key] && ratesMap[key].ratePerGram > 0) {
      ratePerGram = ratesMap[key].ratePerGram;
    } else {
      ratePerGram = DEFAULT_METAL_RATES[key] || 6645;
    }
  }

  const weight = Number(product.weight) || 0;
  const makingCharges = Number(product.makingCharges) || 0;
  const wastagePercentage = Number(product.wastagePercentage) || 0;
  const stoneCharges = Number(product.stoneCharges) || 0;
  const gstPercentage = Number(product.gstPercentage) || 3.0;

  const baseMetalPrice = Math.round(weight * ratePerGram);
  const wastageCharges = Math.round((baseMetalPrice * wastagePercentage) / 100);
  const subtotal = baseMetalPrice + makingCharges + wastageCharges + stoneCharges;
  const gst = Math.round((subtotal * gstPercentage) / 100);
  const finalPrice = Math.round(subtotal + gst);

  return {
    ratePerGram,
    weight,
    baseMetalPrice,
    makingCharges,
    wastagePercentage,
    wastageCharges,
    stoneCharges,
    subtotal,
    gstPercentage,
    gst,
    finalPrice,
  };
};

module.exports = {
  getMetalKey,
  getRatePerGram,
  calculateProductPrice,
};
