const axios = require('axios');
const mongoose = require('mongoose');
const MetalRate = require('../models/MetalRate');
const { DEFAULT_METAL_RATES } = require('../config/constants');

const fetchAndSyncMetalRates = async () => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    // Check DB first
    const existingRates = await MetalRate.find({});
    
    // Seed defaults if empty
    if (existingRates.length === 0) {
      console.log('[Metal Rate Service] Initializing default metal rates in database...');
      const defaultEntries = [
        { metalType: 'GOLD_24K', ratePerGram: DEFAULT_METAL_RATES.GOLD_24K, source: 'SYSTEM_DEFAULT' },
        { metalType: 'GOLD_22K', ratePerGram: DEFAULT_METAL_RATES.GOLD_22K, source: 'SYSTEM_DEFAULT' },
        { metalType: 'GOLD_18K', ratePerGram: DEFAULT_METAL_RATES.GOLD_18K, source: 'SYSTEM_DEFAULT' },
        { metalType: 'SILVER_925', ratePerGram: DEFAULT_METAL_RATES.SILVER_925, source: 'SYSTEM_DEFAULT' },
      ];
      await MetalRate.insertMany(defaultEntries);
    }

    // If external API key exists, try calling external rate API
    const apiKey = process.env.METAL_API_KEY;
    if (apiKey && apiKey !== 'mock_key' && apiKey !== 'your_gold_api_key_here') {
      try {
        const response = await axios.get(`https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=INR&currencies=XAU,XAG`);
        if (response.data && response.data.rates) {
          const goldPricePerOunceInr = response.data.rates.INR / response.data.rates.XAU;
          const gold24kGram = Math.round(goldPricePerOunceInr / 31.1035);
          const gold22kGram = Math.round(gold24kGram * (22 / 24));
          const gold18kGram = Math.round(gold24kGram * (18 / 24));

          const silverPricePerOunceInr = response.data.rates.INR / response.data.rates.XAG;
          const silver925Gram = Math.round((silverPricePerOunceInr / 31.1035) * 0.925);

          await MetalRate.findOneAndUpdate({ metalType: 'GOLD_24K' }, { ratePerGram: gold24kGram, source: 'LIVE_API', effectiveDate: new Date() });
          await MetalRate.findOneAndUpdate({ metalType: 'GOLD_22K' }, { ratePerGram: gold22kGram, source: 'LIVE_API', effectiveDate: new Date() });
          await MetalRate.findOneAndUpdate({ metalType: 'GOLD_18K' }, { ratePerGram: gold18kGram, source: 'LIVE_API', effectiveDate: new Date() });
          await MetalRate.findOneAndUpdate({ metalType: 'SILVER_925' }, { ratePerGram: silver925Gram, source: 'LIVE_API', effectiveDate: new Date() });
          console.log('[Metal Rate Service] Successfully synced live rates from API.');
        }
      } catch (apiErr) {
        console.warn('[Metal Rate Service] External metal rate API failed. Falling back to stored database rates.');
      }
    }
  } catch (err) {
    console.error('[Metal Rate Service Error]', err.message);
  }
};

const getLatestRatesMap = async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      const rates = await MetalRate.find({});
      if (rates && rates.length > 0) {
        const map = {};
        rates.forEach((r) => {
          map[r.metalType] = {
            ratePerGram: r.ratePerGram,
            source: r.source,
            effectiveDate: r.effectiveDate || r.updatedAt,
          };
        });

        // Fill defaults if missing
        Object.keys(DEFAULT_METAL_RATES).forEach((key) => {
          if (!map[key]) {
            map[key] = {
              ratePerGram: DEFAULT_METAL_RATES[key],
              source: 'DEFAULT',
              effectiveDate: new Date(),
            };
          }
        });

        return map;
      }
    } catch (err) {
      // Fallback below
    }
  }

  return {
    GOLD_24K: { ratePerGram: DEFAULT_METAL_RATES.GOLD_24K, source: 'FALLBACK', effectiveDate: new Date() },
    GOLD_22K: { ratePerGram: DEFAULT_METAL_RATES.GOLD_22K, source: 'FALLBACK', effectiveDate: new Date() },
    GOLD_18K: { ratePerGram: DEFAULT_METAL_RATES.GOLD_18K, source: 'FALLBACK', effectiveDate: new Date() },
    SILVER_925: { ratePerGram: DEFAULT_METAL_RATES.SILVER_925, source: 'FALLBACK', effectiveDate: new Date() },
  };
};

module.exports = {
  fetchAndSyncMetalRates,
  getLatestRatesMap,
};
