import React, { useState } from 'react';
import { AgaveProfile, CelestialState, LunarPhaseKey } from '../types';
import { LUNAR_PHASES } from '../utils/celestial';
import { LunarPhaseVisualizer } from './LunarPhaseVisualizer';

interface DailyReadingSectionProps {
  celestialState: CelestialState;
  agave: AgaveProfile;
  activePhaseKey: LunarPhaseKey;
  onSelectPhase: (phaseKey: LunarPhaseKey) => void;
  onViewBottle: (agave: AgaveProfile) => void;
  onOpenBirthProfile: () => void;
  isPersonalReading?: boolean;
}

export const DailyReadingSection: React.FC<DailyReadingSectionProps> = ({
  celestialState,
  agave,
  activePhaseKey,
  onSelectPhase,
  onViewBottle,
  onOpenBirthProfile,
  isPersonalReading
}) => {
  const [copiedToast, setCopiedToast] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleFetchMaestroGuidance = async () => {
    if (aiGuidance) {
      setAiGuidance(null);
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/gemini/reading-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agaveName: agave.commonName,
          lunarPhase: celestialState.lunarPhase.name,
          illumination: celestialState.lunarPhase.illumination,
          solarHouse: celestialState.solarHouse,
          birthSign: celestialState.solarSign
        })
      });
      const data = await res.json();
      setAiGuidance(data.guidance || data.fallback);
    } catch {
      setAiGuidance(`Under tonight's ${celestialState.lunarPhase.name} transit, honor the slow solar maturation of ${agave.commonName}. Sip reverently from a shallow copita.`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleShare = () => {
    const shareText = `✦ LA BRUJA CELESTIAL AGAVE READING ✦
Tonight's Sky Match: ${agave.commonName} (${agave.scientificName})
Lunar Phase: ${celestialState.lunarPhase.name} (${celestialState.lunarPhase.illumination}% illumination)
Transit: ${agave.astrologicalEnergy}
Archetype: ${agave.archetypeTitle} — ${agave.personalityDescription}
Tasting Notes: ${agave.flavorProfile}
Occasion: ${agave.occasionAndRitual}
Bottle: ${agave.partnerProduct.bottleName} (${agave.partnerProduct.msrp})`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const currentIndex = LUNAR_PHASES.findIndex((p) => p.key === activePhaseKey);

  const handleNextPhase = () => {
    const nextIdx = (currentIndex + 1) % LUNAR_PHASES.length;
    onSelectPhase(LUNAR_PHASES[nextIdx].key);
  };

  const handlePrevPhase = () => {
    const prevIdx = (currentIndex - 1 + LUNAR_PHASES.length) % LUNAR_PHASES.length;
    onSelectPhase(LUNAR_PHASES[prevIdx].key);
  };

  return (
    <section className="w-full bg-[#171b1a] py-16 lg:py-24 text-[#f0f3ee]" id="sample-reading">
      <div className="max-w-7xl mx-auto px-5 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Explanatory Column */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8e8e6]/10 text-[#ffdea6] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest w-fit border border-white/10">
              <span className="material-symbols-outlined text-[14px]">explore</span>
              <span>{isPersonalReading ? 'Personal Birth Chart Match' : 'Concept Preview • Real-Time Alignment'}</span>
            </div>

            <h2 className="font-['Barlow_Condensed'] text-headline-card uppercase tracking-tight text-[#f0f3ee]">
              Daily Ritual Decoded
            </h2>

            <p className="font-['Manrope'] text-sm lg:text-base text-[#abb3af] leading-relaxed">
              Each evening at dusk, LA BRUJA computes the day's solar position, lunar cycle, and planetary aspects to synthesize an agave energetic profile.
            </p>

            {/* Dynamic SVG Lunar Observatory Visualizer */}
            <div className="p-5 rounded-2xl bg-[#292f2d]/90 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner group">
              {/* Subtle background star constellation field */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffdea6_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Visualizer header controls */}
                <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-white/10 text-xs">
                  <span className="font-['Barlow_Condensed'] uppercase tracking-widest text-[#ffdea6] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">bedtime</span>
                    <span>Nocturnal Disc</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevPhase}
                      className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-[#abb3af] hover:text-white transition-colors cursor-pointer"
                      title="Previous lunar phase"
                      aria-label="Previous lunar phase"
                    >
                      <span className="material-symbols-outlined text-[14px]">chevron_left</span>
                    </button>
                    <span className="font-mono text-[11px] text-[#efbf64]">
                      {currentIndex + 1}/8
                    </span>
                    <button
                      onClick={handleNextPhase}
                      className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-[#abb3af] hover:text-white transition-colors cursor-pointer"
                      title="Next lunar phase"
                      aria-label="Next lunar phase"
                    >
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* SVG Rendered Moon with astronomical arc */}
                <LunarPhaseVisualizer
                  phaseKey={activePhaseKey}
                  illumination={celestialState.lunarPhase.illumination}
                  phaseName={celestialState.lunarPhase.name}
                  size={164}
                  showOrbits={true}
                  className="my-1"
                />

                {/* Interactive Status Footer */}
                <div className="w-full mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-[#ffdea6]">
                    {celestialState.lunarPhase.name}
                  </span>
                  <span className="font-mono text-xs text-[#abb3af]">
                    {celestialState.lunarPhase.illumination}% Illumination
                  </span>
                </div>
              </div>
            </div>

            {/* Lunar Phase Glyph Selector */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider text-[#abb3af]">
                  Current Lunar Phase Track
                </span>
                <span className="text-[11px] font-mono text-[#efbf64]">Interactive Explorer</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#292f2d] text-[#ffdea6] text-xl border border-white/5 shadow-inner">
                {LUNAR_PHASES.map((phase) => {
                  const isActive = phase.key === activePhaseKey;
                  return (
                    <button
                      key={phase.key}
                      onClick={() => onSelectPhase(phase.key)}
                      title={`${phase.name} (${phase.illumination}%)`}
                      className={`p-1.5 transition-all rounded-lg cursor-pointer ${
                        isActive
                          ? 'scale-125 text-[#ffdea6] bg-white/10 shadow-sm'
                          : 'opacity-40 hover:opacity-100 hover:scale-110 text-white/70'
                      }`}
                      aria-label={`Select ${phase.name}`}
                    >
                      <span>{phase.glyph}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#abb3af] px-1">
                <span className="font-['Manrope'] font-medium text-[#ffdea6]">
                  {celestialState.lunarPhase.name}
                </span>
                <span className="font-mono text-[#abb3af]">
                  {celestialState.lunarPhase.summary}
                </span>
              </div>
            </div>

            {/* Engine Signal Note */}
            <div className="p-4 rounded-xl bg-[#0c286f]/25 text-[#e1e6e1] flex flex-col gap-1.5 border border-[#163fb8]/30">
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider text-[#ffdea6] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">sensors</span>
                <span>Engine Signal Note</span>
              </span>
              <p className="font-['Manrope'] text-xs lg:text-sm text-[#e1e6e1]/90 leading-relaxed">
                {celestialState.engineSignalNote}
              </p>
            </div>

            {/* Personal Chart Trigger Card */}
            <div className="p-4 rounded-xl bg-[#292f2d]/80 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#ffdea6] tracking-wider">
                  Personalized Reading
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="font-['Manrope'] text-xs text-[#abb3af]">
                Ready to match tonight's nocturnal sky with your exact birth date, time, and coordinates?
              </p>
              <button
                onClick={onOpenBirthProfile}
                className="w-full mt-1 py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-[#f0f3ee] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                <span>{isPersonalReading ? 'Recalculate Personal Chart' : 'Input Your Birth Profile'}</span>
              </button>
            </div>
          </div>

          {/* Giant Celestial Recommendation Card */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="w-full rounded-[18px] bg-[#163fb8] p-6 lg:p-10 text-[#f0f3ee] shadow-2xl relative overflow-hidden border border-white/15">
              {/* Background Radial Glow */}
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0c286f]/70 filter blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col gap-6">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/20">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-[#171b1a]/40 font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#ffdea6] border border-white/10">
                      Daily Mezcal Recommendation
                    </span>
                    <span className="font-['Barlow_Condensed'] text-xs uppercase text-[#e1e6e1] font-semibold tracking-wider">
                      Tonight's Sky Match
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#e1e6e1]/80">
                    {celestialState.coordinatesLabel}
                  </span>
                </div>

                {/* Main Reading Display with Companion SVG Lunar Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#ffdea6] block mb-2">
                      {agave.astrologicalEnergy}
                    </span>
                    <h3 className="font-['Barlow_Condensed'] text-headline-section uppercase text-[#f0f3ee] tracking-tight leading-none">
                      {agave.commonName}
                    </h3>
                  </div>

                  {/* Compact companion celestial emblem */}
                  <div className="hidden sm:flex flex-col items-center p-2 rounded-xl bg-[#171b1a]/40 border border-white/10 shrink-0 shadow-sm">
                    <LunarPhaseVisualizer
                      phaseKey={activePhaseKey}
                      illumination={celestialState.lunarPhase.illumination}
                      phaseName={celestialState.lunarPhase.name}
                      size={68}
                      showOrbits={false}
                    />
                    <span className="font-mono text-[9px] text-[#ffdea6] tracking-wider mt-1 uppercase">
                      {celestialState.lunarPhase.illumination}% Illum
                    </span>
                  </div>
                </div>

                {/* 4 Architectural Reading Modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Module 1: Flavor */}
                  <div className="p-4 rounded-xl bg-[#171b1a]/40 backdrop-blur-sm border border-white/10 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[#ffdea6]">
                      <span className="material-symbols-outlined text-[18px]">local_bar</span>
                      <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider">
                        Flavor Profile
                      </span>
                    </div>
                    <p className="font-['Manrope'] text-sm text-[#f0f3ee] leading-relaxed">
                      {agave.flavorProfile}
                    </p>
                  </div>

                  {/* Module 2: Archetype */}
                  <div className="p-4 rounded-xl bg-[#171b1a]/40 backdrop-blur-sm border border-white/10 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[#ffdea6]">
                      <span className="material-symbols-outlined text-[18px]">psychology</span>
                      <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider">
                        Personality &amp; Archetype
                      </span>
                    </div>
                    <p className="font-['Manrope'] text-sm text-[#f0f3ee] leading-relaxed">
                      <strong className="text-[#ffdea6] font-semibold">{agave.archetypeTitle}</strong> — {agave.personalityDescription}
                    </p>
                  </div>

                  {/* Module 3: Terroir & Lore */}
                  <div className="p-4 rounded-xl bg-[#171b1a]/40 backdrop-blur-sm border border-white/10 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[#ffdea6]">
                      <span className="material-symbols-outlined text-[18px]">spa</span>
                      <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider">
                        Agave Terroir &amp; Lore
                      </span>
                    </div>
                    <p className="font-['Manrope'] text-sm text-[#f0f3ee] leading-relaxed">
                      {agave.agaveLore}
                    </p>
                  </div>

                  {/* Module 4: Ritual */}
                  <div className="p-4 rounded-xl bg-[#171b1a]/40 backdrop-blur-sm border border-white/10 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[#ffdea6]">
                      <span className="material-symbols-outlined text-[18px]">nights_stay</span>
                      <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider">
                        Occasion &amp; Ritual
                      </span>
                    </div>
                    <p className="font-['Manrope'] text-sm text-[#f0f3ee] leading-relaxed">
                      {agave.occasionAndRitual}
                    </p>
                  </div>
                </div>

                {/* Disclosed Partner Bottle Card */}
                <div className="rounded-xl p-4 lg:p-5 bg-[#171b1a]/60 backdrop-blur border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-['Barlow_Condensed'] text-xl lg:text-2xl font-bold text-[#f0f3ee]">
                      ILLUSTRATIVE PRODUCT EXAMPLE • No sponsorship, sale, or affiliation.
                    </span>
                    <p className="font-['Manrope'] text-xs text-[#e1e6e1]/80 max-w-xl">
                      {agave.partnerProduct.verifiedNotes}
                    </p>
                  </div>
                  <button
                    onClick={() => onViewBottle(agave)}
                    className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider rounded-full px-5 py-3 bg-[#b22b11] text-[#f0f3ee] hover:bg-[#b83720] transition-colors whitespace-nowrap self-stretch sm:self-auto text-center shadow cursor-pointer"
                  >
                    View This Bottle →
                  </button>
                </div>

                {/* Utility actions: Why This Match & Share Reading */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowWhyModal(!showWhyModal)}
                      className="text-[#ffdea6] hover:text-white flex items-center gap-1 font-['Barlow_Condensed'] uppercase tracking-wider font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>{showWhyModal ? 'Hide Celestial Logic' : 'Why this match?'}</span>
                    </button>

                    <button
                      onClick={handleFetchMaestroGuidance}
                      disabled={aiLoading}
                      className="text-[#ffdea6] hover:text-white flex items-center gap-1 font-['Barlow_Condensed'] uppercase tracking-wider font-bold cursor-pointer"
                      title="Generate personalized maestro ritual guidance using Gemini 3.7 Flash Lite"
                    >
                      <span className="material-symbols-outlined text-[16px] text-amber-300">auto_awesome</span>
                      <span>{aiLoading ? 'Consulting Maestro...' : aiGuidance ? 'Hide Maestro Guidance' : 'Maestro Ritual Guidance'}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="text-[#e1e6e1] hover:text-white flex items-center gap-1 font-['Barlow_Condensed'] uppercase tracking-wider font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">share</span>
                      <span>Share Reading</span>
                    </button>
                  </div>

                  {copiedToast && (
                    <span className="text-emerald-300 font-mono text-xs flex items-center gap-1 animate-fade-in">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      Reading copied to clipboard! (Birth details private)
                    </span>
                  )}
                </div>

                {/* AI Maestro Ritual Guidance powered by Gemini 3.7 Flash Lite */}
                {aiGuidance && (
                  <div className="mt-2 p-4 rounded-xl bg-[#0c286f]/50 border border-amber-400/40 text-xs text-[#f0f3ee] flex flex-col gap-2 shadow-lg animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#ffdea6] tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-300">auto_awesome</span>
                        <span>Maestro Mezcalero Ritual Insight • Gemini 3.7 Flash Lite</span>
                      </span>
                      <button
                        onClick={() => setAiGuidance(null)}
                        className="text-white/60 hover:text-white"
                        aria-label="Dismiss guidance"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <p className="font-['Manrope'] text-sm text-[#f0f3ee] leading-relaxed italic border-l-2 border-[#ffdea6] pl-3 py-0.5">
                      "{aiGuidance}"
                    </p>
                  </div>
                )}

                {/* Expanded "Why This Match" Explanation */}
                {showWhyModal && (
                  <div className="mt-2 p-4 rounded-xl bg-black/40 border border-[#ffdea6]/30 text-xs text-[#e1e6e1] flex flex-col gap-2">
                    <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#ffdea6] tracking-wider">
                      Celestial Scoring &amp; Agave Synthesis Logic
                    </span>
                    <p className="font-['Manrope'] leading-relaxed">
                      LA BRUJA calculates alignment between the current astronomical transit ({celestialState.lunarPhase.name}, {celestialState.solarSign} {celestialState.solarHouse}) and agave terroir. The {agave.element.toLowerCase()} polarity of {agave.commonName} provides equilibrium against the day's nocturnal volatility. No AI hallucinations are used; recommendations derive from our deterministic Mesoamerican calendar and botanical monograph matrix.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
