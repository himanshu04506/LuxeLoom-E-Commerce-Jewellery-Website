import React, { useState, useEffect } from 'react';
import { getAdminOrders, updateAdminOrderStatus } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { Package, Truck, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';
import { formatINR, formatGram } from '../../utils/currencyFormatter';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchOrdersList = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders(selectedStatusFilter);
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersList();
  }, [selectedStatusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await updateAdminOrderStatus(orderId, newStatus, `Order status changed to ${newStatus} by admin.`);
      if (res.success) {
        setToast({ message: `Order updated to ${newStatus}! Email sent to customer.`, type: 'success' });
        fetchOrdersList();
      }
    } catch (err) {
      setToast({ message: 'Failed to update order status.', type: 'error' });
    }
  };

  const statusOptions = [
    'PLACED',
    'PAYMENT_CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="bg-ivory border border-gold-300 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian flex items-center gap-2">
            <Package className="w-6 h-6 text-gold-600" /> Admin Order Dispatch Center
          </h1>
          <p className="text-xs text-zinc-500">Update order fulfillment status & trigger real-time customer tracking alerts</p>
        </div>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="bg-white border border-gold-300 text-xs font-bold p-2.5 rounded-xl text-obsidian focus:outline-none"
        >
          <option value="">All Order Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching order dispatch queue..." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gold-300 p-6 rounded-3xl shadow-sm space-y-4">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gold-100 pb-3 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-obsidian">#{order.orderId}</span>
                    <span className="text-xs text-zinc-500 font-medium">Customer: {order.user?.name || 'User'} ({order.user?.email})</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Shipping to: {order.shippingAddress?.city}, {order.shippingAddress?.state} | Date: {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-serif font-bold text-xl text-gold-700">{formatINR(order.totalAmount)}</span>
                  
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Update Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="bg-ivory border border-gold-300 text-xs font-bold p-2 rounded-lg text-obsidian"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="bg-ivory p-3 rounded-xl border border-gold-200 flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-gold-200" />
                    )}
                    <div>
                      <h5 className="font-bold text-obsidian line-clamp-1">{item.name}</h5>
                      <span className="text-[11px] text-zinc-500">Qty: {item.quantity} | {item.metalType} ({item.purity})</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
