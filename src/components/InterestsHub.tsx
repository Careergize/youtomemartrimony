import React, { useState } from 'react';
import { 
  Heart, 
  Check, 
  X, 
  MessageCircle, 
  Bookmark, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import type { MatrimonialProfile } from '../data/mockProfiles';

interface InterestsHubProps {
  profiles: MatrimonialProfile[];
  onAcceptInterest: (id: string) => void;
  onDeclineInterest: (id: string) => void;
  onSendInterest: (id: string) => void;
  onToggleShortlist: (id: string) => void;
  onViewProfile: (profile: MatrimonialProfile) => void;
  onOpenChat: (profile: MatrimonialProfile) => void;
  onBackToDiscovery: () => void;
  defaultSubTab?: 'received' | 'sent' | 'shortlist' | 'mutual';
}

export const InterestsHub: React.FC<InterestsHubProps> = ({
  profiles,
  onAcceptInterest,
  onDeclineInterest,
  onSendInterest,
  onToggleShortlist,
  onViewProfile,
  onOpenChat,
  onBackToDiscovery,
  defaultSubTab = 'received'
}) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'shortlist' | 'mutual'>(defaultSubTab);

  const receivedList = profiles.filter((p) => p.interestStatus === 'received');
  const sentList = profiles.filter((p) => p.interestStatus === 'sent');
  const shortlistedList = profiles.filter((p) => p.isShortlisted);
  const mutualList = profiles.filter((p) => p.interestStatus === 'accepted');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-red-100">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B]">
            Interests & Connections Hub
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your incoming invitations, sent proposals, shortlisted suitors, and mutual matchmaking conversations.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToDiscovery}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 hover:border-red-300 text-xs font-bold text-zinc-700 hover:text-[#C71F37] bg-white transition-all shadow-xs"
        >
          <span>Explore More Profiles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-100/90 rounded-2xl max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'received'
              ? 'bg-white text-[#C71F37] shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Received ({receivedList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sent')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sent'
              ? 'bg-white text-[#C71F37] shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Sent ({sentList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shortlist')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'shortlist'
              ? 'bg-white text-[#C71F37] shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Shortlisted ({shortlistedList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mutual')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'mutual'
              ? 'bg-white text-[#C71F37] shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#C71F37]" />
          <span>Mutual Matches ({mutualList.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      
      {/* 1. Interests Received */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 space-y-3">
              <Heart className="w-12 h-12 text-zinc-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-zinc-700">No Pending Invitations</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                You have addressed all connection requests. As other verified members discover your biodata, new interests will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {receivedList.map((profile) => (
                <div 
                  key={profile.id}
                  className="bg-white rounded-3xl p-5 border border-red-100 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-4 text-left"
                >
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-24 h-28 rounded-2xl object-cover ring-1 ring-zinc-200 shrink-0 cursor-pointer"
                    onClick={() => onViewProfile(profile)}
                  />
                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex items-center justify-between">
                      <h4 
                        onClick={() => onViewProfile(profile)}
                        className="font-serif text-lg font-bold text-zinc-900 hover:text-[#C71F37] cursor-pointer"
                      >
                        {profile.name}
                      </h4>
                      <span className="text-[11px] font-bold text-[#C71F37] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                        {profile.compatibilityScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600">
                      {profile.age} yrs • {profile.height} • {profile.city}
                    </p>
                    <p className="text-xs font-medium text-zinc-800 truncate">
                      {profile.occupation.title} ({profile.education.degree})
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => onAcceptInterest(profile.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#C71F37] hover:bg-[#A6192D] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Connect</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeclineInterest(profile.id)}
                        className="px-3 py-2 rounded-xl border border-zinc-200 text-zinc-500 hover:text-red-700 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Decline
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewProfile(profile)}
                        className="px-3 py-2 rounded-xl bg-zinc-50 text-zinc-700 hover:bg-zinc-100 text-xs font-semibold"
                      >
                        Biodata
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Interests Sent */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 space-y-3">
              <Clock className="w-12 h-12 text-zinc-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-zinc-700">No Outgoing Proposals</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                You haven't sent any interests yet. Browse through recommendations and tap 'Connect' to initiate contact.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentList.map((profile) => (
                <div 
                  key={profile.id}
                  className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center gap-4 text-left"
                >
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-24 h-28 rounded-2xl object-cover ring-1 ring-zinc-200 shrink-0 cursor-pointer"
                    onClick={() => onViewProfile(profile)}
                  />
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <h4 
                        onClick={() => onViewProfile(profile)}
                        className="font-serif text-lg font-bold text-zinc-900 hover:text-[#C71F37] cursor-pointer"
                      >
                        {profile.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Awaiting Response
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600">
                      {profile.age} yrs • {profile.occupation.title} • {profile.city}
                    </p>

                    <p className="text-[11px] text-zinc-500 italic">
                      Sent to verified candidate • Notified via SMS & Email
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onViewProfile(profile)}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700"
                      >
                        View Biodata
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleShortlist(profile.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-600 hover:text-amber-600"
                      >
                        {profile.isShortlisted ? 'Saved in Shortlist' : 'Add to Shortlist'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Shortlisted Profiles */}
      {activeTab === 'shortlist' && (
        <div className="space-y-4">
          {shortlistedList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 space-y-3">
              <Bookmark className="w-12 h-12 text-zinc-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-zinc-700">No Shortlisted Profiles Yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Bookmark standout suitors with the Bookmark icon while browsing discovery feed to review them later with your family.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortlistedList.map((profile) => (
                <div 
                  key={profile.id}
                  className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between text-left space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="w-20 h-24 rounded-2xl object-cover ring-1 ring-zinc-200 shrink-0 cursor-pointer"
                      onClick={() => onViewProfile(profile)}
                    />
                    <div className="space-y-1">
                      <h4 
                        onClick={() => onViewProfile(profile)}
                        className="font-serif text-lg font-bold text-zinc-900 hover:text-[#C71F37] cursor-pointer"
                      >
                        {profile.name}
                      </h4>
                      <p className="text-xs text-zinc-600">{profile.age} yrs • {profile.city}</p>
                      <p className="text-xs font-medium text-zinc-800 truncate">{profile.occupation.title}</p>
                      <span className="inline-block text-[10px] font-bold text-[#C71F37] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                        {profile.compatibilityScore}% Compatibility
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => onToggleShortlist(profile.id)}
                      className="text-xs font-semibold text-zinc-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewProfile(profile)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-700"
                      >
                        Biodata
                      </button>

                      <button
                        type="button"
                        onClick={() => onSendInterest(profile.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          profile.interestStatus === 'sent' || profile.interestStatus === 'accepted'
                            ? 'bg-red-50 text-[#C71F37] border border-red-200'
                            : 'bg-[#C71F37] hover:bg-[#A6192D] text-white hover:opacity-95'
                        }`}
                      >
                        {profile.interestStatus === 'sent' ? 'Sent' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Mutual Matches (Unlocked direct messaging) */}
      {activeTab === 'mutual' && (
        <div className="space-y-4">
          {mutualList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 space-y-3">
              <MessageCircle className="w-12 h-12 text-zinc-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-zinc-700">No Mutual Matches Yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                You can message any member directly. Open Messages to start a conversation, or accept an interest to connect and make calls.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mutualList.map((profile) => (
                <div 
                  key={profile.id}
                  className="bg-gradient-to-br from-white via-white to-red-50/40 rounded-3xl p-6 border border-red-200 shadow-md flex flex-col sm:flex-row items-center gap-5 text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#C71F37] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    Mutual Connection
                  </div>

                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-24 h-28 rounded-2xl object-cover ring-2 ring-red-200 shrink-0 cursor-pointer"
                    onClick={() => onViewProfile(profile)}
                  />

                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <h4 
                        onClick={() => onViewProfile(profile)}
                        className="font-serif text-xl font-bold text-zinc-900 hover:text-[#C71F37] cursor-pointer"
                      >
                        {profile.name}
                      </h4>
                      <p className="text-xs text-red-800 font-semibold mt-0.5">
                        Direct messaging and verified contacts are now unlocked!
                      </p>
                    </div>

                    <p className="text-xs text-zinc-600">
                      {profile.age} yrs • {profile.occupation.title} • {profile.city}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenChat(profile)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C71F37] hover:bg-[#A6192D] text-white text-xs font-bold shadow-md shadow-red-900/15 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat with {profile.name.split(' ')[0]}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewProfile(profile)}
                        className="px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700"
                      >
                        View Biodata
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
