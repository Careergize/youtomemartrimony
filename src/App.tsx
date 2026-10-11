import { useState, useMemo, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  ArrowUpDown,
  SlidersHorizontal
} from 'lucide-react';
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
import ProfilePage from './ProfilePage';
import { ChatModal } from './components/ChatModal';
import { PremiumModal } from './components/PremiumModal';
import { SuccessStories } from './components/SuccessStories';
import { Footer } from './components/Footer';
import Login from './Login';
import { api, hasSession, loadProfiles, connectionFor } from './api';
import MobileAuthPage from './MobileAuthPage';
import MobileAuth from './components/MobileAuth';

function Home() {
  const [showWelcome, setShowWelcome] = useState(() => !hasSession() && !sessionStorage.getItem('you2me-auth-dismissed'));
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const refreshProfiles = async () => setProfiles(await loadProfiles());
  useEffect(() => {
    if (!hasSession()) { setLoadingProfiles(false); return; }
    let active = true;
    Promise.all([api<MatrimonialProfile>('me/'), loadProfiles()])
      .then(([me, list]) => { if (active) { setCurrentUser(me); setProfiles(list); } })
      .catch(err => { if (active) setApiError(err.message); })
      .finally(() => { if (active) setLoadingProfiles(false); });
    return () => { active = false; };
  }, []);
  const requireSession = () => {
    if (!hasSession()) { navigate('/login'); return false; }
    return true;
  };

  const [currentUser, setCurrentUser] = useState<MatrimonialProfile | null>(null);
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>([]);
  const [activeNavTab, setActiveNavTab] = useState<'discovery' | 'interests' | 'shortlist' | 'messages'>('discovery');
  
  // Modals state
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [chatProfile, setChatProfile] = useState<MatrimonialProfile | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
  const handleToggleShortlist = async (id: string) => {
    if (!requireSession()) return;
    const profile = profiles.find(p => p.id === id);
    try {
      await api(`profiles/${id}/shortlist/`, profile?.isShortlisted ? 'DELETE' : 'POST');
      await refreshProfiles();
      showToast(profile?.isShortlisted ? 'Removed from shortlist.' : 'Saved to shortlist.');
    } catch (err) { showToast(err instanceof Error ? err.message : 'Unable to save.'); }
  };
  const handleSendInterest = async (id: string) => {
    if (!requireSession()) return;
    try {
      await api(`profiles/${id}/interest/`, 'POST');
      await refreshProfiles();
      showToast('Interest saved.');
    } catch (err) { showToast(err instanceof Error ? err.message : 'Unable to send interest.'); }
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

  const respondInterest = async (id: string, status: 'accepted' | 'declined') => {
    if (!requireSession()) return;
    try {
      const connection = await connectionFor(id);
      await api(`interests/${connection.id}/`, 'PATCH', { status });
      await refreshProfiles();
      showToast(status === 'accepted' ? 'Connection accepted. Messaging unlocked.' : 'Interest declined.');
    } catch (err) { showToast(err instanceof Error ? err.message : 'Unable to respond.'); }
  };
  const handleAcceptInterest = (id: string) => { void respondInterest(id, 'accepted'); };
  const handleDeclineInterest = (id: string) => { void respondInterest(id, 'declined'); };

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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-800 selection:bg-red-100 selection:text-red-900">
      
      {/* Toast Notification Pill */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm border border-red-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-red-300 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {apiError && <p role="alert" className="p-4 text-center text-red-700">{apiError} <button onClick={() => window.location.reload()} className="underline">Retry</button></p>}
      {loadingProfiles && <p role="status" className="p-4 text-center">Loading profiles...</p>}
      {/* Global Luxury Minimal Header */}
      <Navbar
        isLoggedIn={hasSession()}
        userName={currentUser?.name}
        onSignOut={async () => {
          try {
            await api('auth/logout/', 'POST');
            sessionStorage.removeItem('you2me-token');
            window.location.assign('/login');
          } catch (err) { showToast(err instanceof Error ? err.message : 'Unable to sign out.'); }
        }}
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        shortlistedCount={shortlistedCount}
        interestsCount={interestsCount}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenProfile={() => { if (requireSession()) navigate('/profile'); }}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-red-100">
                <div className="text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#A6192D] text-xs font-bold uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                    <span>All Verified Matches</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B] tracking-tight">
                    Explore Verified Profiles
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
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
                        ? 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-red-300 hover:text-red-700 hover:bg-red-50/50'
                    }`}
                    title={isFilterOpen ? 'Hide filter sidebar' : 'Show filter sidebar'}
                    aria-label={isFilterOpen ? 'Hide filter sidebar' : 'Show filter sidebar'}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
                    <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#C71F37] text-white text-[10px] font-bold flex items-center justify-center">
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

                  <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-zinc-200 shadow-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-500 font-medium">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs font-bold text-zinc-800 bg-transparent focus:outline-none cursor-pointer"
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
                    <div className="mb-6 p-3 sm:p-3.5 bg-red-50/70 border border-red-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-[#C71F37]" />
                        <span className="font-semibold text-red-950">
                          {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied ({filteredProfiles.length} matching)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsFilterOpen(true)}
                          className="font-bold text-red-700 hover:text-red-900 underline underline-offset-2 cursor-pointer"
                        >
                          Modify Filters
                        </button>
                        <span className="text-zinc-300">|</span>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}

                  {filteredProfiles.length === 0 ? (
                    <div className="py-20 px-8 text-center bg-white rounded-3xl border border-red-100 shadow-sm space-y-4">
                      <div className="w-16 h-16 rounded-full bg-red-50 text-[#C71F37] flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-zinc-800">
                        No Matching Profiles Found
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                        We couldn't find profiles matching all your specific criteria. Try broadening your age, height, or profession filters.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C71F37] text-white text-xs font-bold shadow-md hover:bg-[#A6192D] transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Clear All Filters</span>
                        </button>
                        {!isFilterOpen && (
                          <button
                            type="button"
                            onClick={() => setIsFilterOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-xs font-bold hover:bg-zinc-50 transition-all cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
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
      {showWelcome && <MobileAuth registration onClose={() => { sessionStorage.setItem('you2me-auth-dismissed', 'true'); setShowWelcome(false); }} />}

      {/* 1. Detailed Profile View Modal */}
      {currentUser && <ProfileModal
        profile={selectedProfile}
        currentUser={currentUser}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onToggleShortlist={handleToggleShortlist}
        onSendInterest={handleSendInterest}
        onOpenChat={(p) => setChatProfile(p)}
      />}


      {/* 3. Direct Messaging Chat Modal */}
      {currentUser && <ChatModal
        profile={chatProfile}
        currentUser={currentUser}
        isOpen={!!chatProfile}
        onClose={() => setChatProfile(null)}
      />}

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
        <Route path="/login" element={<MobileAuthPage />} />
        <Route path="/login/email" element={<Login />} />
        <Route path="/register" element={<MobileAuthPage registration />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
