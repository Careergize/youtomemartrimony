import { useState, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  ArrowUpDown,
  SlidersHorizontal
} from 'lucide-react';
import { MOCK_PROFILES, CURRENT_USER } from './data/mockProfiles';
import type { MatrimonialProfile } from './data/mockProfiles';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterSidebar } from './components/FilterSidebar';
import type { FilterState } from './components/FilterSidebar';
import { HighlightedProfiles } from './components/HighlightedProfiles';
import { TrustPillars } from './components/TrustPillars';
import { CommunityShowcase } from './components/CommunityShowcase';
import { ProfileCard } from './components/ProfileCard';
import { ProfileModal } from './components/ProfileModal';
import { InterestsHub } from './components/InterestsHub';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ChatModal } from './components/ChatModal';
import { PremiumModal } from './components/PremiumModal';
import { SuccessStories } from './components/SuccessStories';
import { Footer } from './components/Footer';
import Login from './Login';
import Register from './Register';

function Home() {
  const [currentUser, setCurrentUser] = useState<MatrimonialProfile>(CURRENT_USER);
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>(MOCK_PROFILES);
  const [activeNavTab, setActiveNavTab] = useState<'discovery' | 'interests' | 'shortlist' | 'messages'>('discovery');
  
  // Modals state
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [chatProfile, setChatProfile] = useState<MatrimonialProfile | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Discovery Filter State
  const initialFilters: FilterState = {
    searchQuery: '',
    gender: 'All',
    minAge: 21,
    maxAge: 45,
    minHeightInches: 58,
    maxHeightInches: 76,
    maritalStatuses: [],
    educationList: [],
    occupationSectors: [],
    incomeBrackets: [],
    manglikOnly: false,
    verifiedOnly: false,
    dietList: []
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [sortBy, setSortBy] = useState<'compatibility' | 'ageAsc' | 'ageDesc'>('compatibility');
  const [passedProfileIds, setPassedProfileIds] = useState<string[]>([]);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim() !== '') count++;
    if (filters.gender !== 'All') count++;
    if (filters.minAge !== initialFilters.minAge || filters.maxAge !== initialFilters.maxAge) count++;
    if (filters.minHeightInches !== initialFilters.minHeightInches || filters.maxHeightInches !== initialFilters.maxHeightInches) count++;
    if (filters.maritalStatuses.length > 0) count += filters.maritalStatuses.length;
    if (filters.educationList.length > 0) count += filters.educationList.length;
    if (filters.occupationSectors.length > 0) count += filters.occupationSectors.length;
    if (filters.incomeBrackets.length > 0) count += filters.incomeBrackets.length;
    if (filters.manglikOnly) count++;
    if (filters.verifiedOnly) count++;
    if (filters.dietList.length > 0) count += filters.dietList.length;
    return count;
  }, [filters, initialFilters]);

  const discoverySectionRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Profile Action Handlers
  const handleToggleShortlist = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isShortlisted;
          showToast(nextState ? `Saved ${p.name} to your Shortlist` : `Removed ${p.name} from Shortlist`);
          return { ...p, isShortlisted: nextState };
        }
        return p;
      })
    );
  };

  const handleSendInterest = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          showToast(`Interest proposal sent to ${p.name}`);
          return { ...p, interestStatus: 'sent' };
        }
        return p;
      })
    );
  };

  const handlePassProfile = (id: string) => {
    const passed = profiles.find((p) => p.id === id);
    setPassedProfileIds((prev) => [...prev, id]);
    if (passed) {
      showToast(`Passed on ${passed.name}. You can undo anytime.`);
    }
  };

  const handleUndoPass = () => {
    setPassedProfileIds([]);
    showToast('Restored all passed profiles to your feed.');
  };

  const handleAcceptInterest = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          showToast(`Mutual connection established with ${p.name}! Direct messaging unlocked.`);
          return { ...p, interestStatus: 'accepted' };
        }
        return p;
      })
    );
  };

  const handleDeclineInterest = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          showToast(`Declined interest from ${p.name}.`);
          return { ...p, interestStatus: 'declined' };
        }
        return p;
      })
    );
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    showToast('Reset all filters to defaults.');
  };

  const handleScrollToSearch = () => {
    discoverySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter and Sort profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Exclude passed profiles
      if (passedProfileIds.includes(p.id)) return false;

      // Gender
      if (filters.gender !== 'All' && p.gender !== filters.gender) return false;

      // Age range
      if (p.age < filters.minAge || p.age > filters.maxAge) return false;

      // Height range
      if (p.heightInches < filters.minHeightInches || p.heightInches > filters.maxHeightInches) return false;

      // Marital status
      if (filters.maritalStatuses.length > 0 && !filters.maritalStatuses.includes(p.maritalStatus)) return false;

      // Education
      if (filters.educationList.length > 0 && !filters.educationList.some((deg) => p.education.degree.includes(deg))) return false;

      // Occupation Sector
      if (filters.occupationSectors.length > 0 && !filters.occupationSectors.includes(p.occupation.companySector)) return false;

      // Income Brackets
      if (filters.incomeBrackets.length > 0 && !filters.incomeBrackets.includes(p.occupation.incomeBracket)) return false;

      // Manglik check
      if (filters.manglikOnly && p.horoscope.manglik === 'Manglik') return false;

      // Verified check
      if (filters.verifiedOnly && !p.verification.isVerified) return false;

      // Diet check
      if (filters.dietList.length > 0 && !filters.dietList.includes(p.diet)) return false;

      // Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesTitle = p.occupation.title.toLowerCase().includes(query);
        const matchesCity = p.city.toLowerCase().includes(query);
        const matchesCommunity = p.community.toLowerCase().includes(query);
        const matchesDegree = p.education.degree.toLowerCase().includes(query);
        const matchesBio = p.bio.toLowerCase().includes(query);
        if (!matchesName && !matchesTitle && !matchesCity && !matchesCommunity && !matchesDegree && !matchesBio) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'compatibility') return b.compatibilityScore - a.compatibilityScore;
      if (sortBy === 'ageAsc') return a.age - b.age;
      if (sortBy === 'ageDesc') return b.age - a.age;
      return 0;
    });
  }, [profiles, filters, sortBy, passedProfileIds]);

  // Derived counts for navbar badges
  const shortlistedCount = profiles.filter((p) => p.isShortlisted).length;
  const interestsCount = profiles.filter((p) => p.interestStatus === 'received').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Toast Notification Pill */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#064E3B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm border border-emerald-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Global Luxury Minimal Header */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        shortlistedCount={shortlistedCount}
        interestsCount={interestsCount}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onScrollToSearch={handleScrollToSearch}
      />

      <main className="flex-1">
        {/* VIEW 1: DISCOVERY SCREEN (Hero + Filter Sidebar + Grid) */}
        {activeNavTab === 'discovery' && (
          <div>
            {/* Hero & Quick Partner Finder */}
            <HeroBanner
              genderFilter={filters.gender}
              setGenderFilter={(g) => setFilters((prev) => ({ ...prev, gender: g }))}
              minAge={filters.minAge}
              setMinAge={(age) => setFilters((prev) => ({ ...prev, minAge: age }))}
              maxAge={filters.maxAge}
              setMaxAge={(age) => setFilters((prev) => ({ ...prev, maxAge: age }))}
              religionFilter={filters.maritalStatuses[0] || 'All'}
              setReligionFilter={() => {}}
              motherTongueFilter="All"
              setMotherTongueFilter={() => {}}
              cityFilter="All"
              setCityFilter={(city) => {
                if (city !== 'All') {
                  setFilters((prev) => ({ ...prev, searchQuery: city }));
                } else {
                  setFilters((prev) => ({ ...prev, searchQuery: '' }));
                }
              }}
              onSearchClick={handleScrollToSearch}
            />

            {/* Handpicked Alliances / Highlighted Profiles */}
            <HighlightedProfiles
              profiles={profiles}
              onViewProfile={(p) => setSelectedProfile(p)}
              onToggleShortlist={handleToggleShortlist}
              onSendInterest={handleSendInterest}
            />

            {/* The 4 Pillars of YOU2ME Matrimony */}
            <TrustPillars />

            {/* Explore by Heritage & Community */}
            <CommunityShowcase 
              onSelectCommunity={(community) => {
                setFilters((prev) => ({ ...prev, searchQuery: community }));
                handleScrollToSearch();
              }}
            />

            {/* Core Discovery Screen Section */}
            <section ref={discoverySectionRef} id="discovery-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
              
              {/* Section Header with Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-emerald-100">
                <div className="text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-xs font-bold uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>All Verified Matches</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#064E3B] tracking-tight">
                    Explore Verified Profiles
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Displaying verified singles matching your preferences with direct family contact options.
                  </p>
                </div>

                {/* Controls Bar: Filter Toggle, Undo Pass, and Sort */}
                <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
                  {/* Button to toggle side panel */}
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen((prev) => !prev)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                      isFilterOpen
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50'
                    }`}
                    title={isFilterOpen ? 'Hide filter sidebar' : 'Show filter sidebar'}
                    aria-label={isFilterOpen ? 'Hide filter sidebar' : 'Show filter sidebar'}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#059669] text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {passedProfileIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndoPass}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Undo Passes ({passedProfileIds.length})
                    </button>
                  )}

                  <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500 font-medium">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="compatibility">Highest Match %</option>
                      <option value="ageAsc">Age: Youngest First</option>
                      <option value="ageDesc">Age: Senior First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Two-Column Layout: Left Sticky Sidebar (collapsible) + Right Responsive Card Grid */}
              <div className="flex flex-col lg:flex-row items-start gap-8">
                
                {/* Left Sticky Filter Sidebar */}
                {isFilterOpen && (
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    onResetFilters={handleResetFilters}
                    totalMatches={filteredProfiles.length}
                    totalProfiles={profiles.length}
                    onClose={() => setIsFilterOpen(false)}
                  />
                )}

                {/* Right Responsive Card Grid */}
                <div className="flex-1 w-full">
                  {/* Active filters pill bar when sidebar is hidden */}
                  {!isFilterOpen && activeFiltersCount > 0 && (
                    <div className="mb-6 p-3 sm:p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-[#059669]" />
                        <span className="font-semibold text-emerald-950">
                          {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied ({filteredProfiles.length} matching)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsFilterOpen(true)}
                          className="font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 cursor-pointer"
                        >
                          Modify Filters
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}

                  {filteredProfiles.length === 0 ? (
                    <div className="py-20 px-8 text-center bg-white rounded-3xl border border-emerald-100 shadow-sm space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-slate-800">
                        No Matching Profiles Found
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                        We couldn't find profiles matching all your specific criteria. Try broadening your age, height, or profession filters.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#059669] text-white text-xs font-bold shadow-md hover:bg-[#047857] transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Clear All Filters</span>
                        </button>
                        {!isFilterOpen && (
                          <button
                            type="button"
                            onClick={() => setIsFilterOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Show Filters</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${isFilterOpen ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
                      {filteredProfiles.map((profile) => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          onViewProfile={(p) => setSelectedProfile(p)}
                          onToggleShortlist={handleToggleShortlist}
                          onSendInterest={handleSendInterest}
                          onPassProfile={handlePassProfile}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </section>

            {/* Success Stories Section */}
            <SuccessStories />
          </div>
        )}

        {/* VIEW 2: INTERESTS & CONNECTIONS HUB */}
        {activeNavTab === 'interests' && (
          <InterestsHub
            profiles={profiles}
            defaultSubTab="received"
            onAcceptInterest={handleAcceptInterest}
            onDeclineInterest={handleDeclineInterest}
            onSendInterest={handleSendInterest}
            onToggleShortlist={handleToggleShortlist}
            onViewProfile={(p) => setSelectedProfile(p)}
            onOpenChat={(p) => setChatProfile(p)}
            onBackToDiscovery={() => setActiveNavTab('discovery')}
          />
        )}

        {/* VIEW 3: SHORTLISTED PROFILES */}
        {activeNavTab === 'shortlist' && (
          <InterestsHub
            profiles={profiles}
            defaultSubTab="shortlist"
            onAcceptInterest={handleAcceptInterest}
            onDeclineInterest={handleDeclineInterest}
            onSendInterest={handleSendInterest}
            onToggleShortlist={handleToggleShortlist}
            onViewProfile={(p) => setSelectedProfile(p)}
            onOpenChat={(p) => setChatProfile(p)}
            onBackToDiscovery={() => setActiveNavTab('discovery')}
          />
        )}

        {/* VIEW 4: MESSAGES / MUTUAL CONNECTIONS */}
        {activeNavTab === 'messages' && (
          <InterestsHub
            profiles={profiles}
            defaultSubTab="mutual"
            onAcceptInterest={handleAcceptInterest}
            onDeclineInterest={handleDeclineInterest}
            onSendInterest={handleSendInterest}
            onToggleShortlist={handleToggleShortlist}
            onViewProfile={(p) => setSelectedProfile(p)}
            onOpenChat={(p) => setChatProfile(p)}
            onBackToDiscovery={() => setActiveNavTab('discovery')}
          />
        )}
      </main>

      {/* Global Modals */}

      {/* 1. Detailed Profile View Modal */}
      <ProfileModal
        profile={selectedProfile}
        currentUser={currentUser}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onToggleShortlist={handleToggleShortlist}
        onSendInterest={handleSendInterest}
        onOpenChat={(p) => setChatProfile(p)}
      />

      {/* 2. Onboarding / Profile Setup Wizard */}
      <OnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => {
          setCurrentUser(updated);
          showToast('Updated your personal biodata successfully.');
        }}
      />

      {/* 3. Direct Messaging Chat Modal */}
      <ChatModal
        profile={chatProfile}
        currentUser={currentUser}
        isOpen={!!chatProfile}
        onClose={() => setChatProfile(null)}
      />

      {/* 4. Premium Upgrade Modal */}
      <PremiumModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      {/* Global Luxury Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;