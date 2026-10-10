import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, UserRound, LogOut } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  userName?: string;
  onSignOut: () => void;
  activeTab: 'discovery' | 'interests' | 'shortlist' | 'messages';
  setActiveTab: (tab: 'discovery' | 'interests' | 'shortlist' | 'messages') => void;
  shortlistedCount: number;
  interestsCount: number;
  onOpenUpgrade: () => void;
  onOpenProfile: () => void;
  onScrollToSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  userName,
  onSignOut,
  activeTab,
  setActiveTab,
  shortlistedCount,
  interestsCount,
  onOpenUpgrade,
  onOpenProfile,
  onScrollToSearch
}) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 border-b border-emerald-100/80 transition-all shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo: YOU2ME MATRIMONY */}
          <div 
            onClick={() => { setActiveTab('discovery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Green Squircle with Heart Outline */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-md shadow-emerald-900/15 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5 h-5 text-white stroke-[2.5] fill-none" />
            </div>
            
            <div className="flex flex-col text-left leading-none">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] group-hover:text-[#059669] transition-colors">
                YOU2ME
              </span>
              <span className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-[#059669] mt-0.5">
                MATRIMONY
              </span>
            </div>
          </div>

          {/* Minimal Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button
              type="button"
              onClick={() => { setActiveTab('discovery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                activeTab === 'discovery'
                  ? 'text-[#059669] border-b-2 border-[#059669] pb-0.5'
                  : 'text-slate-600 hover:text-[#059669]'
              }`}
            >
              Discover
            </button>

            <button
              type="button"
              onClick={onScrollToSearch}
              className="text-xs font-bold tracking-wider uppercase text-slate-600 hover:text-[#059669] transition-colors cursor-pointer"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('interests')}
              className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer relative ${
                activeTab === 'interests'
                  ? 'text-[#059669] border-b-2 border-[#059669] pb-0.5'
                  : 'text-slate-600 hover:text-[#059669]'
              }`}
            >
              <span>Interests</span>
              {interestsCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-[#059669] rounded-full">
                  {interestsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shortlist')}
              className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer relative ${
                activeTab === 'shortlist'
                  ? 'text-[#059669] border-b-2 border-[#059669] pb-0.5'
                  : 'text-slate-600 hover:text-[#059669]'
              }`}
            >
              <span>Saved</span>
              {shortlistedCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-amber-500 rounded-full">
                  {shortlistedCount}
                </span>
              )}
            </button>

            <a
              href="#stories"
              className="text-xs font-bold tracking-wider uppercase text-slate-600 hover:text-[#059669] transition-colors"
            >
              Happy Couples
            </a>

            <button
              type="button"
              onClick={onOpenUpgrade}
              className="text-xs font-bold tracking-wider uppercase text-amber-700 hover:text-amber-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>VIP Plans</span>
            </button>
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-1.5 py-1 shadow-sm">
                <button type="button" onClick={onOpenProfile} title="View your profile" className="group flex min-w-16 max-w-28 sm:max-w-36 flex-col items-center gap-1 rounded-xl px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100 group-hover:bg-emerald-100 transition-colors">
                    <UserRound className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  </span>
                  <span className="w-full truncate">{userName || 'Your account'}</span>
                </button>
                <span className="mx-1 h-8 w-px bg-slate-200" aria-hidden="true" />
                <button type="button" onClick={onSignOut} title="Sign out" className="group flex flex-col items-center gap-1 rounded-xl px-3 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer whitespace-nowrap">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <>
            
            {/* Login Pill Button */}
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-slate-200 hover:border-[#059669] text-xs font-bold text-slate-700 hover:text-[#059669] uppercase tracking-wider transition-all bg-white hover:bg-slate-50"
            >
              Login
            </Link>

            {/* Register Free Pill Button */}
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065F46] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-900/15 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Register Free
            </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
