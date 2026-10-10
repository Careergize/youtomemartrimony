import React from 'react';
import { Heart, ShieldCheck, Lock, PhoneCall, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-12 border-t border-emerald-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
          
          {/* Brand Manifesto (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white stroke-[2.5] fill-none" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  YOU2ME
                </span>
                <span className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-emerald-400 mt-1">
                  MATRIMONY
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Connecting genuine individuals and loving families to celebrate beautiful, happy marriages built on trust, mutual respect, and lifelong friendship.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% ID Verified
              </span>
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Privacy Protected
              </span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Explore Matches
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Daily Recommendations</a></li>
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Doctors & Healthcare</a></li>
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Engineers & Tech Leads</a></li>
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Civil Services Officers</a></li>
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Kundali / Guna Matching</a></li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Safety & Security
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#safety" className="hover:text-emerald-400 transition-colors">Photo Privacy Controls</a></li>
              <li><a href="#safety" className="hover:text-emerald-400 transition-colors">Govt ID Verification Policy</a></li>
              <li><a href="#safety" className="hover:text-emerald-400 transition-colors">Report Suspicious Activity</a></li>
              <li><a href="#safety" className="hover:text-emerald-400 transition-colors">Safe Matrimony Guidelines</a></li>
              <li><a href="#safety" className="hover:text-emerald-400 transition-colors">Privacy Shield</a></li>
            </ul>
          </div>

          {/* Column 4: Family Support */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Family Assistance
            </h4>
            <p className="text-xs text-slate-400">
              Our marriage advisors and family consultants are available 7 days a week.
            </p>
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>1800-419-YOU2ME (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <span>support@you2me.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} YOU2ME Matrimony. All rights reserved. Bringing hearts and families together in happiness.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400 transition-colors">Security Standards</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
