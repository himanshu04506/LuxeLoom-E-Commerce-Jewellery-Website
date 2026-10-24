import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { useMetalRates } from '../../context/MetalRateContext';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { Sparkles, ShieldCheck, Award, Truck, ArrowRight, TrendingUp, RefreshCw, Star } from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

const Home = () => {
  const { rates } = useMetalRates();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const featuredData = await getProducts({ isFeatured: 'true', limit: 8 });
        const bestSellerData = await getProducts({ isBestSeller: 'true', limit: 8 });

        if (featuredData.success) setFeaturedProducts(featuredData.products);
        if (bestSellerData.success) setBestSellers(bestSellerData.products);
      } catch (err) {
        console.error('Failed to load home products', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const categories = [
    { name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800', count: 'Solitaire & Bands' },
    { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800', count: 'Bridal & Chokers' },
    { name: 'Earrings', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800', count: 'Jhumkas & Studs' },
    { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591475143-4f8a77496773?q=80&w=800', count: 'Tennis & Kadas' },
    { name: 'Bangles', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', count: '22K Gold Pair Sets' },
    { name: 'Chains', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800', count: 'Italian Rope Chains' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Hero Banner Section */}
      <section className="relative bg-obsidian text-white overflow-hidden py-20 lg:py-28 border-b-4 border-gold-500">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/40 text-gold-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-gold-400" />
              Certified Fine Gold & Silver Heritage
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-gold-gradient">
              Timeless Elegance.<br />
              Priced with Live Metal Rates.
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore 100% BIS Hallmarked 24K, 22K, 18K Gold and 925 Sterling Silver jewellery. Every price updates dynamically in real-time based on international market bullions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/catalog"
                className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-widest transition-all transform hover:scale-105"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/catalog?metalType=GOLD"
                className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-gold-300 border border-gold-500/40 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all"
              >
                View 22K Gold Specials
              </Link>
            </div>

            {/* Live Metal Highlight Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="bg-zinc-900/80 border border-gold-500/30 p-3 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase font-bold">Gold 24K Rate</span>
                <span className="text-sm font-bold text-gold-400 font-serif">{formatINR(rates.GOLD_24K?.ratePerGram)}/g</span>
              </div>
              <div className="bg-zinc-900/80 border border-gold-500/30 p-3 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase font-bold">Gold 22K Rate</span>
                <span className="text-sm font-bold text-gold-400 font-serif">{formatINR(rates.GOLD_22K?.ratePerGram)}/g</span>
              </div>
              <div className="bg-zinc-900/80 border border-gold-500/30 p-3 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase font-bold">Gold 18K Rate</span>
                <span className="text-sm font-bold text-gold-400 font-serif">{formatINR(rates.GOLD_18K?.ratePerGram)}/g</span>
              </div>
              <div className="bg-zinc-900/80 border border-gold-500/30 p-3 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase font-bold">Silver 925 Rate</span>
                <span className="text-sm font-bold text-gold-400 font-serif">{formatINR(rates.SILVER_925?.ratePerGram)}/g</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Card */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-400/40">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000"
                alt="Luxury Royal Gold Jewellery Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-gold-300 text-obsidian shadow-xl space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gold-700 font-serif">Maharani Bridal Choker</span>
                  <span className="bg-gold-500 text-white px-2 py-0.5 rounded-full text-[10px]">22K Pure Gold</span>
                </div>
                <p className="text-[11px] text-zinc-600">Calculated via live market rate formula with itemized transparency.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-obsidian">Curated Jewellery Categories</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Handcrafted in 24K, 22K, 18K Gold & Sterling Silver</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/catalog?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-ivory border border-gold-200 shadow-xs hover:shadow-xl hover:border-gold-400 transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-serif font-bold text-base text-gold-300 group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-zinc-300">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Metal Rate Live Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-obsidian to-zinc-900 text-white rounded-3xl p-8 border border-gold-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="w-4 h-4" /> Live Market Ticker
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
                Today's Gold & Silver Bullion Rates
              </h2>
            </div>
            <div className="text-right text-xs text-zinc-400">
              <span>Automatic Live Sync Active</span>
              <p className="text-gold-300 font-semibold text-[11px]">All prices recalculated live on checkout</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-gold-500/40 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gold-300 uppercase tracking-widest font-bold">Gold 24K (Pure 99.9%)</span>
              <div className="text-2xl font-serif font-bold text-white">{formatINR(rates.GOLD_24K?.ratePerGram)} <span className="text-xs text-zinc-400 font-sans">/ gram</span></div>
              <p className="text-[10px] text-zinc-400">Investment grade bullion gold bars & coins.</p>
            </div>

            <div className="bg-zinc-900 border border-gold-500/40 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gold-300 uppercase tracking-widest font-bold">Gold 22K (Hallmark 91.6%)</span>
              <div className="text-2xl font-serif font-bold text-white">{formatINR(rates.GOLD_22K?.ratePerGram)} <span className="text-xs text-zinc-400 font-sans">/ gram</span></div>
              <p className="text-[10px] text-zinc-400">Standard Indian traditional & bridal jewellery.</p>
            </div>

            <div className="bg-zinc-900 border border-gold-500/40 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gold-300 uppercase tracking-widest font-bold">Gold 18K (Ornaments 75.0%)</span>
              <div className="text-2xl font-serif font-bold text-white">{formatINR(rates.GOLD_18K?.ratePerGram)} <span className="text-xs text-zinc-400 font-sans">/ gram</span></div>
              <p className="text-[10px] text-zinc-400">Modern diamond studded & lightweight gold.</p>
            </div>

            <div className="bg-zinc-900 border border-gold-500/40 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gold-300 uppercase tracking-widest font-bold">Silver 925 (Sterling)</span>
              <div className="text-2xl font-serif font-bold text-white">{formatINR(rates.SILVER_925?.ratePerGram)} <span className="text-xs text-zinc-400 font-sans">/ gram</span></div>
              <p className="text-[10px] text-zinc-400">High-polish sterling silver ornaments & bands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gold-200 pb-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-obsidian">Featured Jewellery Collection</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Handpicked for royal elegance and pure brilliance</p>
          </div>
          <Link
            to="/catalog?isFeatured=true"
            className="text-xs font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1 uppercase tracking-widest"
          >
            View All Featured <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching live pricing catalogue..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onShowToast={(msg, type) => setToast({ message: msg, type })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gold-200 pb-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-obsidian">Customer Best Sellers</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Our most loved certified gold & silver creations</p>
          </div>
          <Link
            to="/catalog?isBestSeller=true"
            className="text-xs font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1 uppercase tracking-widest"
          >
            Explore Best Sellers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onShowToast={(msg, type) => setToast({ message: msg, type })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose LuxeLoom Trust Section */}
      <section className="bg-ivory border-y border-gold-300/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-obsidian">Why Choose LuxeLoom Fine Jewellery?</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Purity, Transparency & Security in every shipment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 rounded-2xl border border-gold-200 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-gold-100 text-gold-600 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-obsidian">BIS Hallmarked Purity</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Every gold piece bears the official Government BIS Hallmark laser inscription verifying exact karat purity (999, 916, 750).
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gold-200 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-gold-100 text-gold-600 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-obsidian">Transparent Metal Breakdown</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                No hidden costs. We itemize exact metal weight, live market gold rate, making charges, wastage %, stone charges, and GST.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gold-200 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-gold-100 text-gold-600 mx-auto flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-obsidian">100% Insured Delivery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Shipped in tamper-evident sealed security vaults with real-time GPS map tracking until delivered safely to your hands.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
