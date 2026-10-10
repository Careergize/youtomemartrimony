import React from 'react';
import { SlidersHorizontal, RotateCcw, ShieldCheck, Compass, X } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  gender: 'All' | 'Bride' | 'Groom';
  minAge: number;
  maxAge: number;
  minHeightInches: number;
  maxHeightInches: number;
  maritalStatuses: string[];
  educationList: string[];
  occupationSectors: string[];
  incomeBrackets: string[];
  manglikOnly: boolean;
  verifiedOnly: boolean;
  dietList: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  totalMatches: number;
  totalProfiles: number;
  onClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onResetFilters,
  totalMatches,
  totalProfiles,
  onClose
}) => {
  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const rem = inches % 12;
    return `${feet}' ${rem}"`;
  };

  const toggleMaritalStatus = (status: string) => {
    setFilters((prev) => {
      const exists = prev.maritalStatuses.includes(status);
      return {
        ...prev,
        maritalStatuses: exists
          ? prev.maritalStatuses.filter((s) => s !== status)
          : [...prev.maritalStatuses, status]
      };
    });
  };

  const toggleEducation = (degree: string) => {
    setFilters((prev) => {
      const exists = prev.educationList.includes(degree);
      return {
        ...prev,
        educationList: exists
          ? prev.educationList.filter((e) => e !== degree)
          : [...prev.educationList, degree]
      };
    });
  };

  const toggleOccupation = (sector: string) => {
    setFilters((prev) => {
      const exists = prev.occupationSectors.includes(sector);
      return {
        ...prev,
        occupationSectors: exists
          ? prev.occupationSectors.filter((o) => o !== sector)
          : [...prev.occupationSectors, sector]
      };
    });
  };

  const toggleIncome = (bracket: string) => {
    setFilters((prev) => {
      const exists = prev.incomeBrackets.includes(bracket);
      return {
        ...prev,
        incomeBrackets: exists
          ? prev.incomeBrackets.filter((b) => b !== bracket)
          : [...prev.incomeBrackets, bracket]
      };
    });
  };

  const toggleDiet = (diet: string) => {
    setFilters((prev) => {
      const exists = prev.dietList.includes(diet);
      return {
        ...prev,
        dietList: exists
          ? prev.dietList.filter((d) => d !== diet)
          : [...prev.dietList, diet]
      };
    });
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0">
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-xs sticky top-24 space-y-6">
        
        {/* Header with Title and Reset */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#059669]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#064E3B]">Filter Matches</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {totalMatches} of {totalProfiles} profiles matching
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Hide filter panel"
                aria-label="Hide filter panel"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search by Keyword */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Keyword or Name
          </label>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="e.g. Doctor, Software, Kochi..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Verified Only Toggle Switch */}
        <div className="p-3 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">Verified Profiles Only</span>
              <span className="text-[10px] text-slate-500">Govt ID &amp; Phone verified</span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={filters.verifiedOnly}
            onClick={() => setFilters((prev) => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              filters.verifiedOnly ? 'bg-[#059669]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                filters.verifiedOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Age Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Age Range
            </label>
            <span className="text-xs font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {filters.minAge} – {filters.maxAge} yrs
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-400 w-8">Min:</span>
              <input
                type="range"
                min="21"
                max="45"
                value={filters.minAge}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFilters((prev) => ({ ...prev, minAge: Math.min(val, prev.maxAge - 1) }));
                }}
                className="w-full accent-[#059669] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 w-6 text-right">{filters.minAge}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-400 w-8">Max:</span>
              <input
                type="range"
                min="22"
                max="50"
                value={filters.maxAge}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFilters((prev) => ({ ...prev, maxAge: Math.max(val, prev.minAge + 1) }));
                }}
                className="w-full accent-[#059669] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 w-6 text-right">{filters.maxAge}</span>
            </div>
          </div>
        </div>

        {/* Height Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Height
            </label>
            <span className="text-xs font-bold text-[#047857] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {formatHeight(filters.minHeightInches)} – {formatHeight(filters.maxHeightInches)}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-400 w-8">Min:</span>
              <input
                type="range"
                min="57"
                max="75"
                value={filters.minHeightInches}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFilters((prev) => ({ ...prev, minHeightInches: Math.min(val, prev.maxHeightInches - 1) }));
                }}
                className="w-full accent-[#059669] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-semibold text-slate-700 w-10 text-right">
                {formatHeight(filters.minHeightInches)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-400 w-8">Max:</span>
              <input
                type="range"
                min="58"
                max="78"
                value={filters.maxHeightInches}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFilters((prev) => ({ ...prev, maxHeightInches: Math.max(val, prev.minHeightInches + 1) }));
                }}
                className="w-full accent-[#059669] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-semibold text-slate-700 w-10 text-right">
                {formatHeight(filters.maxHeightInches)}
              </span>
            </div>
          </div>
        </div>

        {/* Marital Status Checkboxes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Marital Status
          </label>
          <div className="space-y-1.5">
            {['Never Married', 'Divorced', 'Awaiting Divorce'].map((status) => (
              <label key={status} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={filters.maritalStatuses.includes(status)}
                  onChange={() => toggleMaritalStatus(status)}
                  className="rounded text-[#059669] focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Education Checkboxes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Education
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {['B.Tech', 'MBA', 'MD', 'CA', 'MS', 'M.Des', 'Ph.D.'].map((deg) => (
              <label key={deg} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={filters.educationList.includes(deg)}
                  onChange={() => toggleEducation(deg)}
                  className="rounded text-[#059669] focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>{deg}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Occupation Sector */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Profession / Sector
          </label>
          <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {[
              'Technology',
              'Healthcare',
              'Finance',
              'Creative & Design',
              'Engineering',
              'Civil Services',
              'Business & Entrepreneurship'
            ].map((sector) => (
              <label key={sector} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={filters.occupationSectors.includes(sector)}
                  onChange={() => toggleOccupation(sector)}
                  className="rounded text-[#059669] focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span className="truncate">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Annual Income Brackets */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Annual Income
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: '₹10L - 20L', val: '10-20L' },
              { label: '₹20L - 35L', val: '20-35L' },
              { label: '₹35L - 50L', val: '35-50L' },
              { label: '₹50L+', val: '50L+' }
            ].map(({ label, val }) => {
              const active = filters.incomeBrackets.includes(val);
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggleIncome(val)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-50 border-emerald-400 text-[#059669] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horoscope & Manglik Matching Toggle */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Manglik Check</span>
                <span className="text-[10px] text-slate-500">Non-Manglik only</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={filters.manglikOnly}
              onClick={() => setFilters((prev) => ({ ...prev, manglikOnly: !prev.manglikOnly }))}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                filters.manglikOnly ? 'bg-[#059669]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  filters.manglikOnly ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Diet Preference */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Dietary Habits
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['Vegetarian', 'Non-Vegetarian', 'Eggetarian'].map((diet) => {
              const active = filters.dietList.includes(diet);
              return (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleDiet(diet)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#059669] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diet}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
};
