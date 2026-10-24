import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle2, Package, MapPin, Truck, Mail, FileText, ArrowRight } from 'lucide-react';
import { formatINR, formatGram } from '../../utils/currencyFormatter';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error fetching order', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner text="Generating order confirmation invoice..." />;
  if (!order) return <div className="text-center py-20 text-sm text-zinc-500">Order confirmation details not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Banner */}
      <div className="bg-emerald-950 text-emerald-100 border border-emerald-800 p-8 rounded-3xl text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold text-white">Order Confirmed & Paid!</h1>
          <p className="text-xs text-emerald-300">Order Reference: <strong>#{order.orderId}</strong> | Payment Verified via Razorpay</p>
        </div>
        <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
          An automated order confirmation email with your tax invoice has been sent to your registered email address.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            to={`/order-tracking/${order.orderId}`}
            className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Truck className="w-4 h-4" /> Track Insured Delivery Map <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/orders"
            className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 px-6 py-2.5 rounded-xl text-xs font-semibold"
          >
            View Order History
          </Link>
        </div>
      </div>

      {/* Tax Invoice Breakdown Card */}
      <div className="bg-white border border-gold-300 p-8 rounded-3xl shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold-200 pb-4 gap-2">
          <div>
            <h2 className="font-serif font-bold text-xl text-obsidian">Tax Invoice & Order Snapshot</h2>
            <p className="text-xs text-zinc-500">Issued on {new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 block font-mono">Payment ID</span>
            <span className="font-bold text-xs text-obsidian font-mono">{order.razorpayPaymentId || 'PAID_CONFIRMED'}</span>
          </div>
        </div>

        {/* Shipping Location */}
        <div className="bg-ivory p-4 rounded-xl border border-gold-200 text-xs space-y-1">
          <strong className="text-obsidian font-serif text-sm block">Shipping Address:</strong>
          <p className="text-zinc-700">
            {order.shippingAddress?.fullName} | {order.shippingAddress?.phone}<br />
            {order.shippingAddress?.house}, {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </p>
        </div>

        {/* Item List */}
        <div className="space-y-3 divide-y divide-zinc-100 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gold-200" />
                )}
                <div>
                  <h4 className="font-serif font-bold text-obsidian">{item.name}</h4>
                  <p className="text-zinc-500 text-[11px]">
                    {item.metalType} ({item.purity}) | Weight: {formatGram(item.weight)} | Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-serif font-bold text-gold-700 text-sm">
                {formatINR(item.totalItemPrice)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="bg-ivory p-5 rounded-2xl border border-gold-200 space-y-2 text-xs text-zinc-700">
          <div className="flex justify-between">
            <span>Subtotal (Metal + Charges):</span>
            <span className="font-semibold text-obsidian">{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (3% Govt Tax):</span>
            <span className="font-semibold text-obsidian">+{formatINR(order.gst)}</span>
          </div>
          <div className="flex justify-between">
            <span>Insured Delivery:</span>
            <span className="font-semibold text-emerald-600">
              {order.deliveryCharges === 0 ? 'FREE' : formatINR(order.deliveryCharges)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold font-serif text-obsidian pt-2 border-t border-gold-200">
            <span>Grand Total Paid:</span>
            <span className="text-gold-600 text-xl">{formatINR(order.totalAmount)}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrderConfirmation;
