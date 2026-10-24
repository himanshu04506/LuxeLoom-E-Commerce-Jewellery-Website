import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Shield, Package, Users, DollarSign, ShieldAlert, AlertTriangle, TrendingUp, RefreshCw, ChevronRight } from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Administrator Analytics Center..." />;
  if (!data) return <div className="text-center py-20 text-sm text-zinc-500">Failed to load admin data.</div>;

  const { stats, recentOrders } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-obsidian text-white p-8 rounded-3xl border border-gold-500/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <Shield className="w-4 h-4" /> LuxeLoom Administrator Control Portal
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Executive Analytics & Management</h1>
          <p className="text-xs text-zinc-300">Live operational overview of sales, inventory stock, order dispatches & metal rates.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link to="/admin/products" className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-xl transition-colors">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="bg-zinc-800 hover:bg-zinc-700 text-gold-300 border border-gold-500/30 px-4 py-2 rounded-xl transition-colors">
            Manage Orders
          </Link>
          <Link to="/admin/metal-rates" className="bg-zinc-800 hover:bg-zinc-700 text-gold-300 border border-gold-500/30 px-4 py-2 rounded-xl transition-colors">
            Update Metal Rates
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-gold-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-gold-600">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total Sales</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif font-bold text-obsidian">{formatINR(stats.totalSales)}</div>
          <p className="text-[10px] text-zinc-400">Confirmed paid revenue</p>
        </div>

        <div className="bg-white border border-gold-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-gold-600">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pending Orders</span>
            <Package className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif font-bold text-obsidian">{stats.pendingOrders}</div>
          <p className="text-[10px] text-amber-600 font-semibold">Requires packing & dispatch</p>
        </div>

        <div className="bg-white border border-gold-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-gold-600">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Registered Users</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif font-bold text-obsidian">{stats.totalUsers}</div>
          <p className="text-[10px] text-zinc-400">Active customer accounts</p>
        </div>

        <div className="bg-white border border-gold-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-gold-600">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Open Complaints</span>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-rose-600">{stats.openComplaints}</div>
          <p className="text-[10px] text-zinc-400">Active support tickets</p>
        </div>

      </div>

      {/* Live Rates & Recent Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-gold-300 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gold-100 pb-3">
            <h3 className="font-serif font-bold text-lg text-obsidian">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-gold-700 hover:underline flex items-center gap-1">
              View All Orders <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="bg-ivory text-zinc-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gold-50/50">
                    <td className="p-3 font-serif font-bold text-obsidian">#{o.orderId}</td>
                    <td className="p-3">{o.user?.name || 'Customer'}</td>
                    <td className="p-3 font-bold text-gold-700">{formatINR(o.totalAmount)}</td>
                    <td className="p-3">
                      <span className="bg-gold-100 text-gold-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                          o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Rates Overview Card */}
        <div className="bg-obsidian text-white border border-gold-500/40 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-lg text-gold-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Live Metal Bullion Rates
            </h3>
            <Link to="/admin/metal-rates" className="text-xs font-bold text-gold-300 hover:underline">
              Edit Rates
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <span>Gold 24K Rate:</span>
              <strong className="text-gold-400 font-serif">{formatINR(stats.rates.GOLD_24K?.ratePerGram)}/g</strong>
            </div>
            <div className="flex justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <span>Gold 22K Rate:</span>
              <strong className="text-gold-400 font-serif">{formatINR(stats.rates.GOLD_22K?.ratePerGram)}/g</strong>
            </div>
            <div className="flex justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <span>Gold 18K Rate:</span>
              <strong className="text-gold-400 font-serif">{formatINR(stats.rates.GOLD_18K?.ratePerGram)}/g</strong>
            </div>
            <div className="flex justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <span>Silver 925 Rate:</span>
              <strong className="text-gold-400 font-serif">{formatINR(stats.rates.SILVER_925?.ratePerGram)}/g</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
