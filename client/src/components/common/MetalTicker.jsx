import React from 'react';
import { useMetalRates } from '../../context/MetalRateContext';
import { TrendingUp, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

const MetalTicker = () => {
  const { rates, lastUpdated, fetchRates } = useMetalRates();

  return (
    <div className="bg-obsidian text-gold-200 text-xs py-2 px-4 border-b border-gold-600/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <div className="flex items-center gap-1.5 font-semibold text-gold-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>LIVE RATES (INR/g):</span>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>Gold 24K: <strong className="text-white">{formatINR(rates.GOLD_24K?.ratePerGram)}</strong></span>
            <span className="text-gold-600">|</span>
            <span>Gold 22K: <strong className="text-white">{formatINR(rates.GOLD_22K?.ratePerGram)}</strong></span>
            <span className="text-gold-600">|</span>
            <span>Gold 18K: <strong className="text-white">{formatINR(rates.GOLD_18K?.ratePerGram)}</strong></span>
            <span className="text-gold-600">|</span>
            <span>Silver 925: <strong className="text-white">{formatINR(rates.SILVER_925?.ratePerGram)}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-zinc-400 whitespace-nowrap">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> BIS Hallmarked 100% Certified
          </span>
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-gold-400" /> Insured Pan-India Express Shipping
          </span>
          <button
            onClick={fetchRates}
            className="hover:text-gold-400 transition-colors flex items-center gap-1 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded"
            title="Refresh Live Metal Rates"
          >
            <RefreshCw className="w-3 h-3" /> Sync
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetalTicker;
