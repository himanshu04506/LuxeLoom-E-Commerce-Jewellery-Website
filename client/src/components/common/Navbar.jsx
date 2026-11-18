import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingBag, User, Menu, X, Shield, Headset, LogOut, Package, MapPin, Heart, ChevronDown } from 'lucide-react';
import MetalTicker from './MetalTicker';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync navbar search input with URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearchQuery(searchParam);
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const currentParams = new URLSearchParams(location.pathname === '/catalog' ? location.search : '');
    if (query) {
      currentParams.set('search', query);
    } else {
      currentParams.delete('search');
    }
    navigate(`/catalog?${currentParams.toString()}`);
    setIsMobileMenuOpen(false);
  };

  const categories = [
    { name: 'Necklaces', path: '/catalog?category=Necklaces' },
    { name: 'Rings', path: '/catalog?category=Rings' },
    { name: 'Chains', path: '/catalog?category=Chains' },
    { name: 'Earrings', path: '/catalog?category=Earrings' },
    { name: 'Bracelets', path: '/catalog?category=Bracelets' },
    { name: 'Bangles', path: '/catalog?category=Bangles' },
    { name: 'Mangalsutra', path: '/catalog?category=Mangalsutra' },
    { name: 'Traditional Gifts', path: '/catalog?category=Traditional Gifts' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ivory-dark shadow-sm">
      <MetalTicker />

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-obsidian p-2 rounded-md hover:bg-ivory"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex flex-col items-center group">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.2em] font-bold text-obsidian group-hover:text-gold-500 transition-colors">
              LUXELOOM
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-medium -mt-1">
              FINE JEWELLERY
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search gold rings, diamond necklaces, 925 silver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-16 py-2 text-sm bg-ivory border border-gold-200 rounded-full focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    if (location.pathname === '/catalog') {
                      const currentParams = new URLSearchParams(location.search);
                      currentParams.delete('search');
                      navigate(`/catalog?${currentParams.toString()}`);
                    }
                  }}
                  className="text-zinc-400 hover:text-zinc-700 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="text-gold-600 hover:text-gold-800"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Icons & User Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Support Link */}
            <Link
              to="/support"
              className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-gold-600 font-medium transition-colors"
            >
              <Headset className="w-4 h-4 text-gold-500" />
              <span>Concierge</span>
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-obsidian hover:text-gold-600 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cart.totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-gold-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {cart.totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 py-1.5 px-2.5 sm:px-3 rounded-full hover:bg-gold-50/80 transition-all border border-gold-300 shadow-xs group"
                    title="Account & Profile"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-500 text-white font-serif font-bold flex items-center justify-center text-sm shadow group-hover:scale-105 transition-transform">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-semibold leading-none">Account</span>
                      <span className="text-xs font-bold text-obsidian leading-tight max-w-[95px] truncate">
                        {user.name ? user.name.split(' ')[0] : 'Profile'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden sm:block group-hover:text-gold-600 transition-colors" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                      className="absolute right-0 mt-2 w-64 bg-white border border-gold-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="px-4 py-3 border-b border-zinc-100 bg-gradient-to-br from-ivory to-white rounded-t-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold-500 text-white font-serif font-bold flex items-center justify-center text-base shadow">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-obsidian truncate">{user.name || 'Member'}</p>
                            <p className="text-xs text-zinc-500 truncate">{user.email || ''}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-gold-100 text-gold-800 border border-gold-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED MEMBER'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-800 hover:bg-gold-50 hover:text-gold-800 font-semibold transition-colors"
                        >
                          <User className="w-4 h-4 text-gold-600" /> My Profile
                        </Link>

                        {isAdmin ? (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gold-700 font-semibold hover:bg-gold-50"
                          >
                            <Shield className="w-4 h-4" /> Admin Control Center
                          </Link>
                        ) : (
                          <Link
                            to="/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-ivory"
                          >
                            <Shield className="w-4 h-4 text-gold-600" /> User Dashboard
                          </Link>
                        )}

                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-ivory"
                        >
                          <Package className="w-4 h-4 text-gold-600" /> My Orders
                        </Link>

                        <Link
                          to="/addresses"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-ivory"
                        >
                          <MapPin className="w-4 h-4 text-gold-600" /> Saved Addresses
                        </Link>
                      </div>

                      <div className="border-t border-zinc-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                        >
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-obsidian hover:text-gold-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-semibold bg-gold-500 text-white hover:bg-gold-600 px-4 py-1.5 rounded-full shadow-sm transition-all transform hover:scale-105"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-6 py-2.5 border-t border-ivory-dark text-xs uppercase tracking-widest font-medium text-zinc-700 overflow-x-auto no-scrollbar">
          <Link
            to="/"
            className={`transition-colors font-bold ${location.pathname === '/' ? 'text-gold-600 border-b-2 border-gold-500 pb-0.5' : 'hover:text-gold-600'}`}
          >
            Home
          </Link>
          <Link
            to="/catalog"
            className={`transition-colors font-bold ${location.pathname === '/catalog' && !location.search ? 'text-gold-600 border-b-2 border-gold-500 pb-0.5' : 'text-gold-700 hover:text-gold-900'}`}
          >
            All Jewellery
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className={`hover:text-gold-600 transition-colors ${location.search.includes(encodeURIComponent(cat.name)) ? 'text-gold-600 font-bold border-b-2 border-gold-500 pb-0.5' : ''}`}
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/about" className="hover:text-gold-600 transition-colors">
            About LuxeLoom
          </Link>
          <Link to="/contact" className="hover:text-gold-600 transition-colors">
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gold-200 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          {/* Mobile User Profile Section */}
          <div className="pt-1 pb-3 border-b border-gold-200">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-ivory rounded-2xl border border-gold-200">
                  <div className="w-10 h-10 rounded-full bg-gold-500 text-white font-serif font-bold flex items-center justify-center text-sm shadow">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-obsidian truncate">{user.name || 'Member'}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email || ''}</p>
                    <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-gold-100 text-gold-800 border border-gold-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED MEMBER'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 bg-white border border-gold-300 text-gold-900 rounded-xl hover:bg-gold-50 font-bold shadow-xs"
                  >
                    <User className="w-4 h-4 text-gold-600" /> My Profile
                  </Link>
                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 bg-white border border-gold-200 text-obsidian rounded-xl hover:bg-gold-50"
                  >
                    <Shield className="w-4 h-4 text-gold-600" /> Dashboard
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 bg-white border border-gold-200 text-obsidian rounded-xl hover:bg-gold-50"
                  >
                    <Package className="w-4 h-4 text-gold-600" /> My Orders
                  </Link>
                  <Link
                    to="/addresses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 bg-white border border-gold-200 text-obsidian rounded-xl hover:bg-gold-50"
                  >
                    <MapPin className="w-4 h-4 text-gold-600" /> Addresses
                  </Link>
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold border border-gold-300 text-obsidian rounded-xl hover:bg-gold-50"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold bg-gold-500 text-white rounded-xl shadow-sm hover:bg-gold-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <form onSubmit={handleSearch} className="relative mt-2">
            <input
              type="text"
              placeholder="Search jewellery catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-16 py-2 text-sm bg-ivory border border-gold-300 rounded-full focus:outline-none focus:border-gold-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    if (location.pathname === '/catalog') {
                      const currentParams = new URLSearchParams(location.search);
                      currentParams.delete('search');
                      navigate(`/catalog?${currentParams.toString()}`);
                    }
                  }}
                  className="text-zinc-400 hover:text-zinc-700 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button type="submit" className="text-gold-600">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Navigation</p>
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-bold text-gold-700"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-zinc-800 hover:text-gold-600"
            >
              All Jewellery
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm text-zinc-700 hover:text-gold-600"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 flex justify-around text-xs font-medium text-zinc-600">
            <Link to="/support" onClick={() => setIsMobileMenuOpen(false)}>Customer Support</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
