import React from 'react';
import { Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

const DynamicPriceBadge = ({ ratePerGram, metalType, purity }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-50 to-amber-50 border border-gold-300 px-3 py-1.5 rounded-full text-xs text-gold-900 font-medium shadow-xs">
      <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
      <span>
        Calculated using today's <strong>{metalType} ({purity})</strong> rate:{' '}
        <strong className="text-gold-700">{formatINR(ratePerGram)}/g</strong>
      </span>
    </div>
  );
};

export default DynamicPriceBadge;
