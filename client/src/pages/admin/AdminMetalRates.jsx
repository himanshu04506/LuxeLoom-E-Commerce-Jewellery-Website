import React, { useState, useEffect } from 'react';
import { useMetalRates } from '../../context/MetalRateContext';
import { updateAdminMetalRates } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { TrendingUp, RefreshCw, Save, DollarSign, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

const AdminMetalRates = () => {
  const { rates, fetchRates } = useMetalRates();
  const [ratesForm, setRatesForm] = useState({
    GOLD_24K: 7250,
    GOLD_22K: 6645,
    GOLD_18K: 5437,
    SILVER_925: 88,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (rates) {
      setRatesForm({
        GOLD_24K: rates.GOLD_24K?.ratePerGram || 7250,
        GOLD_22K: rates.GOLD_22K?.ratePerGram || 6645,
        GOLD_18K: rates.GOLD_18K?.ratePerGram || 5437,
        SILVER_925: rates.SILVER_925?.ratePerGram || 88,
      });
    }
  }, [rates]);

  const handleSaveRates = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateAdminMetalRates(ratesForm);
      if (res.success) {
        setToast({ message: 'Metal rates updated! All product catalog prices recalculated.', type: 'success' });
        await fetchRates();
      } else {
        setToast({ message: 'Failed to update rates.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Error updating metal rates.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="bg-obsidian text-white p-8 rounded-3xl border border-gold-500/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
          <TrendingUp className="w-4 h-4" /> Bullion Price Governance
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">Metal Rate Override Panel</h1>
        <p className="text-xs text-zinc-300">
          Set live rates per gram in INR. Changing rates immediately updates all product pricing across the store.
        </p>
      </div>

      <form onSubmit={handleSaveRates} className="bg-white border border-gold-300 p-8 rounded-3xl shadow-lg space-y-6 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-ivory border border-gold-200 rounded-2xl space-y-2">
            <label className="font-serif font-bold text-base text-obsidian block">Gold 24K Rate (Pure 99.9%)</label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-500">₹</span>
              <input
                type="number"
                required
                value={ratesForm.GOLD_24K}
                onChange={(e) => setRatesForm({ ...ratesForm, GOLD_24K: Number(e.target.value) })}
                className="w-full p-3 bg-white border border-gold-300 rounded-xl font-serif text-lg font-bold text-gold-700"
              />
              <span className="text-xs text-zinc-500 font-medium">/ gram</span>
            </div>
          </div>

          <div className="p-4 bg-ivory border border-gold-200 rounded-2xl space-y-2">
            <label className="font-serif font-bold text-base text-obsidian block">Gold 22K Rate (Hallmark 91.6%)</label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-500">₹</span>
              <input
                type="number"
                required
                value={ratesForm.GOLD_22K}
                onChange={(e) => setRatesForm({ ...ratesForm, GOLD_22K: Number(e.target.value) })}
                className="w-full p-3 bg-white border border-gold-300 rounded-xl font-serif text-lg font-bold text-gold-700"
              />
              <span className="text-xs text-zinc-500 font-medium">/ gram</span>
            </div>
          </div>

          <div className="p-4 bg-ivory border border-gold-200 rounded-2xl space-y-2">
            <label className="font-serif font-bold text-base text-obsidian block">Gold 18K Rate (Ornaments 75.0%)</label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-500">₹</span>
              <input
                type="number"
                required
                value={ratesForm.GOLD_18K}
                onChange={(e) => setRatesForm({ ...ratesForm, GOLD_18K: Number(e.target.value) })}
                className="w-full p-3 bg-white border border-gold-300 rounded-xl font-serif text-lg font-bold text-gold-700"
              />
              <span className="text-xs text-zinc-500 font-medium">/ gram</span>
            </div>
          </div>

          <div className="p-4 bg-ivory border border-gold-200 rounded-2xl space-y-2">
            <label className="font-serif font-bold text-base text-obsidian block">Silver 925 Rate (Sterling)</label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-500">₹</span>
              <input
                type="number"
                required
                value={ratesForm.SILVER_925}
                onChange={(e) => setRatesForm({ ...ratesForm, SILVER_925: Number(e.target.value) })}
                className="w-full p-3 bg-white border border-gold-300 rounded-xl font-serif text-lg font-bold text-gold-700"
              />
              <span className="text-xs text-zinc-500 font-medium">/ gram</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-obsidian text-white hover:bg-gold-500 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Save className="w-4 h-4 text-gold-400" /> {loading ? 'Saving Rates...' : 'Apply Live Metal Rate Changes'}
        </button>

      </form>
    </div>
  );
};

export default AdminMetalRates;
