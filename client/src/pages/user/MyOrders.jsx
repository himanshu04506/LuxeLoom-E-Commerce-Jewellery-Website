import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../../services/orderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Package, Truck, ExternalLink, ShieldCheck } from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrders();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gold-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-obsidian flex items-center gap-2">
          <Package className="w-8 h-8 text-gold-600" /> My Orders & Purchase History
        </h1>
        <p className="text-xs text-zinc-500">Track delivery status & view itemized metal rate invoices</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your jewellery purchase history..." />
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gold-300 p-6 rounded-3xl shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold-100 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-obsidian">#{order.orderId}</span>
                    <span className="bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {order.orderStatus}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-xl text-gold-700">{formatINR(order.totalAmount)}</span>
                  <Link
                    to={`/order-tracking/${order.orderId}`}
                    className="bg-obsidian text-gold-400 hover:bg-gold-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <Truck className="w-4 h-4" /> Live Map <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="bg-ivory border border-gold-200 p-3 rounded-xl flex items-center gap-3 text-xs">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gold-200 shrink-0" />
                    )}
                    <div className="flex-1 truncate">
                      <h5 className="font-serif font-bold text-obsidian truncate">{item.name}</h5>
                      <p className="text-zinc-500 text-[11px]">
                        {item.metalType} {item.purity} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gold-200 p-16 rounded-3xl text-center space-y-4">
          <Package className="w-16 h-16 text-gold-300 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-obsidian">No Orders Placed Yet</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Discover our certified 24K, 22K, 18K Gold and 925 Silver jewellery collections.
          </p>
          <Link
            to="/catalog"
            className="inline-block bg-obsidian text-gold-400 font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-white transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
