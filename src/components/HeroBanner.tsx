import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Lock,
  ChevronDown,
  Users
} from 'lucide-react';

interface HeroBannerProps {
  genderFilter: 'All' | 'Bride' | 'Groom';
  setGenderFilter: (val: 'All' | 'Bride' | 'Groom') => void;
  minAge: number;
  setMinAge: (val: number) => void;
  maxAge: number;
  setMaxAge: (val: number) => void;
  religionFilter: string;
  setReligionFilter: (val: string) => void;
  motherTongueFilter: string;
  setMotherTongueFilter: (val: string) => void;
  cityFilter: string;
  setCityFilter: (val: string) => void;
  onSearchClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  genderFilter,
  setGenderFilter,
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  religionFilter,
  setReligionFilter,
  motherTongueFilter,
  setMotherTongueFilter,
  cityFilter,
  setCityFilter,
  onSearchClick
}) => {
  const [selectedGender, setSelectedGender] = useState<'Bride' | 'Groom'>(
    genderFilter === 'Groom' ? 'Groom' : 'Bride'
  );

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGenderFilter(selectedGender);
    onSearchClick();
  };

  const popularCommunities = [
    'Nair', 'Syrian Christian', 'Ezhava', 'Brahmin', 
    'Muslim', 'Menon', 'Latin Catholic', 'Viswakarma', 'Dheevara'
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 text-white min-h-[640px] flex items-center border-b border-red-950/60">
      
      {/* 1. FULL BACKGROUND PICTURE WITH AUTHENTIC CANDID WEDDING COUPLE */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-banner-couple.jpg"
          alt="Joyful happy smiling wedding couple"
          className="w-full h-full object-cover object-[78%_center] lg:object-right"
        />
        {/* Cinematic Dark Gradient Film Overlay for Ultimate Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111113] via-[#111113]/85 to-[#111113]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-[#111113]/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-10">
        
        {/* TOP ROW: EDITORIAL STORYTELLING + REAL COUPLE BACKGROUND */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: RESTORED ORIGINAL EDITORIAL HEADLINE & VALUE PROP */}
          <div className="lg:col-span-8 xl:col-span-7 space-y-6 text-left">

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-[clamp(1.5rem,7vw,2.25rem)] sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md">
              <span className="whitespace-nowrap">Somewhere between</span> <span className="text-red-400">you</span> &amp; <span className="text-red-400">me</span>,{' '}
              <span className="block mt-2 text-white font-serif">
                there is an <span className="text-red-400">us.</span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-zinc-200 max-w-xl leading-relaxed font-normal">
              Meet people who share your values. Discover verified profiles, connect with confidence, and take the next step toward a meaningful relationship.
            </p>

            {/* Live Happiness & Trust Metrics (Frosted Glass) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 max-w-lg">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 text-left shadow-lg">
                <div className="text-xl sm:text-2xl font-extrabold text-red-400 font-serif">100,000+</div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-200 mt-0.5">Sacred Unions</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 text-left shadow-lg">
                <div className="text-xl sm:text-2xl font-extrabold text-red-400 font-serif">100%</div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-200 mt-0.5">ID Verified</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 text-left shadow-lg">
                <div className="text-xl sm:text-2xl font-extrabold text-red-400 font-serif">4.9 / 5</div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-200 mt-0.5">High Trust Rating</div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Blank space allowing the joyful couple photograph to shine through without obstruction */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-5" />

        </div>

        {/* BOTTOM SECTION: CLEAN, CRISP PARTNER SEARCH CONSOLE */}
        <div className="relative z-20">
          <div className="hero-search bg-white text-zinc-800 rounded-2xl p-5 sm:p-7 border border-zinc-200">
            
            <form onSubmit={handleQuickSubmit}>
              
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 xl:gap-5">
                
                {/* 1. Seeking: Bride / Groom */}
                <div className="lg:w-48 text-left">
                  <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
                    I am Looking For
                  </span>
                  <div className="flex p-1 bg-zinc-100 rounded-2xl border border-zinc-200">
                    <button
                      type="button"
                      onClick={() => { setSelectedGender('Bride'); setGenderFilter('Bride'); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedGender === 'Bride'
                          ? 'bg-[#C71F37] text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      A Bride
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedGender('Groom'); setGenderFilter('Groom'); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedGender === 'Groom'
                          ? 'bg-[#C71F37] text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      A Groom
                    </button>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-px h-11 bg-zinc-200" />

                {/* 2. Age Range */}
                <div className="lg:w-44 text-left">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
                    Age
                  </label>
                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-1.5">
                    <select
                      value={minAge}
                      onChange={(e) => setMinAge(Number(e.target.value))}
                      className="bg-transparent text-xs sm:text-sm font-bold text-zinc-800 focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: 83 }, (_, i) => i + 18).map((a) => (
                        <option key={a} value={a}>{a} Yrs</option>
                      ))}
                    </select>
                    <span className="text-zinc-400 text-xs font-bold">to</span>
                    <select
                      value={maxAge}
                      onChange={(e) => setMaxAge(Number(e.target.value))}
                      className="bg-transparent text-xs sm:text-sm font-bold text-zinc-800 focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: 83 }, (_, i) => i + 18).map((a) => (
                        <option key={a} value={a}>{a} Yrs</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-px h-11 bg-zinc-200" />

                {/* 3. Community / Religion */}
                <div className="flex-1 text-left">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
                    Religion / Community
                  </label>
                  <div className="relative">
                    <select
                      value={religionFilter}
                      onChange={(e) => setReligionFilter(e.target.value)}
                      className="w-full h-11 px-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer appearance-none"
                    >
                      <option value="All">All Communities</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Christian">Christian</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Jain">Jain</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Mother Tongue */}
                <div className="flex-1 text-left">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
                    Mother Tongue
                  </label>
                  <div className="relative">
                    <select
                      value={motherTongueFilter}
                      onChange={(e) => setMotherTongueFilter(e.target.value)}
                      className="w-full h-11 px-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer appearance-none"
                    >
                      <option value="All">All Languages</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Kannada">Kannada</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Marathi">Marathi</option>
                      <option value="English">English</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 5. City */}
                <div className="flex-1 text-left">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
                    Location / City
                  </label>
                  <div className="relative">
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full h-11 px-3.5 pr-8 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer appearance-none"
                    >
                      <option value="All">All Locations</option>
                      <option value="Kochi">Kochi</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                      <option value="Kozhikode">Kozhikode</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 6. Primary Action Button */}
                <div className="pt-2 lg:pt-5">
                  <button
                    type="submit"
                    className="w-full lg:w-auto h-11 px-8 rounded-2xl bg-[#C71F37] hover:bg-[#A6192D] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-900/15 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <Search className="w-4 h-4 text-white" />
                    <span>Search Partner</span>
                  </button>
                </div>

              </div>

            </form>

            {/* Quick Explore by Community */}
            <div className="mt-4 pt-3.5 border-t border-zinc-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-500 font-semibold mr-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-red-600" />
                Popular Communities:
              </span>
              {popularCommunities.map((comm) => (
                <button
                  key={comm}
                  type="button"
                  onClick={() => {
                    setCityFilter('All');
                    onSearchClick();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-[#A6192D] font-semibold transition-colors cursor-pointer"
                >
                  {comm}
                </button>
              ))}
            </div>

            {/* Peace of Mind Guarantees */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-50">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-red-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  100% Verified Biodata
                </span>
                <span className="flex items-center gap-1.5 text-zinc-600 font-medium">
                  <Lock className="w-3.5 h-3.5 text-red-600" />
                  Protected Mobile Numbers &amp; Photos
                </span>
              </div>
              <span className="font-semibold text-red-800">
                Be part of our beginning. Find your forever.
              </span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
