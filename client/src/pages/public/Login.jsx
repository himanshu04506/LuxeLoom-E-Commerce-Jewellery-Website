import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, KeyRound, ShieldCheck, Sparkles, User, Shield } from 'lucide-react';
import Toast from '../../components/common/Toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: 'Please enter both email and password.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });
      if (res.success) {
        if (res.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setToast({ message: res.message || 'Invalid credentials.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Login failed. Please check credentials.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUserLogin = () => {
    setEmail('user@luxeloom.com');
    setPassword('user123');
  };

  const handleDemoAdminLogin = () => {
    setEmail('admin@luxeloom.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />

      <div className="max-w-md w-full bg-white border border-gold-300 rounded-3xl p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-bold tracking-widest text-obsidian">LUXELOOM</span>
            <p className="text-[9px] uppercase tracking-widest text-gold-600 font-bold -mt-1">Fine Jewellery</p>
          </Link>
          <h2 className="font-serif text-xl font-bold text-obsidian">Sign In to Your Account</h2>
          <p className="text-xs text-zinc-500">Access saved shipping addresses, order tracking, and custom wishlist</p>
        </div>

        {/* Preset Quick Demo Login Buttons */}
        <div className="bg-ivory border border-gold-200 p-3 rounded-2xl space-y-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-800 block text-center">
            One-Click Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoUserLogin}
              className="py-2 px-3 bg-white border border-gold-300 hover:bg-gold-50 text-obsidian rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-gold-600" /> Customer Account
            </button>
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="py-2 px-3 bg-obsidian hover:bg-gold-500 text-gold-300 hover:text-white rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Control
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-700 block mb-1">Email or Phone Number</label>
            <input
              type="text"
              required
              placeholder="user@luxeloom.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500 text-xs"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-zinc-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-gold-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-obsidian text-white hover:bg-gold-500 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <LogIn className="w-4 h-4" /> {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 pt-2 border-t border-gold-100">
          Don't have a LuxeLoom account?{' '}
          <Link to="/register" className="font-bold text-gold-700 hover:underline">
            Register New Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
