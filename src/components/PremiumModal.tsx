import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  ShieldCheck
} from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'gold' | 'elite'>('elite');
  const [notice, setNotice] = useState('');

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setNotice('Online payment is not available yet. No subscription has been activated.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col text-slate-800 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {notice && <p role="status" className="p-4 text-center text-sm">{notice}</p>}
        {/* Top Gold Banner */}
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#065F46] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-emerald-100 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>YOU2ME VIP &amp; Concierge Plans</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-4 tracking-tight">
            Accelerate Your Life Partner Search
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-lg">
            Unlock direct parent phone numbers, verified horoscope downloads, and personal matchmaker assistance.
          </p>
        </div>

        {/* Plan Select Cards */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <p className="text-lg font-bold text-[#064E3B]">First 2 months completely free</p>
            <p className="mt-1 text-xs text-emerald-800">Start your journey free, then choose a 3-month or 6-month plan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Gold Plan */}
            <div
              onClick={() => setSelectedPlan('gold')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'gold'
                  ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-200'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  YOU2ME Gold
                </span>
                <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  3 Months
                </span>
              </div>
              <div className="mt-3">
                <del className="mr-2 text-sm text-slate-400">₹4,999</del>
                <span className="text-2xl font-bold text-slate-900">₹500</span>
                <span className="text-xs text-slate-500 ml-1">/ one-time</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>View 40 Verified Phone Numbers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Unlimited Direct Messaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Astrological Horoscope Downloads</span>
                </li>
              </ul>
            </div>

            {/* Elite Plan */}
            <div
              onClick={() => setSelectedPlan('elite')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'elite'
                  ? 'border-[#059669] bg-emerald-50/50 shadow-md ring-2 ring-emerald-200'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#059669] to-[#047857] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
                Most Popular
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                  YOU2ME Royale VIP
                </span>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  6 Months
                </span>
              </div>
              <div className="mt-3">
                <del className="mr-2 text-sm text-slate-400">₹4,999</del>
                <span className="text-2xl font-bold text-slate-900">₹2,000</span>
                <span className="text-xs text-slate-500 ml-1">/ one-time</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Unlimited Verified Phone &amp; WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Dedicated Personal Matchmaker</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Top-Ranked Profile Spotlight (5x Views)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Family Meeting Assistance</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Guarantee Pill */}
          <div className="p-3 bg-[#F8FAF8] border border-emerald-100 rounded-xl flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              100% Privacy Guarantee: Your phone numbers and biodata are only shared with explicitly approved prospects.
            </span>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleSubscribe}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065F46] text-white font-bold text-sm shadow-md shadow-emerald-900/15 hover:shadow-lg transition-all cursor-pointer"
          >
            {`Activate ${selectedPlan === 'elite' ? 'Royale VIP' : 'Gold'} Plan`}
          </button>
        </div>

      </div>
    </div>
  );
};
