import React from 'react';

export const CulturalComplianceSection: React.FC = () => {
  return (
    <section className="w-full bg-[#eff2ed] py-12 border-t border-[#e2e3e0]/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-12">
        <div className="rounded-2xl bg-[#f4f4f1] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#e2e3e0]/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#e2e3e0] flex items-center justify-center text-[#0c286f] shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Barlow_Condensed'] text-lg font-bold text-[#1a1c1b] uppercase tracking-tight">
                Cultural Heritage &amp; Compliance Disclosure
              </span>
              <p className="font-['Manrope'] text-xs lg:text-sm text-[#5b625e] max-w-2xl leading-relaxed">
                LA BRUJA is a modern creative entertainment application inspired by Mesoamerican lunar cycles and classical astrology. It does not replace authentic indigenous ceremonial traditions. Drink reverently and responsibly. Must be 21+ to participate.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#5b625e] tracking-widest">
              ISO 21+ SAFE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00298f]"></span>
            <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#5b625e] tracking-widest">
              ZERO TRACKING COOKIES
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
