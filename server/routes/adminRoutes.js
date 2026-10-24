const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/metal-rates', updateMetalRates);
router.get('/complaints', getAllComplaints);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
