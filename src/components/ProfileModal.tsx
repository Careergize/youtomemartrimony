import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Bookmark, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  Check, 
  Lock, 
  Eye, 
  MessageSquare, 
  Home, 
  Compass 
} from 'lucide-react';
import type { MatrimonialProfile } from '../data/mockProfiles';
import { ProfileDetails } from './ProfileDetails';

interface ProfileModalProps {
  profile: MatrimonialProfile | null;
  currentUser: MatrimonialProfile;
  isOpen: boolean;
  onClose: () => void;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
  onOpenChat: (profile: MatrimonialProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  currentUser,
  isOpen,
  onClose,
  onToggleShortlist,
  onSendInterest,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'career' | 'family' | 'preferences'>('about');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(false);
  const [hasRequestedPhotos, setHasRequestedPhotos] = useState(false);

  if (!isOpen || !profile) return null;

  const isShortlisted = !!profile.isShortlisted;
  const isInterestSent = profile.interestStatus === 'sent' || profile.interestStatus === 'accepted';
  const isMutualMatch = profile.interestStatus === 'accepted';

  // Compare partner preferences with current user
  const preferencesComparison = [
    {
      title: 'Age Requirement',
      preference: `${profile.partnerPreferences.ageRange[0]} - ${profile.partnerPreferences.ageRange[1]} years`,
      yourValue: `${currentUser.age} years`,
      isMatch: currentUser.age >= profile.partnerPreferences.ageRange[0] && currentUser.age <= profile.partnerPreferences.ageRange[1]
    },
    {
      title: 'Height Requirement',
      preference: `${Math.floor(profile.partnerPreferences.heightRange[0] / 12)}'${profile.partnerPreferences.heightRange[0] % 12}" - ${Math.floor(profile.partnerPreferences.heightRange[1] / 12)}'${profile.partnerPreferences.heightRange[1] % 12}"`,
      yourValue: currentUser.height,
      isMatch: currentUser.heightInches >= profile.partnerPreferences.heightRange[0] && currentUser.heightInches <= profile.partnerPreferences.heightRange[1]
    },
    {
      title: 'Religion & Faith',
      preference: profile.partnerPreferences.religion.join(', ') || 'Any',
      yourValue: `${currentUser.religion} (${currentUser.community})`,
      isMatch: (profile.partnerPreferences.religion.length === 0 || profile.partnerPreferences.religion.includes(currentUser.religion))
    },
    {
      title: 'Mother Tongue',
      preference: profile.partnerPreferences.motherTongue.join(', ') || 'Any',
      yourValue: currentUser.motherTongue,
      isMatch: (profile.partnerPreferences.motherTongue.length === 0 || profile.partnerPreferences.motherTongue.includes(currentUser.motherTongue))
    },
    {
      title: 'Education & Career Sector',
      preference: profile.partnerPreferences.occupationSectors.slice(0, 3).join(', ') || 'Any',
      yourValue: `${currentUser.education.degree}, ${currentUser.occupation.companySector}`,
      isMatch: (profile.partnerPreferences.occupationSectors.length === 0 || profile.partnerPreferences.occupationSectors.includes(currentUser.occupation.companySector))
    },
    {
      title: 'Dietary Alignment',
      preference: profile.partnerPreferences.diet.join(', ') || 'Any',
      yourValue: currentUser.diet,
      isMatch: (profile.partnerPreferences.diet.length === 0 || profile.partnerPreferences.diet.includes(currentUser.diet))
    }
    ,...([
      ['Marital status', profile.partnerPreferences.maritalStatus, currentUser.maritalStatus],
      ['Education', profile.partnerPreferences.education, currentUser.education.degree],
      ['Preferred location', profile.partnerPreferences.preferredLocations, currentUser.city],
    ] as [string, string[], string][]).map(([title, preferences, value]) => ({
      title, preference: preferences.join(', ') || 'Any', yourValue: value || 'Not specified',
      isMatch: preferences.length === 0 || preferences.includes(value),
    })),
    { title: 'Manglik preference', preference: profile.partnerPreferences.manglikPreference,
      yourValue: currentUser.horoscope.manglik,
      isMatch: profile.partnerPreferences.manglikPreference === "Doesn't Matter" || profile.partnerPreferences.manglikPreference === currentUser.horoscope.manglik },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-red-100 overflow-hidden max-h-[92vh] flex flex-col text-zinc-800 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-[#FAFAFA] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C71F37] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#C71F37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#18181B]">
                  {profile.name}
                </h2>
                {profile.isOnline && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Online</span>}
                <span className="text-sm font-semibold text-zinc-500">
                  ({profile.age} yrs, {profile.height})
                </span>
                {profile.verification.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                    <ShieldCheck className="w-3 h-3 text-red-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                <span>Profile ID: {profile.id.toUpperCase()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-600" />
                  {profile.city}, {profile.state}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top Hero Section: Photo Gallery & Quick Verification Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Gallery Column (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 shadow-md">
                <img
                  src={profile.photos[selectedPhotoIdx]}
                  alt={profile.name}
                  className={`w-full h-full object-cover object-top transition-all duration-300 ${
                    isPhotoBlurred ? 'blur-xl scale-110' : ''
                  }`}
                />

                {isPhotoBlurred && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md p-4 text-center text-white">
                    <Lock className="w-8 h-8 text-red-300 mb-2" />
                    <p className="text-xs font-semibold">Photo Privacy Enabled</p>
                    <p className="text-[11px] text-zinc-200 mb-3">Visible upon mutual interest confirmation</p>
                    <button
                      type="button"
                      onClick={() => setHasRequestedPhotos(true)}
                      className="px-3.5 py-1.5 rounded-full bg-[#C71F37] text-xs font-bold text-white shadow-xs cursor-pointer"
                    >
                      {hasRequestedPhotos ? 'Request Pending' : 'Request Photo Access'}
                    </button>
                  </div>
                )}

                {/* Compatibility Badge Overlay */}
                <div className="absolute top-3 left-3 bg-[#C71F37] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <span>{profile.compatibilityScore}% Compatibility</span>
                </div>

                {/* Photo Blur Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsPhotoBlurred(!isPhotoBlurred)}
                  className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isPhotoBlurred ? 'Reveal' : 'Privacy Blur'}</span>
                </button>
              </div>

              {/* Thumbnails */}
              {profile.photos.length > 1 && (
                <div className="flex gap-2">
                  {profile.photos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoIdx(idx)}
                      className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedPhotoIdx === idx ? 'border-[#C71F37] ring-2 ring-red-200 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Checklist & Summary Stats (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Trust & Verification Badges */}
              <div className="p-4 bg-red-50/70 border border-red-200/90 rounded-2xl">
                <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>Trust & Credential Audit</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-red-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-red-600 mx-auto mb-1" />
                    <span className="font-semibold text-zinc-800 block">Govt ID</span>
                    <span className="text-[10px] text-red-700">100% Verified</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-red-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-red-600 mx-auto mb-1" />
                    <span className="font-semibold text-zinc-800 block">Mobile OTP</span>
                    <span className="text-[10px] text-red-700">Phone Verified</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-red-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-red-600 mx-auto mb-1" />
                    <span className="font-semibold text-zinc-800 block">Work / Degree</span>
                    <span className="text-[10px] text-red-700">Official Email</span>
                  </div>
                </div>
              </div>

              {/* Core Attributes Card */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#FAFAFA] p-3 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block font-medium">Profession</span>
                  <span className="font-bold text-zinc-900 text-sm">{profile.occupation.title}</span>
                  <span className="text-zinc-500 block truncate">{profile.occupation.employer}</span>
                </div>

                <div className="bg-[#FAFAFA] p-3 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block font-medium">Annual Income</span>
                  <span className="font-bold text-[#C71F37] text-sm">{profile.occupation.annualIncome}</span>
                  <span className="text-zinc-500 block">Tier {profile.occupation.incomeBracket}</span>
                </div>

                <div className="bg-[#FAFAFA] p-3 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block font-medium">Education</span>
                  <span className="font-bold text-zinc-900 text-sm truncate">{profile.education.degree}</span>
                  <span className="text-zinc-500 block truncate">{profile.education.college}</span>
                </div>

                <div className="bg-[#FAFAFA] p-3 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block font-medium">Community & Caste</span>
                  <span className="font-bold text-zinc-900 text-sm">{profile.religion}</span>
                  <span className="text-zinc-500 block">{profile.community} {profile.subCaste ? `(${profile.subCaste})` : ''}</span>
                </div>
              </div>

              {/* Horoscope High-Level Badge */}
              <div className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-200/70 text-red-800 flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4 text-[#C71F37]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Kundali / Horoscope Compatibility
                    </span>
                    <span className="text-xs text-zinc-600">
                      Nakshatra: {profile.horoscope.nakshatra} • Rasi: {profile.horoscope.rasi}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#C71F37] block">
                    {profile.horoscope.horoscopeMatchScore || 32} / 36 Gunas
                  </span>
                  <span className="text-[10px] font-semibold text-red-700 bg-red-100/70 px-2 py-0.5 rounded-full">
                    Auspicious Match
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-zinc-200 pt-2">
            <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto">
              {[
                { id: 'about', label: 'About & Lifestyle' },
                { id: 'career', label: 'Career & Education' },
                { id: 'family', label: 'Family & Horoscope' },
                { id: 'preferences', label: 'Partner Preferences Match' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#C71F37] text-[#C71F37]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content Areas */}
          <div className="py-2">
            
            {/* Tab 1: About & Lifestyle */}
            {activeTab === 'about' && (
              <div className="space-y-6 animate-fadeIn">
                <ProfileDetails profile={profile} />
                <div className="space-y-2 text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Personal Narrative</h4>
                  <p className="text-sm leading-relaxed text-zinc-700 bg-[#FAFAFA] p-4 rounded-2xl border border-zinc-200">
                    {profile.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hobbies */}
                  <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-2 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Passions &amp; Interests</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.hobbies.map((h, i) => (
                        <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Core Values */}
                  <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-2 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Life Principles & Values</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.values.map((v, i) => (
                        <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Habits */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                  <div className="bg-[#FAFAFA] p-3 rounded-xl border border-zinc-200">
                    <span className="text-[11px] text-zinc-400 block font-medium">Diet Habit</span>
                    <span className="text-xs font-bold text-zinc-800">{profile.diet}</span>
                  </div>
                  <div className="bg-[#FAFAFA] p-3 rounded-xl border border-zinc-200">
                    <span className="text-[11px] text-zinc-400 block font-medium">Drinking</span>
                    <span className="text-xs font-bold text-zinc-800">{profile.drink}</span>
                  </div>
                  <div className="bg-[#FAFAFA] p-3 rounded-xl border border-zinc-200">
                    <span className="text-[11px] text-zinc-400 block font-medium">Smoking</span>
                    <span className="text-xs font-bold text-zinc-800">{profile.smoke}</span>
                  </div>
                  <div className="bg-[#FAFAFA] p-3 rounded-xl border border-zinc-200">
                    <span className="text-[11px] text-zinc-400 block font-medium">Languages</span>
                    <span className="text-xs font-bold text-zinc-800 truncate block">
                      {profile.languagesSpoken.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Career & Education */}
            {activeTab === 'career' && (
              <div className="space-y-4 animate-fadeIn text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-3">
                    <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4 text-[#C71F37]" />
                      <span>Education Background</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{profile.education.degree}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{profile.education.college}</p>
                      <span className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                        Specialization: {profile.education.field}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-3">
                    <div className="flex items-center gap-2 text-[#C71F37] font-bold text-xs uppercase tracking-wider">
                      <Briefcase className="w-4 h-4 text-[#C71F37]" />
                      <span>Career & Employment</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{profile.occupation.title}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{profile.occupation.employer}</p>
                      <p className="text-xs text-zinc-600 mt-1">{profile.occupation.employmentType || 'Employment type not specified'} · {profile.occupation.companySector}</p>
                      <p className="text-xs text-[#C71F37] font-semibold mt-1">
                        Compensation: {profile.occupation.annualIncome} (Gross)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Family & Horoscope */}
            {activeTab === 'family' && (
              <div className="space-y-6 animate-fadeIn text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Family Background */}
                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-3">
                    <div className="flex items-center gap-2 text-zinc-800 font-bold text-xs uppercase tracking-wider">
                      <Home className="w-4 h-4 text-[#C71F37]" />
                      <span>Family Details</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-zinc-400 block font-medium">Family Structure</span>
                        <span className="font-semibold text-zinc-800">{profile.family.type} Family • {profile.family.values}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-medium">Father</span>
                        <span className="font-semibold text-zinc-800">{profile.family.fatherOccupation}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-medium">Mother</span>
                        <span className="font-semibold text-zinc-800">{profile.family.motherOccupation}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-medium">Siblings</span>
                        <span className="font-semibold text-zinc-800">{profile.family.siblings}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-medium">Native Ancestry</span>
                        <span className="font-semibold text-zinc-800">{profile.family.nativePlace}</span>
                      </div>
                    </div>
                  </div>

                  {/* Kundali & Astrological Data */}
                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-3">
                    <div className="flex items-center gap-2 text-[#C71F37] font-bold text-xs uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-[#C71F37]" />
                      <span>Astro & Kundali Attributes</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-zinc-400 block font-medium">Nakshatra (Birth Star)</span>
                        <span className="font-semibold text-zinc-800">{profile.horoscope.nakshatra}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-medium">Rasi (Moon Sign)</span>
                        <span className="font-semibold text-zinc-800">{profile.horoscope.rasi}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-medium">Manglik Status</span>
                        <span className="font-semibold text-zinc-800">{profile.horoscope.manglik}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-medium">Birth Details</span>
                        <span className="font-semibold text-zinc-800">{profile.horoscope.birthTime} ({profile.horoscope.birthPlace})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Partner Preferences Match */}
            {activeTab === 'preferences' && (
              <div className="space-y-4 animate-fadeIn text-left">
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C71F37] shrink-0" />
                  <span>
                    Comparing {profile.name.split(' ')[0]}'s desired partner criteria against your verified biodata:
                  </span>
                </div>

                <div className="space-y-2">
                  {preferencesComparison.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-white rounded-2xl border border-zinc-200 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-zinc-900 block">{item.title}</span>
                        <span className="text-[11px] text-zinc-500">
                          Looking for: <strong className="text-zinc-700">{item.preference}</strong>
                        </span>
                        <span className="text-[11px] text-zinc-500 block">
                          Your profile: <span className="text-zinc-700 font-medium">{item.yourValue}</span>
                        </span>
                      </div>

                      <div className="shrink-0">
                        {item.isMatch ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-[#C71F37] text-xs font-bold">
                            <Check className="w-3.5 h-3.5 text-[#C71F37]" />
                            Match
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium">
                            Does not match
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Floating Modal Footer Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
          
          <div className="flex items-center gap-2">
            {/* Shortlist Toggle */}
            <button
              type="button"
              onClick={() => onToggleShortlist(profile.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isShortlisted
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist Profile'}</span>
            </button>

            {/* Direct Message if mutual or interest accepted */}
            {isMutualMatch && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChat(profile);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start Direct Chat</span>
              </button>
            )}
          </div>

          {/* Express Interest Primary CTA */}
          <button
            type="button"
            onClick={() => onSendInterest(profile.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
              isInterestSent
                ? 'bg-red-50 text-red-800 border border-red-300'
                : 'bg-[#C71F37] hover:bg-[#A6192D] text-white shadow-red-900/15'
            }`}
          >
            {isInterestSent ? (
              <>
                <Check className="w-4 h-4 text-red-700" />
                <span>Interest Sent & Delivered</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-white fill-white/20" />
                <span>Express Interest</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
