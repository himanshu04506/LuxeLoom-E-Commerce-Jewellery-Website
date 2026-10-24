import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, Headset } from 'lucide-react';
import Toast from '../../components/common/Toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setToast({ message: 'Thank you for reaching out! Our concierge will call you back within 2 hours.', type: 'success' });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-obsidian">Contact LuxeLoom Concierge</h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">We are available 24/7 to assist with custom design orders & inquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Contact Info */}
        <div className="bg-obsidian text-white p-8 rounded-3xl space-y-6 border border-gold-500/40">
          <h2 className="font-serif text-xl font-bold text-gold-400">Headquarters & Flagship Store</h2>
          <div className="space-y-4 text-xs text-zinc-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">LuxeLoom Flagship Boutique</strong>
                <span>Connaught Place, Inner Circle, New Delhi - 110001, India</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <strong className="block text-white">Toll-Free Concierge Hotline</strong>
                <span>+91 1800-LUXELOOM (+91 1800-589-3566)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <strong className="block text-white">Email Concierge</strong>
                <span>support@luxeloom.com / concierge@luxeloom.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gold-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-serif font-bold text-lg text-obsidian">Send Us a Direct Message</h3>
          
          <div>
            <label className="font-bold text-zinc-700 block mb-1">Your Full Name</label>
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
              <label className="font-bold text-zinc-700 block mb-1">Email Address</label>
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
              <label className="font-bold text-zinc-700 block mb-1">Phone Number</label>
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
            <label className="font-bold text-zinc-700 block mb-1">Message / Inquiry Details</label>
            <textarea
              rows={4}
              required
              placeholder="How can our jewellery concierge team assist you today?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-3 bg-ivory border border-gold-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-obsidian text-white hover:bg-gold-500 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Send className="w-4 h-4" /> Send Concierge Message
          </button>
        </form>

      </div>
    </div>
  );
};

export default ContactUs;
