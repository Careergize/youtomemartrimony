import React from 'react';
import { 
  Heart, 
  Bookmark, 
  ShieldCheck, 
  Check, 
  Briefcase, 
  GraduationCap, 
  MapPin 
} from 'lucide-react';
import type { MatrimonialProfile } from '../data/mockProfiles';

interface ProfileCardProps {
  profile: MatrimonialProfile;
  onViewProfile: (profile: MatrimonialProfile) => void;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
  onPassProfile?: (id: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewProfile,
  onToggleShortlist,
  onSendInterest
}) => {
  const isShortlisted = !!profile.isShortlisted;
  const isInterestSent = profile.interestStatus === 'sent' || profile.interestStatus === 'accepted';

  // Format height helper
  const feet = Math.floor(profile.heightInches / 12);
  const inches = profile.heightInches % 12;
  const heightStr = `${feet}'${inches}"`;

  return (
    <article 
      onClick={() => onViewProfile(profile)}
      className="group bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-5px_rgba(5,150,105,0.12)] hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col relative text-left cursor-pointer transform hover:-translate-y-1"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/4.4] w-full overflow-hidden bg-slate-100 select-none">
        <img
          src={profile.photos[0]}
          alt={profile.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-103"
        />

        {/* Top Gradient for badge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />

        {/* Top-Left: Match Score Pill (Clean text, no star icon) */}
        <div className="absolute top-3 left-3 inline-flex items-center px-3 py-1 rounded-full bg-emerald-800/90 backdrop-blur-md border border-emerald-400/40 text-white text-xs font-bold shadow-md">
          <span>{profile.compatibilityScore}% Match</span>
        </div>

        {/* Top-Right: Quick Actions */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 flex items-center gap-1.5 z-10"
        >
          {profile.verification.isVerified && (
            <div 
              className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-emerald-700 shadow-sm"
              title="100% ID Verified"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          )}

          <button
            type="button"
            onClick={() => onToggleShortlist(profile.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isShortlisted
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-black/35 hover:bg-black/55 text-white'
            }`}
            title={isShortlisted ? 'Saved to Shortlist' : 'Add to Shortlist'}
          >
            <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-white text-white' : ''}`} />
          </button>
        </div>

        {/* Bottom of Photo: City & Online Status Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 font-medium bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-emerald-300" />
            <span>{profile.city}</span>
          </span>

          <span className="flex items-center gap-1.5 bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px]">
            <span className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
            <span>{profile.isOnline ? 'Active Now' : 'Verified'}</span>
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex flex-col justify-between flex-1 bg-white space-y-3.5">
        <div>
          {/* Row 1: Name, Age, Height */}
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {profile.name}
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {profile.age} Yrs • {heightStr}
            </span>
          </div>

          {/* Row 2: Profession */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium mt-2">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{profile.occupation.title}</span>
          </div>

          {/* Row 3: Education */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{profile.education.degree}</span>
          </div>

          {/* Community & Caste Tag Pill */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-100">
              {profile.religion} • {profile.community}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
              {profile.motherTongue}
            </span>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="pt-2 border-t border-slate-100 flex items-center gap-2"
        >
          {/* Secondary: View Biodata */}
          <button
            type="button"
            onClick={() => onViewProfile(profile)}
            className="flex-1 py-2 rounded-xl border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/40"
          >
            Biodata
          </button>

          {/* Primary: Send Interest */}
          <button
            type="button"
            onClick={() => onSendInterest(profile.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
              isInterestSent
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-[#059669] hover:bg-[#047857] text-white shadow-emerald-900/15'
            }`}
          >
            {isInterestSent ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 fill-white/20" />
                <span>Connect</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
};
