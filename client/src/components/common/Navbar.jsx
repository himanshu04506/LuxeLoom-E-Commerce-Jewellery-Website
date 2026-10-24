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
    { name: 'Rings', path: '/catalog?category=Rings' },
    { name: 'Necklaces', path: '/catalog?category=Necklaces' },
    { name: 'Earrings', path: '/catalog?category=Earrings' },
    { name: 'Bracelets', path: '/catalog?category=Bracelets' },
    { name: 'Bangles', path: '/catalog?category=Bangles' },
    { name: 'Chains', path: '/catalog?category=Chains' },
    { name: 'Pendants', path: '/catalog?category=Pendants' },
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
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-ivory transition-colors border border-gold-300/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-500 text-white font-serif font-bold flex items-center justify-center text-sm shadow">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-4 h-4 text-zinc-500 hidden sm:block" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white border border-gold-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="px-4 py-2 border-b border-zinc-100">
                        <p className="text-sm font-semibold text-obsidian">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[10px] font-bold bg-gold-100 text-gold-700 px-2 py-0.5 rounded">
                            ADMINISTRATOR
                          </span>
                        )}
                      </div>

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
                          <User className="w-4 h-4 text-gold-600" /> User Dashboard
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

                      <div className="border-t border-zinc-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
        <nav className="hidden md:flex items-center justify-center gap-8 py-2.5 border-t border-ivory-dark text-xs uppercase tracking-widest font-medium text-zinc-700">
          <Link to="/catalog" className="hover:text-gold-600 transition-colors font-bold text-gold-700">
            All Jewellery
          </Link>
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.path} className="hover:text-gold-600 transition-colors">
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Categories</p>
            <Link
              to="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-gold-700"
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
