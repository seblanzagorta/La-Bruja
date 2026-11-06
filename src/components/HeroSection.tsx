import React from 'react';
import { CelestialState, AgaveProfile } from '../types';

interface HeroSectionProps {
  celestialState: CelestialState;
  agaveMatch: AgaveProfile;
  onPreviewReading: () => void;
  onJoinBeta: () => void;
  onOpenBirthProfile: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  celestialState,
  agaveMatch,
  onPreviewReading,
  onJoinBeta,
  onOpenBirthProfile
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-5 lg:px-12 pt-8 lg:pt-12 pb-16 lg:pb-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Copy Column: ~47% (5 cols of 12) */}
        <div className="lg:col-span-5 flex flex-col gap-6 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e8e8e6] text-[#5b625e] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest">
              Daily Astrological Guidance
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6243] animate-pulse"></span>
          </div>

          <h1 className="font-['Barlow_Condensed'] text-display-hero text-[#1a1c1b] uppercase tracking-tighter leading-none">
            The sky picks <span className="text-[#b22b11] italic font-serif">tonight's</span> mezcal.
          </h1>

          <p className="font-['Manrope'] text-lg lg:text-xl text-[#5b625e] max-w-xl leading-relaxed">
            LA BRUJA reads the astrological calendar and reveals the artisanal agave style matched to this exact day, phase, and transit.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onJoinBeta}
              className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider rounded-full px-8 py-4 bg-[#b22b11] text-[#f0f3ee] text-center shadow-lg hover:bg-[#b83720] transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              Join the Beta
            </button>
            <button
              onClick={onPreviewReading}
              className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider rounded-full px-6 py-4 bg-[#f4f4f1] text-[#0c286f] text-center hover:bg-[#e2e3e0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Preview a Reading</span>
              <span className="material-symbols-outlined text-[18px]">south</span>
            </button>
          </div>

          {/* Personalized Reading Sub-action */}
          <div className="pt-1">
            <button
              onClick={onOpenBirthProfile}
              className="text-left text-xs font-semibold text-[#00298f] hover:text-[#0c286f] underline underline-offset-4 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span>Or calculate using your personal birth chart coordinates →</span>
            </button>
          </div>

          {/* Astrological Micro-Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#e2e3e0]/60">
            <div className="flex flex-col">
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#5b625e] tracking-wider">
                Moon Phase
              </span>
              <span className="font-['Barlow_Condensed'] text-xl font-extrabold leading-tight text-[#0c286f] mt-1">
                {celestialState.lunarPhase.name}
              </span>
              <span className="font-['Manrope'] text-xs text-[#5b625e] mt-0.5">
                {celestialState.solarSign} • {celestialState.lunarPhase.illumination}% illumination
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#5b625e] tracking-wider">
                Solar House
              </span>
              <span className="font-['Barlow_Condensed'] text-xl font-extrabold leading-tight text-[#0c286f] mt-1">
                {celestialState.solarHouse}
              </span>
              <span className="font-['Manrope'] text-xs text-[#5b625e] mt-0.5">
                {celestialState.fixedElement}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#5b625e] tracking-wider">
                Agave Pairing
              </span>
              <span className="font-['Barlow_Condensed'] text-xl font-extrabold leading-tight text-[#b22b11] mt-1 truncate">
                {agaveMatch.commonName}
              </span>
              <span className="font-['Manrope'] text-xs text-[#5b625e] mt-0.5 truncate">
                {agaveMatch.terroirOrigin.split(',')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Media Column: ~53% (7 cols of 12) */}
        <div className="lg:col-span-7 relative">
          <div className="relative w-full rounded-[18px] overflow-hidden shadow-2xl bg-[#171b1a] aspect-[4/3] lg:aspect-[16/11] group">
            <img
              alt="Smartphone resting on a rustic bar counter showing an astrological lunar chart beside a clay mezcal copita"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADGY1VwzmeVEybNaApRyjLvOYijjoV9iMV6L_ipdWKZldS2YHyAzUF-zMUYojDRcK_Py_N4ghnaBiPFqTtkUyfbU6ACY06SxqlzVh17BAYeWbU7KetgXPyhNoSlHbxwCb0668MvOVYYoR-b1FSXGPZTf1O77grSv27suhm18F6wzMMwuqDU-CdwsMAg8AijoufNHPwhZ4IkUx_jC0qWNdfLD21TxolX53Gp2KMfn1RMgmKkLgQBlI"
            />
            {/* Editorial Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#171b1a]/90 via-transparent to-black/20 pointer-events-none"></div>

            {/* Celestial Live Pill Overlay */}
            <div className="absolute top-4 left-4 bg-[#171b1a]/85 backdrop-blur-md rounded-full px-3.5 py-1.5 flex items-center gap-2 text-[#f0f3ee] border border-white/10 shadow-sm">
              <span className="text-[#efbf64] text-xs tracking-widest font-mono">
                {celestialState.localTimeCST}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#b22b11]"></span>
              <span className="font-['Barlow_Condensed'] text-xs uppercase tracking-widest text-[#e1e6e1]">
                Sky Coordinates Aligned
              </span>
            </div>

            {/* Bottom Caption Card */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#171b1a]/90 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0c286f]/80 flex items-center justify-center text-[#ffdea6] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider text-[#ffdea6]">
                    Astrological Calendar Interface
                  </span>
                  <span className="font-['Manrope'] text-xs text-[#f0f3ee]">
                    Paired with traditional artisanal copita &amp; wild terroir guide
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-block font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#abb3af] tracking-wider">
                LA BRUJA OS v1.4
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
