import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authenticate } from './api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authenticate('login', { email, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally { setLoading(false); }
  };

  return (
    <>
    {error && <p role="alert" className="p-4 text-center text-red-700">{error}</p>}
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back to Discovery Link */}
      <div className="max-w-4xl mx-auto w-full mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#059669] transition-colors p-2 rounded-lg hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to YOU2ME Matrimony Home</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Visual Column (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#065F46] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white stroke-[2.5] fill-none" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  YOU2ME
                </span>
                <span className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-emerald-300 mt-0.5">
                  MATRIMONY
                </span>
              </div>
            </div>

            <div className="pt-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                Welcome Back
              </span>
              <h1 className="font-serif text-3xl font-bold mt-2 leading-tight">
                Your journey to lifelong happiness starts here.
              </h1>
              <p className="text-xs text-emerald-100 mt-3 leading-relaxed">
                Connect with verified candidates, review family proposals, and take the next step towards a beautiful married life.
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-2 relative z-10 border-t border-white/10 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% ID Verified &amp; Authentic Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>Private &amp; Protected Communication</span>
            </div>
          </div>
        </div>

        {/* Right Form Column (7 cols) */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center text-left">
          
          <div className="space-y-1 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
              Member Login
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#064E3B]">
              Sign in to your account
            </h2>
            <p className="text-xs text-slate-500">
              Enter your credentials to view your matches and messages.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address or Matrimony ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a href="#forgot" className="text-xs font-semibold text-[#059669] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/15 transition-all cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In to YOU2ME Matrimony'}
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">New to YOU2ME Matrimony?</span>
            <Link to="/register" className="font-bold text-[#059669] hover:underline">
              Create Free Profile →
            </Link>
          </div>

        </div>

      </div>
    </div>
    </>
  );
}
