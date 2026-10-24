const express = require('express');
const router = express.Router();
const { getMetalRates, syncMetalRates } = require('../controllers/metalController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/rates', getMetalRates);
router.get('/rates/latest', getMetalRates);
router.post('/sync', protect, adminOnly, syncMetalRates);

module.exports = router;
