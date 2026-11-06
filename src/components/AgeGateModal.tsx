import React, { useState } from 'react';
import { setAgeVerified } from '../utils/storage';

interface AgeGateModalProps {
  isOpen: boolean;
  onVerified: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ isOpen, onVerified }) => {
  const [birthYear, setBirthYear] = useState('2000');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();

  const handleConfirmAge = (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = parseInt(birthYear, 10);
    if (isNaN(yearNum) || yearNum > currentYear - 21) {
      setErrorMessage('You must be 21 years of age or older to enter LA BRUJA.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('Please confirm agreement to mindful consumption terms.');
      return;
    }

    setAgeVerified(true);
    onVerified();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c286f]/95 backdrop-blur-2xl animate-fade-in text-[#f0f3ee]">
      <div className="relative w-full max-w-lg bg-[#171b1a] rounded-2xl shadow-2xl border border-white/15 p-6 lg:p-10 flex flex-col items-center text-center gap-6">
        {/* Emblem & Wordmark */}
        <div className="flex flex-col items-center gap-3">
          <img
            alt="LA BRUJA Wordmark & Emblem"
            className="h-10 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtzvHAK28IcGlaeqvozylbXDxFD2v-SzjBtgUPaaJZKPR54HumqQxHBNAq6mjn5B9Xdigl94s648DnVGEevj19uswh474tWW02dcz71yczXwGlKX0XIcTtxqTpwbU9PYpHNCL5uQzBvNZmZTPDeetn3slvMeKpfy02n-O-ko28J3xBOPY2fe5F65ITDvjv_alZOWgK82hcgGi3MJNf_DgkT4lqieinnPgpSP7wT38MzqhqcpRIIbk"
          />
          <h2 className="font-['Barlow_Condensed'] text-3xl font-extrabold uppercase tracking-tight text-[#ffdea6]">
            LA BRUJA
          </h2>
          <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-widest text-[#abb3af]">
            Cosmic Agave Rituals &amp; Astrological Spirits Monograph
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase text-white">
            Age Verification Required
          </h3>
          <p className="font-['Manrope'] text-xs text-[#abb3af] leading-relaxed">
            LA BRUJA celebrates rare artisanal mezcals and celestial pairings. In compliance with alcohol beverage regulations, you must confirm you are of legal drinking age (21+ in the US) to proceed.
          </p>
        </div>

        {errorMessage && (
          <div className="w-full p-3 rounded-lg bg-red-900/60 border border-red-500/40 text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleConfirmAge} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#e1e6e1] tracking-wider">
              Year of Birth
            </label>
            <input
              type="number"
              min="1920"
              max={currentYear}
              value={birthYear}
              onChange={(e) => {
                setBirthYear(e.target.value);
                setErrorMessage('');
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#292f2d] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff6243] font-mono text-center text-lg"
              required
            />
          </div>

          <div className="flex items-start gap-2.5 text-left">
            <input
              id="age-gate-check"
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => {
                setAgreedTerms(e.target.checked);
                setErrorMessage('');
              }}
              className="mt-1 accent-[#b22b11] rounded w-4 h-4 cursor-pointer shrink-0"
              required
            />
            <label
              htmlFor="age-gate-check"
              className="font-['Manrope'] text-xs text-[#abb3af] cursor-pointer select-none leading-relaxed"
            >
              I verify that I am at least 21 years of age and agree to mindful, responsible spirit consumption.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#b22b11] hover:bg-[#b83720] text-white font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>Enter LA BRUJA</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>

        <p className="font-['Manrope'] text-[11px] text-[#5b625e]">
          Drink responsibly. Never consume alcohol while operating machinery or driving.
        </p>
      </div>
    </div>
  );
};
