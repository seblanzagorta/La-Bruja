import React from 'react';

interface FooterProps {
  onOpenMethod: () => void;
  onClearData: () => void;
  hasStoredData: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMethod,
  onClearData,
  hasStoredData
}) => {
  return (
    <footer className="w-full bg-[#171b1a] text-[#f0f3ee] pt-16 lg:pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-12 flex flex-col gap-12 lg:gap-16">
        {/* Top brand header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-['Barlow_Condensed'] text-headline-card uppercase tracking-tight text-[#f0f3ee]">
              LA BRUJA
            </span>
            <p className="font-['Manrope'] text-xs lg:text-sm text-[#abb3af]">
              Cosmic Agave Rituals &amp; Astrological Spirits Monograph
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c286f]/60 text-[#ffdea6] font-['Barlow_Condensed'] text-xs font-bold uppercase border border-white/10">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Strictly 21+ Verification Mandate</span>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-[#abb3af] font-['Manrope'] text-xs lg:text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#f0f3ee] tracking-wider">
              Age Verification
            </span>
            <p className="leading-relaxed">
              You must be of legal drinking age (21 years or older in the United States, or legal age in your jurisdiction) to interact with this platform or acquire agave offerings.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#f0f3ee] tracking-wider">
              Responsible Ritual
            </span>
            <p className="leading-relaxed">
              Agave spirits embody ancient ritual, craftsmanship, and balance. Drink mindfully and reverently. Never consume spirits before or while operating machinery.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#f0f3ee] tracking-wider">
              Cultural Heritage
            </span>
            <p className="leading-relaxed">
              Rooted in authentic Oaxacan and Jalisco heritage, honoring ancestral mezcaleros, celestial wisdom, and traditional botanical stewardship.
            </p>
          </div>
        </div>

        {/* Bottom controls & legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-[#abb3af] font-['Manrope'] text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <p>© 2025 LA BRUJA Spirits Co. All rights reserved.</p>
            <button
              onClick={onOpenMethod}
              className="hover:text-white underline underline-offset-2 cursor-pointer font-['Barlow_Condensed'] uppercase tracking-wider text-xs"
            >
              Methodology &amp; Sponsorship Policy
            </button>
            {hasStoredData && (
              <button
                onClick={onClearData}
                className="text-red-400 hover:text-red-300 underline underline-offset-2 cursor-pointer font-['Barlow_Condensed'] uppercase tracking-wider text-xs"
                title="Deletes your birth profile and reading from local browser storage"
              >
                Delete My Stored Data
              </button>
            )}
          </div>
          <p className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider text-[#e1e6e1]/80">
            Crafted with Celestial Geometry &amp; Ancient Agave Lore
          </p>
        </div>
      </div>
    </footer>
  );
};
