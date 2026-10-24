const MetalRate = require('../models/MetalRate');
const { getLatestRatesMap, fetchAndSyncMetalRates } = require('../services/metalRateService');

// @desc    Get current gold/silver market rates per gram
// @route   GET /api/metals/rates
// @access  Public
const getMetalRates = async (req, res, next) => {
  try {
    const ratesMap = await getLatestRatesMap();
    res.json({
      success: true,
      timestamp: new Date(),
      currency: 'INR',
      rates: ratesMap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually trigger metal rate refresh/sync
// @route   POST /api/metals/sync
// @access  Private/Admin
const syncMetalRates = async (req, res, next) => {
  try {
    await fetchAndSyncMetalRates();
    const ratesMap = await getLatestRatesMap();
    res.json({
      success: true,
      message: 'Metal rates updated successfully!',
      rates: ratesMap,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMetalRates,
  syncMetalRates,
};
