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
    <header className="site-header sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 border-b border-zinc-200 transition-all shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-4 min-h-20 py-3 lg:py-0">
          
          {/* Brand Logo: YOU2ME MATRIMONY */}
          <button type="button" aria-label="YOU2ME home"
            onClick={() => { setActiveTab('discovery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Green Squircle with Heart Outline */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C71F37] to-[#A6192D] flex items-center justify-center shadow-md shadow-red-900/15 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5 h-5 text-white stroke-[2.5] fill-none" />
            </div>
            
            <div className="flex flex-col text-left leading-none">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#18181B] group-hover:text-[#C71F37] transition-colors">
                YOU2ME
              </span>
              <span className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-[#C71F37] mt-0.5">
                MATRIMONY
              </span>
            </div>
          </button>

          {/* Minimal Navigation Items */}
          <nav aria-label="Main navigation" className="order-3 lg:order-none w-full lg:w-auto flex overflow-x-auto items-center gap-5 xl:gap-7 whitespace-nowrap border-t border-zinc-100 lg:border-0 mt-3 lg:mt-0 pt-1 lg:pt-0">
            <button
              type="button"
              onClick={() => { setActiveTab('discovery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                activeTab === 'discovery'
                  ? 'text-[#C71F37] border-b-2 border-[#C71F37] pb-0.5'
                  : 'text-zinc-600 hover:text-[#C71F37]'
              }`}
            >
              Discover
            </button>

            <button
              type="button"
              onClick={onScrollToSearch}
              className="text-xs font-bold tracking-wider uppercase text-zinc-600 hover:text-[#C71F37] transition-colors cursor-pointer"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('interests')}
              className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer relative ${
                activeTab === 'interests'
                  ? 'text-[#C71F37] border-b-2 border-[#C71F37] pb-0.5'
                  : 'text-zinc-600 hover:text-[#C71F37]'
              }`}
            >
              <span>Interests</span>
              {interestsCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-[#C71F37] rounded-full">
                  {interestsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shortlist')}
              className={`text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer relative ${
                activeTab === 'shortlist'
                  ? 'text-[#C71F37] border-b-2 border-[#C71F37] pb-0.5'
                  : 'text-zinc-600 hover:text-[#C71F37]'
              }`}
            >
              <span>Saved</span>
              {shortlistedCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {shortlistedCount}
                </span>
              )}
            </button>

            <a
              href="#stories"
              className="text-xs font-bold tracking-wider uppercase text-zinc-600 hover:text-[#C71F37] transition-colors"
            >
              Happy Couples
            </a>

            <button
              type="button"
              onClick={onOpenUpgrade}
              className="text-xs font-bold tracking-wider uppercase text-red-700 hover:text-red-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>VIP Plans</span>
            </button>
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <div className="flex items-center rounded-2xl border border-zinc-200 bg-white px-1.5 py-1 shadow-sm">
                <button type="button" onClick={onOpenProfile} title="View your profile" className="group flex min-w-16 max-w-28 sm:max-w-36 flex-col items-center gap-1 rounded-xl px-3 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-red-50 hover:text-red-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100 group-hover:bg-red-100 transition-colors">
                    <UserRound className="h-4 w-4 text-red-700" aria-hidden="true" />
                  </span>
                  <span className="w-full truncate">{userName || 'Your account'}</span>
                </button>
                <span className="mx-1 h-8 w-px bg-zinc-200" aria-hidden="true" />
                <button type="button" onClick={onSignOut} title="Sign out" className="group flex flex-col items-center gap-1 rounded-xl px-3 py-1 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer whitespace-nowrap">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 group-hover:bg-zinc-100 transition-colors">
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
              className="inline-flex items-center justify-center min-h-11 px-3 sm:px-5 py-2.5 rounded-xl border border-zinc-200 hover:border-[#C71F37] text-sm font-semibold text-zinc-700 hover:text-[#C71F37] transition-all bg-white hover:bg-zinc-50"
            >
              Login
            </Link>

            {/* Register Free Pill Button */}
            <Link
              to="/register"
              className="inline-flex items-center justify-center min-h-11 px-3 sm:px-5 py-2.5 rounded-xl bg-[#C71F37] hover:bg-[#A6192D] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
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
