import React, { useState } from 'react';
import { createTicket } from '../../services/supportService';
import { X, ShieldAlert, CheckCircle2, Upload, AlertCircle } from 'lucide-react';

const ComplaintModal = ({ initialOrderId = '', onClose, onSuccess }) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [category, setCategory] = useState('Product damaged');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Product damaged',
    'Wrong product',
    'Missing item',
    'Delivery issue',
    'Payment issue',
    'Return request',
    'Exchange request',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please describe the issue with your order.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await createTicket({
        orderId,
        category,
        description,
        attachments: attachmentUrl ? [attachmentUrl] : [],
        priority,
      });

      if (data.success) {
        onSuccess(data.ticket);
        onClose();
      } else {
        setError(data.message || 'Failed to submit ticket');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting support complaint ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gold-300 relative space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gold-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-obsidian">Raise Complaint / Issue</h3>
              <p className="text-xs text-zinc-500">Fast 24-hour after-sales complaint resolution</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-zinc-700 block mb-1">Order Reference ID (Optional)</label>
            <input
              type="text"
              placeholder="e.g. ORD-849102"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Issue Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Detailed Description of Discrepancy *</label>
            <textarea
              rows={4}
              placeholder="Please explain what went wrong with your product or delivery..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              required
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Photo / Evidence URL (Optional)</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="flex-1 p-2.5 bg-ivory border border-gold-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gold-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-ivory border border-gold-300 rounded-lg font-semibold text-zinc-700 hover:bg-gold-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-obsidian text-white hover:bg-gold-500 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {loading ? 'Submitting...' : 'Submit Complaint Ticket'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ComplaintModal;
