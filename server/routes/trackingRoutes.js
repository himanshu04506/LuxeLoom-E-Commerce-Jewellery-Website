const express = require('express');
const router = express.Router();
const { getTrackingInfo } = require('../controllers/trackingController');

router.get('/:orderId', getTrackingInfo);

module.exports = router;
