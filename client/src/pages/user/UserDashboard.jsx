import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../services/orderService';
import { getTickets } from '../../services/supportService';
import { Package, MapPin, Headset, User, ShieldCheck, ChevronRight, Clock } from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const orderData = await getUserOrders();
        const ticketData = await getTickets();
        if (orderData.success) setOrders(orderData.orders);
        if (ticketData.success) setTickets(ticketData.tickets);
      } catch (err) {
        console.error('Error loading dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Card */}
      <div className="bg-obsidian text-white p-8 rounded-3xl border border-gold-500/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-gold-400" /> LuxeLoom Member Account
          </div>
          <h1 className="font-serif text-3xl font-bold text-gold-400">Welcome, {user?.name}!</h1>
          <p className="text-xs text-zinc-300">
            {user?.email} | Registered Member
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/orders"
            className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Package className="w-4 h-4" /> My Orders ({orders.length})
          </Link>
          <Link
            to="/addresses"
            className="bg-zinc-800 hover:bg-zinc-700 text-gold-300 border border-gold-500/30 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <MapPin className="w-4 h-4" /> Addresses
          </Link>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gold-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-gold-100 pb-3">
            <h3 className="font-serif font-bold text-lg text-obsidian flex items-center gap-2">
              <Package className="w-5 h-5 text-gold-600" /> Recent Jewellery Orders
            </h3>
            <Link to="/orders" className="text-xs font-bold text-gold-700 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="p-4 bg-ivory border border-gold-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-obsidian">#{order.orderId}</span>
                      <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {order.items.length} items | Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                    <span className="font-serif font-bold text-gold-700 text-base">{formatINR(order.totalAmount)}</span>
                    <Link
                      to={`/order-tracking/${order.orderId}`}
                      className="text-xs text-obsidian hover:text-gold-600 font-bold underline decoration-dotted"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-zinc-500">No orders placed yet.</div>
          )}
        </div>

        {/* Support Tickets */}
        <div className="bg-white border border-gold-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-gold-100 pb-3">
            <h3 className="font-serif font-bold text-lg text-obsidian flex items-center gap-2">
              <Headset className="w-5 h-5 text-gold-600" /> Support Tickets
            </h3>
            <Link to="/support" className="text-xs font-bold text-gold-700 hover:underline">
              Open Portal
            </Link>
          </div>

          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.slice(0, 3).map((t) => (
                <div key={t._id} className="p-3 bg-ivory border border-gold-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-obsidian">
                    <span>#{t.ticketId}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{t.status}</span>
                  </div>
                  <p className="text-zinc-600 font-medium">{t.category}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-zinc-500">No active support tickets.</div>
          )}
        </div>

      </div>

    </div>
  );
};

export default UserDashboard;
