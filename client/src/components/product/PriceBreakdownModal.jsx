import React from 'react';
import { X, Calculator, ShieldCheck, RefreshCw } from 'lucide-react';
import { formatINR, formatGram } from '../../utils/currencyFormatter';

const PriceBreakdownModal = ({ product, pricing, onClose }) => {
  if (!product || !pricing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gold-300 relative space-y-5 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gold-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-obsidian">Live Price Breakdown</h3>
              <p className="text-xs text-zinc-500">{product.name} ({product.metalType} {product.purity})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Market Banner */}
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-3 text-xs text-gold-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-gold-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Today's Metal Market Rate:</span>
          </div>
          <strong className="text-sm font-serif font-bold text-gold-700">
            {formatINR(pricing.ratePerGram)} / gram
          </strong>
        </div>

        {/* Itemized Calculation List */}
        <div className="space-y-2.5 text-xs text-zinc-700 divide-y divide-zinc-100">
          
          <div className="flex justify-between items-center pt-2">
            <span>Product Net Weight:</span>
            <span className="font-semibold text-obsidian">{formatGram(pricing.weight)}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span>Base Metal Price ({formatGram(pricing.weight)} × {formatINR(pricing.ratePerGram)}/g):</span>
            <span className="font-semibold text-obsidian">{formatINR(pricing.baseMetalPrice)}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span>Wastage Charges ({pricing.wastagePercentage}% of metal price):</span>
            <span className="font-semibold text-obsidian">+{formatINR(pricing.wastageCharges)}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span>Crafting & Making Charges:</span>
            <span className="font-semibold text-obsidian">+{formatINR(pricing.makingCharges)}</span>
          </div>

          {pricing.stoneCharges > 0 && (
            <div className="flex justify-between items-center pt-2">
              <span>Certified Gemstone & Diamond Charges:</span>
              <span className="font-semibold text-obsidian">+{formatINR(pricing.stoneCharges)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 font-semibold text-obsidian">
            <span>Subtotal (Before Tax):</span>
            <span>{formatINR(pricing.subtotal)}</span>
          </div>

          <div className="flex justify-between items-center pt-2 text-zinc-600">
            <span>GST ({pricing.gstPercentage}% Government Tax):</span>
            <span className="font-semibold text-obsidian">+{formatINR(pricing.gst)}</span>
          </div>

        </div>

        {/* Final Price Total */}
        <div className="bg-obsidian text-white p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gold-300 uppercase tracking-widest block font-medium">Final Dynamic Price</span>
            <span className="text-2xl font-serif font-bold text-gold-400">
              {formatINR(pricing.finalPrice)}
            </span>
          </div>
          <div className="text-right text-[10px] text-zinc-400 flex flex-col items-end gap-1">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> BIS Hallmarked
            </span>
            <span>Includes Insured Transit</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-ivory border border-gold-300 hover:bg-gold-50 text-obsidian font-semibold rounded-lg text-xs transition-colors"
        >
          Close Calculation Breakdown
        </button>

      </div>
    </div>
  );
};

export default PriceBreakdownModal;
