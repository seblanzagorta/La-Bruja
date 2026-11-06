import React from 'react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-[#eff2ed] py-16 lg:py-24" id="how-it-works">
      <div className="max-w-7xl mx-auto px-5 lg:px-12">
        <div className="flex flex-col gap-2 mb-12 lg:mb-16">
          <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#b22b11] tracking-widest">
            The Daily Architecture
          </span>
          <h2 className="font-['Barlow_Condensed'] text-headline-section text-[#1a1c1b] uppercase tracking-tight leading-none">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {/* Step 01 */}
          <div className="flex flex-col gap-4 pr-0 md:pr-4">
            <div className="flex items-baseline justify-between border-b border-[#e2e3e0] pb-3">
              <span className="font-['Barlow_Condensed'] text-3xl lg:text-4xl font-black text-[#0c286f]">
                01
              </span>
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#5b625e]">
                Astro Sync
              </span>
            </div>
            <h3 className="font-['Barlow_Condensed'] text-headline-card uppercase text-[#1a1c1b]">
              Open The Day
            </h3>
            <p className="font-['Manrope'] text-sm lg:text-base text-[#5b625e] leading-relaxed">
              Open the app at twilight to check planetary alignments, lunar mansions, and celestial aspects calibrated to your precise location and the nocturnal sky.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[#0c286f] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">routine</span>
              <span>Real-time celestial updates</span>
            </div>
          </div>

          {/* Step 02 */}
          <div className="flex flex-col gap-4 pr-0 md:pr-4">
            <div className="flex items-baseline justify-between border-b border-[#e2e3e0] pb-3">
              <span className="font-['Barlow_Condensed'] text-3xl lg:text-4xl font-black text-[#b22b11]">
                02
              </span>
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#5b625e]">
                Terroir Match
              </span>
            </div>
            <h3 className="font-['Barlow_Condensed'] text-headline-card uppercase text-[#1a1c1b]">
              Get The Pairing
            </h3>
            <p className="font-['Manrope'] text-sm lg:text-base text-[#5b625e] leading-relaxed">
              Our algorithmic engine pairs the day's astrological tension with the matching agave varietal, balance of minerality, fermentation style, and smoke profile.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[#b22b11] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">balance</span>
              <span>Botanical balance engine</span>
            </div>
          </div>

          {/* Step 03 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between border-b border-[#e2e3e0] pb-3">
              <span className="font-['Barlow_Condensed'] text-3xl lg:text-4xl font-black text-[#0c286f]">
                03
              </span>
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#5b625e]">
                Savor &amp; Learn
              </span>
            </div>
            <h3 className="font-['Barlow_Condensed'] text-headline-card uppercase text-[#1a1c1b]">
              Choose Your Pour
            </h3>
            <p className="font-['Manrope'] text-sm lg:text-base text-[#5b625e] leading-relaxed">
              Discover artisanal mezcalero histories, authentic Copita serving rituals, and independently verified bottles or cocktail specifications for the evening.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[#0c286f] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Ethically sourced agave</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
