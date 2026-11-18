import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/authService';
import { User, Lock, Save, ShieldCheck, Package, MapPin, LayoutDashboard, Mail, Phone, Calendar } from 'lucide-react';
import Toast from '../../components/common/Toast';

const Profile = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Sync state with user data whenever user changes or loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateProfile({ name, phone, password: password || undefined });
      if (res.success) {
        setToast({ message: 'Profile updated successfully!', type: 'success' });
        setPassword('');
        if (updateUser && res.user) {
          updateUser(res.user);
        }
      } else {
        setToast({ message: res.message || 'Failed to update profile.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Error updating profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Member Profile Overview Banner */}
      <div className="bg-obsidian text-white p-6 sm:p-8 rounded-3xl border border-gold-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 text-white font-serif font-bold text-3xl sm:text-4xl flex items-center justify-center shadow-xl border-2 border-gold-300">
            {initial}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-500/20 text-gold-300 border border-gold-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              {isAdmin ? 'Administrator Account' : 'Verified LuxeLoom Member'}
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">
              {user?.name || 'Member Profile'}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-300 pt-1">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-gold-400" /> {user?.email || 'No email registered'}
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Phone className="w-3.5 h-3.5 text-gold-400" /> {user?.phone || '+91 9876543210'}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <Link
              to="/orders"
              className="flex-1 sm:flex-none text-center bg-gold-500 hover:bg-gold-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <Package className="w-3.5 h-3.5" /> My Orders
            </Link>
            <Link
              to="/dashboard"
              className="flex-1 sm:flex-none text-center bg-zinc-800 hover:bg-zinc-700 text-gold-300 border border-gold-500/30 font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800 text-xs overflow-x-auto no-scrollbar">
          <Link
            to="/profile"
            className="px-3 py-1.5 rounded-lg bg-gold-500 text-white font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5" /> Profile Settings
          </Link>
          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-gold-400" /> Dashboard
          </Link>
          <Link
            to="/orders"
            className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-gold-400" /> Order History
          </Link>
          <Link
            to="/addresses"
            className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-gold-400" /> Saved Addresses
          </Link>
        </div>
      </div>

      {/* Profile Edit Card */}
      <div className="bg-white border border-gold-300 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="border-b border-gold-200 pb-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-obsidian flex items-center gap-2">
            <User className="w-5 h-5 text-gold-600" /> Account Personal Details
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Update your display name, contact phone number, and account password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full p-3 bg-ivory border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500 font-medium text-obsidian"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full p-3 bg-ivory border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500 font-medium text-obsidian"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">
              Email Address <span className="text-zinc-400 font-normal">(Registered email - cannot be modified)</span>
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed font-medium"
            />
          </div>

          <div className="pt-2 border-t border-zinc-100">
            <label className="font-bold text-zinc-700 block mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-600" /> Change Security Password
              <span className="text-zinc-400 font-normal">(Leave blank to keep current password)</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500 font-medium text-obsidian"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-obsidian text-white hover:bg-gold-500 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Save className="w-4 h-4 text-gold-300" /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3.5 bg-ivory hover:bg-gold-50 border border-gold-300 rounded-xl font-bold text-obsidian text-xs flex items-center justify-center transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
