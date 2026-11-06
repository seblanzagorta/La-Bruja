import React from 'react';

interface MethodResponsibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodResponsibilityModal: React.FC<MethodResponsibilityModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#171b1a] text-[#f0f3ee] rounded-2xl shadow-2xl border border-white/15 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#0c286f] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex flex-col">
            <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#ffdea6]">
              LA BRUJA Monograph &amp; Governance
            </span>
            <h3 className="font-['Barlow_Condensed'] text-2xl font-bold uppercase tracking-tight">
              Methodology, Ethics &amp; Responsibility Charter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 lg:p-8 overflow-y-auto flex flex-col gap-6 text-sm font-['Manrope'] leading-relaxed">
          {/* Section 1 */}
          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-base uppercase font-bold text-[#ffdea6] tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>1. Mesoamerican Inspiration &amp; Entertainment Notice</span>
            </span>
            <p className="text-[#e1e6e1]">
              LA BRUJA is an original creative entertainment platform inspired by the richness of Mesoamerican timekeeping traditions and classical Hellenistic astrology. It is designed to foster reverence, curiosity, and cultural appreciation for Mexican agave biodiversity. It does not claim to reproduce, replace, or speak for sacred indigenous ceremonial rites.
            </p>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-base uppercase font-bold text-[#ffdea6] tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">balance</span>
              <span>2. Deterministic Botanical Matching Engine</span>
            </span>
            <p className="text-[#e1e6e1]">
              Unlike generic cocktail chatbots, LA BRUJA runs entirely on deterministic rules:
            </p>
            <ul className="list-disc pl-5 text-[#abb3af] space-y-1 text-xs">
              <li>
                <strong className="text-white">Solar Natal Polarity:</strong> Maps the natal sun into one of four botanical elements (Water, Earth, Fire, Air).
              </li>
              <li>
                <strong className="text-white">Active Nocturnal Transit:</strong> Combines current lunar phase illumination (0–100%) and twilight solar house alignment.
              </li>
              <li>
                <strong className="text-white">Agave Terroir Matching:</strong> Pairs volatile energetic moments with balancing agave varieties—from high-energy Espadín to 25-year cliffside Tepeztate.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-base uppercase font-bold text-[#ffdea6] tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>3. Commercial Transparency &amp; Brand Curation</span>
            </span>
            <p className="text-[#e1e6e1]">
              LA BRUJA does not distill, bottle, or commercialize spirits under its own trademark. Partner bottle recommendations are curated independently based on palenque authenticity, maestro mezcalero verification, and ethical harvesting. Brands pay a placement and distribution fee for verified bottle showcases, but commercial terms never alter the underlying celestial logic.
            </p>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-base uppercase font-bold text-[#ffdea6] tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span>4. Absolute Client-Side Privacy Guarantee</span>
            </span>
            <p className="text-[#e1e6e1]">
              Your birth date, time, and coordinates are processed strictly inside your personal browser sandbox. No personal identity data is stored on remote servers, sold to advertisers, or passed into external third-party tracking networks. You may permanently delete all cached browser records at any time using the "Delete My Stored Data" control in the footer.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-4 rounded-xl bg-[#292f2d] border border-white/10 flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-base uppercase font-bold text-[#ffdea6] tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#b22b11]">warning</span>
              <span>5. 21+ Mandate &amp; Mindful Agave Stewardship</span>
            </span>
            <p className="text-xs text-[#abb3af]">
              Mezcal is sacred botanical craft requiring upwards of a quarter-century of solar accumulation in single piñas. Drink slowly, reverently, and mindfully. Never drink and drive. Never operate machinery under the influence. This platform is strictly restricted to individuals of legal drinking age (21+ in the United States or equivalent local jurisdiction).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#292f2d] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-[#b22b11] hover:bg-[#b83720] text-white font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider cursor-pointer"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
