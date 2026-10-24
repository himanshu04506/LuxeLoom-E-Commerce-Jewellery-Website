import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Info, Sparkles, Scale } from 'lucide-react';
import { formatINR, formatGram } from '../../utils/currencyFormatter';
import { useMetalRates } from '../../context/MetalRateContext';
import { calculateClientPricing } from '../../utils/pricingCalculator';
import { useCart } from '../../context/CartContext';
import PriceBreakdownModal from './PriceBreakdownModal';

const ProductCard = ({ product, onShowToast }) => {
  const { rates } = useMetalRates();
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Compute live price
  const pricing = product.dynamicPricing || calculateClientPricing(product, rates);
  const displayPrice = pricing?.finalPrice || 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    const res = await addItem(product._id, 1);
    setIsAdding(false);

    if (onShowToast) {
      if (res.success) {
        onShowToast(`Added "${product.name}" to your cart!`, 'success');
      } else {
        onShowToast(res.message, 'error');
      }
    }
  };

  return (
    <>
      <div className="group relative bg-white border border-gold-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gold-400 transition-all duration-300 flex flex-col h-full">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-obsidian text-gold-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Purity & Metal Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/90 backdrop-blur-md text-obsidian border border-gold-300 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {product.metalType} {product.purity}
          </span>
        </div>

        {/* Product Image */}
        <Link to={`/product/${product._id}`} className="relative block aspect-square overflow-hidden bg-ivory">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-obsidian/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 text-obsidian px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </span>
          </div>
        </Link>

        {/* Card Content */}
        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
          
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium mb-1">
              <span>{product.category}</span>
              <span className="flex items-center gap-1 text-gold-700 font-semibold">
                <Scale className="w-3 h-3 text-gold-500" /> {formatGram(product.weight)}
              </span>
            </div>

            <Link to={`/product/${product._id}`}>
              <h3 className="font-serif text-sm md:text-base font-semibold text-obsidian line-clamp-2 group-hover:text-gold-600 transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Pricing & Actions */}
          <div className="pt-2 border-t border-ivory-dark space-y-2">
            
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-zinc-400 block font-sans">Live Calculated Price</span>
                <span className="text-lg md:text-xl font-bold font-serif text-gold-600">
                  {formatINR(displayPrice)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
                className="text-xs text-zinc-500 hover:text-gold-600 flex items-center gap-1 transition-colors underline decoration-dotted"
                title="View price calculation breakdown"
              >
                <Info className="w-3.5 h-3.5 text-gold-500" /> Breakdown
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock <= 0}
              className={`w-full py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                product.stock <= 0
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'bg-obsidian text-white hover:bg-gold-500 hover:text-white active:scale-[0.98]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {product.stock <= 0 ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
            </button>

          </div>

        </div>
      </div>

      {/* Price Breakdown Modal */}
      {showModal && (
        <PriceBreakdownModal
          product={product}
          pricing={pricing}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
