import React from 'react';

interface PhilosophicalStatementProps {
  onOpenMethod: () => void;
}

export const PhilosophicalStatement: React.FC<PhilosophicalStatementProps> = ({ onOpenMethod }) => {
  return (
    <section className="w-full bg-[#e1e6e1] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-baseline">
          <div className="lg:col-span-6">
            <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#b22b11] tracking-widest block mb-3">
              Philosophical Clarification
            </span>
            <h2 className="font-['Barlow_Condensed'] text-headline-section text-[#1a1c1b] uppercase tracking-tighter leading-none">
              An astrological calendar for choosing mezcal.
            </h2>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4 pl-0 lg:pl-8">
            <p className="font-['Manrope'] text-lg lg:text-xl text-[#1a1c1b] leading-relaxed">
              <strong className="font-semibold text-[#0c286f]">LA BRUJA is not another bottle label.</strong> We do not distill, bottle, or commercialize spirits under our own name. It is a daily celestial compass that connects the astrological temper of the evening with a rare or classic agave varietal to discover.
            </p>

            <p className="font-['Manrope'] text-base text-[#5b625e] leading-relaxed">
              Rather than relying on generic tasting menus or repetitive orders, users consult the sky to navigate Oaxaca and Jalisco's biodiversity—from wild Tepeztates aged twenty-five years to mineral-rich Espadines crafted by generational palenqueros.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-[#5b625e]">
              <div className="flex items-center gap-1.5 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-[#b22b11]">close</span>
                <span>No Generic Palettes</span>
              </div>
              <div className="flex items-center gap-1.5 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-[#0c286f]">check</span>
                <span>100% Celestial Logic</span>
              </div>
              <div className="flex items-center gap-1.5 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-[#0c286f]">check</span>
                <span>Independent Curation</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenMethod}
                className="text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider text-[#0c286f] hover:text-[#00298f] flex items-center gap-1 cursor-pointer underline underline-offset-4"
              >
                <span>Read our Methodology, Cultural Inspiration &amp; Responsibility Charter</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
