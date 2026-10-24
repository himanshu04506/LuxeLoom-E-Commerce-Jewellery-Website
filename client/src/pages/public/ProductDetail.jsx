import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import PriceBreakdownModal from '../../components/product/PriceBreakdownModal';
import DynamicPriceBadge from '../../components/product/DynamicPriceBadge';
import { formatINR, formatGram } from '../../utils/currencyFormatter';
import { ShoppingBag, ShieldCheck, Info, Sparkles, Truck, RefreshCw, ChevronRight, Check } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        if (data.success) {
          setProduct(data.product);
          if (data.product.images && data.product.images.length > 0) {
            setSelectedImage(data.product.images[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading certified product details & live pricing..." />;
  if (!product) return <div className="text-center py-20 text-sm text-zinc-500">Product not found.</div>;

  const pricing = product.dynamicPricing;

  const handleAddToCart = async () => {
    setIsAdding(true);
    const res = await addItem(product._id, quantity);
    setIsAdding(false);

    if (res.success) {
      setToast({ message: `Added ${quantity} × "${product.name}" to cart!`, type: 'success' });
    } else {
      setToast({ message: res.message, type: 'error' });
    }
  };

  const handleBuyNow = async () => {
    const res = await addItem(product._id, quantity);
    if (res.success) {
      navigate('/checkout');
    } else {
      setToast({ message: res.message, type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <button onClick={() => navigate('/')} className="hover:text-gold-600">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => navigate('/catalog')} className="hover:text-gold-600">Catalog</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-obsidian font-semibold truncate">{product.name}</span>
      </div>

      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Gallery View */}
        <div className="space-y-4">
          <div className="aspect-square bg-ivory rounded-2xl overflow-hidden border border-gold-300 shadow-lg relative">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-obsidian border border-gold-300">
              {product.metalType} {product.purity}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-gold-500 scale-105 shadow-md' : 'border-gold-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Pricing Card */}
        <div className="space-y-6">
          
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest block mb-1">
              SKU: {product.sku} | {product.category}
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-obsidian">
              {product.name}
            </h1>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Dynamic Live Price Callout */}
          <div className="bg-ivory border border-gold-300 p-5 rounded-2xl space-y-3">
            <DynamicPriceBadge
              ratePerGram={pricing?.ratePerGram}
              metalType={product.metalType}
              purity={product.purity}
            />

            <div className="flex items-baseline justify-between pt-2">
              <div>
                <span className="text-xs text-zinc-500 block">Calculated Dynamic Total</span>
                <span className="text-3xl font-serif font-bold text-gold-600">
                  {formatINR(pricing?.finalPrice)}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Includes 3% GST & Insured Express Delivery</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="text-xs font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-gold-300 shadow-xs"
              >
                <Info className="w-4 h-4 text-gold-500" /> View Breakdown
              </button>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-xl border border-gold-200">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Net Weight</span>
              <strong className="text-obsidian">{formatGram(product.weight)}</strong>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Making Charges</span>
              <strong className="text-obsidian">{formatINR(product.makingCharges)}</strong>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Wastage %</span>
              <strong className="text-obsidian">{product.wastagePercentage}%</strong>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Stone Charges</span>
              <strong className="text-obsidian">{formatINR(product.stoneCharges)}</strong>
            </div>
          </div>

          {/* Quantity Selector & Purchase Action */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-obsidian uppercase tracking-wider">Quantity:</label>
              <div className="flex items-center border border-gold-300 rounded-lg bg-ivory overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-obsidian font-bold hover:bg-gold-200"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-bold text-xs">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 text-obsidian font-bold hover:bg-gold-200"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units remaining)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock <= 0}
                className="w-full bg-obsidian text-white hover:bg-gold-500 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full bg-gold-500 text-white hover:bg-gold-600 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="border-t border-gold-200 pt-6 grid grid-cols-2 gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
              <span>BIS Hallmarked & 100% Certified Purity</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-gold-500 shrink-0" />
              <span>Insured Pan-India Express Delivery</span>
            </div>
          </div>

        </div>

      </div>

      {/* Modal Price Breakdown */}
      {showModal && (
        <PriceBreakdownModal
          product={product}
          pricing={pricing}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
};

export default ProductDetail;
