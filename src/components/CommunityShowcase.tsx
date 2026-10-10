import React from 'react';
import { ArrowRight, Users, CheckCircle2 } from 'lucide-react';

interface CommunityShowcaseProps {
  onSelectCommunity: (community: string) => void;
}

export const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({ onSelectCommunity }) => {
  const communities = [
    { name: 'Malayali Matrimony', count: '1,840+ Profiles', tag: 'Malayalam' },
    { name: 'Tamil Matrimony', count: '2,150+ Profiles', tag: 'Tamil' },
    { name: 'Telugu Matrimony', count: '1,420+ Profiles', tag: 'Telugu' },
    { name: 'Kannada Matrimony', count: '1,190+ Profiles', tag: 'Kannada' },
    { name: 'Syrian Christian', count: '980+ Profiles', tag: 'Christian' },
    { name: 'Nair & Menon', count: '1,340+ Profiles', tag: 'Nair' },
    { name: 'Brahmin Alliances', count: '1,050+ Profiles', tag: 'Brahmin' },
    { name: 'Muslim Matrimony', count: '1,280+ Profiles', tag: 'Muslim' },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-red-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-red-600" />
              <span>Community Alliances</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight">
              Explore by Community &amp; Culture
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              Find partners who celebrate the same regional festivals, rituals, and family traditions.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#C71F37]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Over 50+ Regional Traditions Supported</span>
          </div>
        </div>

        {/* 4x2 Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {communities.map((c, i) => (
            <div
              key={i}
              onClick={() => onSelectCommunity(c.tag)}
              className="p-5 rounded-2xl bg-zinc-50/60 border border-zinc-200/80 hover:bg-red-50/50 hover:border-red-400 hover:shadow-md transition-all duration-200 cursor-pointer text-left group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C71F37] bg-red-100/70 px-2 py-0.5 rounded">
                  {c.tag}
                </span>
                <h3 className="font-serif text-base font-bold text-zinc-900 group-hover:text-[#C71F37] transition-colors mt-2">
                  {c.name}
                </h3>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-200/60">
                <span className="font-medium">{c.count}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#C71F37] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
