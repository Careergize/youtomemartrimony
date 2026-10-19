import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MatrimonialProfile } from '../data/mockProfiles';
import { ProfileCard } from './ProfileCard';

interface HighlightedProfilesProps {
  profiles: MatrimonialProfile[];
  emptyMessage?: string;
  onViewProfile: (profile: MatrimonialProfile) => void;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
}

export const HighlightedProfiles: React.FC<HighlightedProfilesProps> = ({
  profiles,
  emptyMessage = 'No profiles are available in this category yet.',
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
  const visiblePage = Math.min(currentPage, totalPages - 1);
  const currentProfiles = filtered.slice(visiblePage * pageSize, (visiblePage + 1) * pageSize);

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
    <section className="py-14 sm:py-16 bg-white relative border-b border-red-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider">
            <span>Verified Profiles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#18181B] tracking-tight">
            Featured Brides &amp; Grooms
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
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
                ? 'bg-[#18181B] text-white shadow-sm'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            All Profiles ({profiles.length})
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('Bride')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'Bride'
                ? 'bg-[#C71F37] text-white shadow-sm'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            Brides
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('Groom')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'Groom'
                ? 'bg-[#C71F37] text-white shadow-sm'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            Grooms
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('TopMatch')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'TopMatch'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            <span>High Compatibility (95%+)</span>
          </button>
        </div>

        {/* 4-Column Grid with Navigation Controls */}
        <div className="relative px-2 sm:px-4 pt-3">
          
          {/* Left Arrow Button (<) */}
          {totalPages > 1 && <button
            type="button"
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-white hover:bg-red-50 border border-zinc-200 shadow-md flex items-center justify-center text-zinc-700 hover:text-red-700 transition-all absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            title="Previous Profiles"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>}

          {/* Right Arrow Button (>) */}
          {totalPages > 1 && <button
            type="button"
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-white hover:bg-red-50 border border-zinc-200 shadow-md flex items-center justify-center text-zinc-700 hover:text-red-700 transition-all absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            title="Next Profiles"
          >
            <ChevronRight className="w-5 h-5" />
          </button>}

          {/* 4-Columns Grid */}
          {currentProfiles.length === 0 && <p role="status" className="py-12 text-sm text-zinc-600">{profiles.length === 0 ? emptyMessage : 'No profiles are available in this category yet.'}</p>}
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
                    visiblePage === i ? 'bg-[#C71F37] w-7' : 'bg-zinc-300 hover:bg-zinc-400 w-2.5'
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
