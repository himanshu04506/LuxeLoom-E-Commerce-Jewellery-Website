const Order = require('../models/Order');

// @desc    Get live order delivery tracking & map coordinates
// @route   GET /api/tracking/:orderId
// @access  Public or Private
const getTrackingInfo = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    let order;

    if (orderId.startsWith('ORD-') || orderId.startsWith('TRK-')) {
      order = await Order.findOne({
        $or: [{ orderId }, { trackingId: orderId }],
      });
    } else {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order tracking ID not found.' });
    }

    // Default origin warehouse coordinates (e.g. Mumbai / Delhi Luxury Hub)
    const warehouseCoords = { latitude: 28.6359, longitude: 77.2245, name: 'LuxeLoom Central Fulfillment Hub' };
    const destinationCoords = {
      latitude: order.shippingAddress.latitude || 28.6139,
      longitude: order.shippingAddress.longitude || 77.2090,
      address: `${order.shippingAddress.house}, ${order.shippingAddress.street}, ${order.shippingAddress.city}`,
    };

    // Calculate current simulated driver progress based on orderStatus
    let progressPercentage = 10; // Placed
    if (order.orderStatus === 'PAYMENT_CONFIRMED') progressPercentage = 25;
    if (order.orderStatus === 'PROCESSING') progressPercentage = 40;
    if (order.orderStatus === 'PACKED') progressPercentage = 60;
    if (order.orderStatus === 'SHIPPED') progressPercentage = 75;
    if (order.orderStatus === 'OUT_FOR_DELIVERY') progressPercentage = 90;
    if (order.orderStatus === 'DELIVERED') progressPercentage = 100;

    // Linear interpolation for driver coordinates
    const currentLat =
      warehouseCoords.latitude + (destinationCoords.latitude - warehouseCoords.latitude) * (progressPercentage / 100);
    const currentLng =
      warehouseCoords.longitude + (destinationCoords.longitude - warehouseCoords.longitude) * (progressPercentage / 100);

    res.json({
      success: true,
      orderId: order.orderId,
      trackingId: order.trackingId,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      estimatedDelivery: new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000),
      warehouseCoords,
      destinationCoords,
      currentDriverCoords: {
        latitude: currentLat,
        longitude: currentLng,
      },
      progressPercentage,
      timeline: order.timeline,
      shippingAddress: order.shippingAddress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrackingInfo,
};
