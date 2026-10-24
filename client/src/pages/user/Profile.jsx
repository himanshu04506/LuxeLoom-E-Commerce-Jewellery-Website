import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/authService';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';
import Toast from '../../components/common/Toast';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateProfile({ name, phone, password: password || undefined });
      if (res.success) {
        setToast({ message: 'Profile updated successfully!', type: 'success' });
        setPassword('');
      } else {
        setToast({ message: res.message || 'Failed to update profile.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Error updating profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="bg-white border border-gold-300 p-8 rounded-3xl shadow-xl space-y-6">
        <div className="border-b border-gold-200 pb-4">
          <h1 className="font-serif text-2xl font-bold text-obsidian flex items-center gap-2">
            <User className="w-6 h-6 text-gold-600" /> Member Account Profile
          </h1>
          <p className="text-xs text-zinc-500">Manage your name, phone number, and security password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">New Password (Leave blank to keep unchanged)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-obsidian text-white hover:bg-gold-500 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
