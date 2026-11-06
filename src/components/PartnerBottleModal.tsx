import React from 'react';
import { AgaveProfile } from '../types';

interface PartnerBottleModalProps {
  agave: AgaveProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerBottleModal: React.FC<PartnerBottleModalProps> = ({
  agave,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const bottle = agave.partnerProduct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#171b1a] text-[#f0f3ee] rounded-2xl shadow-2xl border border-white/15 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#0c286f] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex flex-col">
            <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#ffdea6]">
              Illustrative Product Example
            </span>
            <h3 className="font-['Barlow_Condensed'] text-2xl font-bold uppercase tracking-tight">
              {bottle.bottleName}
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

        {/* Content Body */}
        <div className="p-6 lg:p-8 overflow-y-auto flex flex-col gap-6 text-sm font-['Manrope']">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#292f2d] border border-white/5">
            <div>
              <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#abb3af] block">ABV</span>
              <span className="font-mono text-base text-[#ffdea6] font-semibold">{bottle.abv}</span>
            </div>
            <div>
              <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#abb3af] block">MSRP</span>
              <span className="font-mono text-base text-white font-semibold">{bottle.msrp}</span>
            </div>
            <div>
              <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#abb3af] block">Agave Age</span>
              <span className="text-white font-medium">{bottle.harvestAge}</span>
            </div>
            <div>
              <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#abb3af] block">Still Type</span>
              <span className="text-white font-medium truncate">{bottle.distillationType.split(',')[0]}</span>
            </div>
          </div>

          {/* Provenance & Mezcalero */}
          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#ffdea6] tracking-wider">
              Provenance &amp; Palenquero
            </span>
            <p className="text-[#e1e6e1] leading-relaxed">
              Crafted in <strong className="text-white">{bottle.palenqueLocation}</strong> under the direct supervision of Maestro Mezcalero <strong className="text-white">{bottle.maestroMezcalero}</strong>.
            </p>
            <p className="text-xs text-[#abb3af] leading-relaxed">
              Distillation: {bottle.distillationType}.
            </p>
          </div>

          {/* Tasting & Terroir Notes */}
          <div className="p-4 rounded-xl bg-[#0c286f]/30 border border-white/10 flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#ffdea6] tracking-wider">
              Sensory Profile &amp; Pairing
            </span>
            <p className="text-sm text-white leading-relaxed">
              {agave.flavorProfile}
            </p>
            <div className="pt-2 border-t border-white/10 text-xs text-[#abb3af]">
              <strong className="text-[#e1e6e1]">Copita Serving Ritual:</strong> Sip at cellar room temperature (18–20°C) from a traditional wide clay copita or veladora glass. Never consume as a shot; let the complex volatile esters awaken on the palate.
            </div>
          </div>

          {/* Non-affiliation and Educational Disclosure */}
          <div className="p-3.5 rounded-lg bg-[#292f2d]/60 border border-white/5 text-xs text-[#abb3af] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#efbf64] shrink-0">info</span>
            <div>
              <strong className="text-[#ffdea6]">Illustrative Notice:</strong> {bottle.sponsorshipDisclosure} LA BRUJA does not sell or distribute spirits, nor receive sponsorship fees. Provided for educational and cultural reference.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#292f2d] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-[#abb3af]">
            Reference Profile ID: {bottle.id.toUpperCase()}-2025
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#f0f3ee] font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider cursor-pointer"
            >
              Back to Reading
            </button>
            <a
              href={bottle.retailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#b22b11] hover:bg-[#b83720] text-white font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider text-center shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Explore Producer Reference</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
