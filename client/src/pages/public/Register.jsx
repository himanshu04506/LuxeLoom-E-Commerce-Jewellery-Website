import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, ShieldCheck } from 'lucide-react';
import Toast from '../../components/common/Toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setToast({ message: 'Passwords do not match.', type: 'error' });
      return;
    }
    if (formData.password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (res.success) {
        navigate('/dashboard');
      } else {
        setToast({ message: res.message || 'Registration failed.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create account.', type: 'error' });
    } finally {
      setLoading(false);
    }
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
          <h2 className="font-serif text-xl font-bold text-obsidian">Create Your Member Account</h2>
          <p className="text-xs text-zinc-500">Join LuxeLoom for exclusive gold rate alerts & insured shipping</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-zinc-700 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="ananya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Confirm Password *</label>
            <input
              type="password"
              required
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-obsidian text-white hover:bg-gold-500 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4" /> {loading ? 'Creating Account...' : 'Register Member Account'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 pt-2 border-t border-gold-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-gold-700 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
