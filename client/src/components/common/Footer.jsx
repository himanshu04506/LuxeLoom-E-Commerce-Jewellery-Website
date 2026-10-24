import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Truck, Lock, PhoneCall, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-obsidian text-zinc-300 pt-16 pb-8 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-white font-semibold">100% Certified Purity</h4>
            <p className="text-xs text-zinc-400">BIS Hallmarked Gold & SGL/GIA Certified Diamond Fine Jewellery.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-white font-semibold">Live Transparent Pricing</h4>
            <p className="text-xs text-zinc-400">Real-time market rate dynamic calculation with itemized breakdown.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-white font-semibold">Insured Express Shipping</h4>
            <p className="text-xs text-zinc-400">Free 100% transit-insured delivery across India on orders above ₹10,000.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-white font-semibold">Secure Razorpay Payments</h4>
            <p className="text-xs text-zinc-400">Encrypted checkout supporting Credit Cards, NetBanking, UPI & EMI.</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl tracking-widest text-gold-400 font-bold">LUXELOOM</span>
              <p className="text-[9px] uppercase tracking-widest text-zinc-400 -mt-1">Fine Jewellery</p>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Crafting timeless heirloom gold and silver jewellery. Every piece tells a story of royal craftsmanship and pure elegance.
            </p>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-gold-400" /> +91 1800-LUXELOOM (+91 1800-589-3566)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400" /> support@luxeloom.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" /> LuxeLoom Flagship, Connaught Place, New Delhi
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-gold-400 font-semibold mb-4 uppercase text-xs tracking-widest">Collections</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link to="/catalog?category=Rings" className="hover:text-white transition-colors">Gold & Solitaire Rings</Link></li>
              <li><Link to="/catalog?category=Necklaces" className="hover:text-white transition-colors">Bridal Chokers & Necklaces</Link></li>
              <li><Link to="/catalog?category=Earrings" className="hover:text-white transition-colors">Gold Jhumkas & Studs</Link></li>
              <li><Link to="/catalog?category=Bracelets" className="hover:text-white transition-colors">Diamond & Charm Bracelets</Link></li>
              <li><Link to="/catalog?category=Bangles" className="hover:text-white transition-colors">Traditional 22K Gold Bangles</Link></li>
              <li><Link to="/catalog?category=Chains" className="hover:text-white transition-colors">Italian Rope & Box Chains</Link></li>
              <li><Link to="/catalog?category=Pendants" className="hover:text-white transition-colors">Religious & Gemstone Pendants</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-gold-400 font-semibold mb-4 uppercase text-xs tracking-widest">Customer Support</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link to="/support" className="hover:text-white transition-colors">Concierge & Chat Support</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Raise a Complaint / Ticket</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Order Delivery</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About LuxeLoom</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-gold-400 font-semibold transition-colors">Admin Portal Login</Link></li>
            </ul>
          </div>

          {/* Gold Rate & Certified Seals */}
          <div className="space-y-4">
            <h4 className="font-serif text-gold-400 font-semibold mb-2 uppercase text-xs tracking-widest">Certified Authenticity</h4>
            <p className="text-xs text-zinc-400">All gold rates are synchronized with international bullions. Final invoice includes 3% GST and complete price breakdown.</p>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-xs space-y-2">
              <div className="flex justify-between">
                <span>BIS Hallmarked Gold:</span>
                <span className="text-gold-400 font-bold">22K / 24K</span>
              </div>
              <div className="flex justify-between">
                <span>Sterling Silver:</span>
                <span className="text-gold-400 font-bold">925 Pure</span>
              </div>
              <div className="flex justify-between">
                <span>Return Guarantee:</span>
                <span className="text-emerald-400 font-bold">15 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Payment Icons */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} LuxeLoom Fine Jewellery. All rights reserved. Built with precision.</p>
          <div className="flex items-center gap-3 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
            <span className="bg-zinc-800 px-2 py-1 rounded">Razorpay</span>
            <span className="bg-zinc-800 px-2 py-1 rounded">UPI</span>
            <span className="bg-zinc-800 px-2 py-1 rounded">Visa</span>
            <span className="bg-zinc-800 px-2 py-1 rounded">Mastercard</span>
            <span className="bg-zinc-800 px-2 py-1 rounded">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
