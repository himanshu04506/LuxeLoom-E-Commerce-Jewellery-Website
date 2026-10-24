import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm max-w-md ${
          type === 'success'
            ? 'bg-emerald-950 text-emerald-100 border-emerald-700'
            : 'bg-rose-950 text-rose-100 border-rose-700'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        )}
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="hover:opacity-75 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
