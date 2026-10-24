import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-gold-300 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-bold text-obsidian">Reset Password</h2>
          <p className="text-xs text-zinc-500">Enter your registered email address to receive password reset instructions</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3 text-emerald-900">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base">Reset Instructions Sent!</h3>
            <p className="text-xs text-zinc-600">
              We sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Link to="/login" className="inline-block pt-2 text-xs font-bold text-gold-700 hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-zinc-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="user@luxeloom.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-ivory border border-gold-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-obsidian text-white hover:bg-gold-500 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Mail className="w-4 h-4" /> Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="text-xs font-semibold text-zinc-600 hover:text-gold-600 inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
