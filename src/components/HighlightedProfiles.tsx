import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { MatrimonialProfile } from '../data/mockProfiles';
import { ProfileCard } from './ProfileCard';

interface HighlightedProfilesProps {
  profiles: MatrimonialProfile[];
  onViewProfile: (profile: MatrimonialProfile) => void;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
}

export const HighlightedProfiles: React.FC<HighlightedProfilesProps> = ({
  profiles,
  onViewProfile,
  onToggleShortlist,
  onSendInterest
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Bride' | 'Groom' | 'TopMatch'>('All');
  const [currentPage, setCurrentPage] = useState(0);

  const filtered = useMemo(() => {
    if (categoryFilter === 'Bride') return profiles.filter((p) => p.gender === 'Bride');
    if (categoryFilter === 'Groom') return profiles.filter((p) => p.gender === 'Groom');
    if (categoryFilter === 'TopMatch') return [...profiles].sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    return profiles;
  }, [profiles, categoryFilter]);

  const pageSize = 8;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentProfiles = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleCategoryChange = (cat: 'All' | 'Bride' | 'Groom' | 'TopMatch') => {
    setCategoryFilter(cat);
    setCurrentPage(0);
  };

  return (
    <section className="py-14 sm:py-16 bg-white relative border-b border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Profiles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#064E3B] tracking-tight">
            Featured Brides &amp; Grooms
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Handpicked genuine profiles looking for marriage with complete family verification.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleCategoryChange('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'All'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Profiles ({profiles.length})
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('Bride')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'Bride'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Brides
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('Groom')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'Groom'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Grooms
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('TopMatch')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'TopMatch'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>High Compatibility (95%+)</span>
          </button>
        </div>

        {/* 4-Column Grid with Navigation Controls */}
        <div className="relative px-2 sm:px-4 pt-3">
          
          {/* Left Arrow Button (<) */}
          <button
            type="button"
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-emerald-700 transition-all absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            title="Previous Profiles"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button (>) */}
          <button
            type="button"
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-emerald-700 transition-all absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            title="Next Profiles"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 4-Columns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onViewProfile={onViewProfile}
                onToggleShortlist={onToggleShortlist}
                onSendInterest={onSendInterest}
              />
            ))}
          </div>

          {/* Pagination Dots if > 1 page */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentPage === i ? 'bg-[#059669] w-7' : 'bg-slate-300 hover:bg-slate-400 w-2.5'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
