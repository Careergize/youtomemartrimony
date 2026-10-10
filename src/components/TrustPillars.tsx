import React from 'react';
import { ShieldCheck, HeartHandshake, Lock, PhoneCall, CheckCircle2 } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      color: 'text-[#C71F37]',
      bg: 'bg-red-50 border-red-100',
      title: '100% ID Verified Biodata',
      desc: 'Every single profile is verified via Govt ID and mobile OTP before activation, ensuring real brides and grooms.'
    },
    {
      icon: Lock,
      color: 'text-red-700',
      bg: 'bg-red-50 border-red-100',
      title: 'Complete Privacy Protection',
      desc: 'Your photos and telephone numbers remain shielded and are shared only when you accept an interest request.'
    },
    {
      icon: HeartHandshake,
      color: 'text-[#C71F37]',
      bg: 'bg-red-50 border-red-100',
      title: 'Family-Oriented Values',
      desc: 'Built specifically for educated families looking for lifelong companionship with complete cultural alignment.'
    },
    {
      icon: PhoneCall,
      color: 'text-red-800',
      bg: 'bg-red-50 border-red-100',
      title: 'Dedicated Helpline & Support',
      desc: 'Our relationship managers are available 7 days a week to guide parents and candidates through the matching process.'
    }
  ];

  return (
    <section className="py-14 sm:py-16 bg-[#FAFAFA] border-b border-red-100/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100/80 border border-red-200 text-[#A6192D] text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
            <span>The YOU2ME Promise</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#18181B] tracking-tight">
            Why Families Love YOU2ME
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Honest, safe, and family-friendly matchmaking with verified members and zero fake profiles.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white border border-zinc-200/90 hover:border-red-300 hover:shadow-lg transition-all duration-300 space-y-3.5 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} border flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#C71F37] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {item.desc}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#C71F37]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                  <span>100% Genuine</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
