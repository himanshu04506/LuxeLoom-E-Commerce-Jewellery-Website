import React from 'react';
import { ShieldCheck, Award, Sparkles, HeartHandshake } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-gold-600" /> LuxeLoom Heritage
        </div>
        <h1 className="font-serif text-4xl font-bold text-obsidian">Crafting Timeless Luxury & Transparent Pricing</h1>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Founded on principles of absolute gold purity, royal Indian heritage craftsmanship, and transparent live bullion market rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000"
          alt="LuxeLoom Craftsmanship"
          className="rounded-3xl shadow-2xl border-2 border-gold-300 object-cover aspect-video"
        />
        <div className="space-y-4 text-xs leading-relaxed text-zinc-600">
          <h2 className="font-serif text-2xl font-bold text-obsidian">The LuxeLoom Promise</h2>
          <p>
            Traditional jewellery pricing is often opaque, adding arbitrary markups and unaccounted wastage. At LuxeLoom, we pioneered India’s first algorithmically transparent jewellery pricing system.
          </p>
          <p>
            Every ring, necklace, and bangle in our catalog is linked directly to international live gold and silver rates. When market rates fluctuate, our prices update dynamically so you pay only the true value of pure metal plus fair crafting charges.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="bg-ivory border border-gold-200 p-4 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-gold-600 mb-1" />
              <strong className="block text-obsidian font-serif text-sm">100% Hallmarked</strong>
              <span>Government BIS certified purity</span>
            </div>
            <div className="bg-ivory border border-gold-200 p-4 rounded-xl">
              <Award className="w-6 h-6 text-gold-600 mb-1" />
              <strong className="block text-obsidian font-serif text-sm">SGL & GIA Certified</strong>
              <span>Natural VVS/EF lab verified diamonds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
