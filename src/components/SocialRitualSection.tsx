import React from 'react';
import { AgaveProfile } from '../types';

interface SocialRitualSectionProps {
  onSelectAgaveMonograph: (agaveId: string) => void;
}

export const SocialRitualSection: React.FC<SocialRitualSectionProps> = ({
  onSelectAgaveMonograph
}) => {
  return (
    <section className="w-full bg-[#eeeeec] py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Column (58%) */}
          <div className="lg:col-span-7 relative">
            <div className="rounded-[18px] overflow-hidden shadow-xl aspect-[16/10] bg-[#171b1a] relative group">
              <img
                alt="Hands of friends sharing mezcal served in traditional ceramic copitas across a rustic wooden table under warm starlight ambiance"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_Fj7K_AOwb2aq-FDm9NWpgqtZnPi_Lo9wr4r_9g8_l6cJm-3V7syhd0Wn9cbPbELOLsjlk0zZejCx1ZhGmhWyzrwjXlliAdQIvO9figBf48nRohOS8jdxNwuJKEOt5ICYkJV-0MXl702ZPyBBMSr9JpXGTMdqNYKaV9ZboesuRw7ZLRRI2GnKp9Z8vkQpvDheVSJguI8Ln3BVnNgi5YTJNoDlDSjdKWDDshyMUDRSC1ZaGb1KrDE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171b1a]/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#171b1a]/90 backdrop-blur rounded-xl text-[#f0f3ee] flex items-center justify-between border border-white/10">
                <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-widest text-[#ffdea6]">
                  Community Palenque Table
                </span>
                <span className="font-['Manrope'] text-xs text-[#abb3af]">
                  Shared ritual in Oaxaca Centro
                </span>
              </div>
            </div>
          </div>

          {/* Cobalt Copy Field (42%) */}
          <div className="lg:col-span-5 flex flex-col gap-6 bg-[#0c286f] text-[#f0f3ee] p-8 lg:p-10 rounded-[18px] shadow-2xl border border-white/10">
            <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#ffdea6]">
              Beyond The Default Order
            </span>
            <h2 className="font-['Barlow_Condensed'] text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-[#f0f3ee] leading-none">
              "A reason to taste beyond your usual bottle."
            </h2>
            <p className="font-['Manrope'] text-sm lg:text-base text-[#e1e6e1] leading-relaxed">
              Most people settle for whatever single bottle sits on their bar cart. LA BRUJA transforms your spirits cabinet into a living library of Mexican biodiversity and celestial cycles.
            </p>

            {/* Varietal Cards preview */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => onSelectAgaveMonograph('tobala')}
                className="p-3 rounded-lg bg-[#00298f]/40 hover:bg-[#00298f]/70 border border-white/10 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Barlow_Condensed'] text-base lg:text-lg font-bold text-[#ffdea6]">
                    TOBALÁ
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <span className="font-['Manrope'] text-[11px] text-[#e1e6e1] block mt-0.5">
                  Wild Shade Agave • Floral &amp; Herbaceous
                </span>
              </button>

              <button
                onClick={() => onSelectAgaveMonograph('tepeztate')}
                className="p-3 rounded-lg bg-[#00298f]/40 hover:bg-[#00298f]/70 border border-white/10 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Barlow_Condensed'] text-base lg:text-lg font-bold text-[#ffdea6]">
                    TEPEZTATE
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <span className="font-['Manrope'] text-[11px] text-[#e1e6e1] block mt-0.5">
                  25-Year Agave • High Mineral Spice
                </span>
              </button>

              <button
                onClick={() => onSelectAgaveMonograph('arroqueno')}
                className="p-3 rounded-lg bg-[#00298f]/40 hover:bg-[#00298f]/70 border border-white/10 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Barlow_Condensed'] text-base lg:text-lg font-bold text-[#ffdea6]">
                    ARROQUEÑO
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <span className="font-['Manrope'] text-[11px] text-[#e1e6e1] block mt-0.5">
                  Gigantic Piña • Cocoa &amp; Green Pepper
                </span>
              </button>

              <button
                onClick={() => onSelectAgaveMonograph('madrecuixe')}
                className="p-3 rounded-lg bg-[#00298f]/40 hover:bg-[#00298f]/70 border border-white/10 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Barlow_Condensed'] text-base lg:text-lg font-bold text-[#ffdea6]">
                    MADRECUIXE
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <span className="font-['Manrope'] text-[11px] text-[#e1e6e1] block mt-0.5">
                  Karwinskii Subspecies • Earth &amp; Graphite
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
