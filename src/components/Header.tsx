import React, { useState } from 'react';
import { BirthProfile, UserAccount } from '../types';

interface HeaderProps {
  onOpenBirthProfile: () => void;
  onOpenMethod: () => void;
  onOpenBeta: () => void;
  savedProfile: BirthProfile | null;
  currentUser: UserAccount | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenUserProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBirthProfile,
  onOpenBeta,
  savedProfile,
  currentUser,
  onOpenAuth,
  onOpenUserProfile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#eff2ed]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-7xl mx-auto px-5 lg:px-12 flex items-center justify-between">
        {/* Brand Zone */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
        >
          <img
            alt="LA BRUJA Wordmark & Emblem"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtzvHAK28IcGlaeqvozylbXDxFD2v-SzjBtgUPaaJZKPR54HumqQxHBNAq6mjn5B9Xdigl94s648DnVGEevj19uswh474tWW02dcz71yczXwGlKX0XIcTtxqTpwbU9PYpHNCL5uQzBvNZmZTPDeetn3slvMeKpfy02n-O-ko28J3xBOPY2fe5F65ITDvjv_alZOWgK82hcgGi3MJNf_DgkT4lqieinnPgpSP7wT38MzqhqcpRIIbk"
          />
          <span className="font-['Barlow_Condensed'] text-2xl lg:text-3xl font-extrabold text-[#0c286f] uppercase tracking-tight">
            LA BRUJA
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider text-[#0c286f] hover:opacity-80 transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo('sample-reading')}
            className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider text-[#5b625e] hover:text-[#1a1c1b] transition-colors"
          >
            Sample Reading
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider text-[#5b625e] hover:text-[#1a1c1b] transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={onOpenBirthProfile}
            className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider text-[#5b625e] hover:text-[#0c286f] transition-colors flex items-center gap-1"
          >
            <span>Astrological Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6243]"></span>
          </button>
        </nav>

        {/* Action Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {!currentUser ? (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="hidden sm:inline-flex font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider text-[#0c286f] hover:text-[#00298f] px-3 py-2 transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider rounded-full px-4 sm:px-5 py-2.5 bg-[#b22b11] text-[#f0f3ee] hover:bg-[#b83720] shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap cursor-pointer"
              >
                Create Account
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenUserProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c286f]/10 hover:bg-[#0c286f]/20 border border-[#0c286f]/20 text-[#0c286f] transition-all cursor-pointer"
                title="View Celestial Guild Profile"
              >
                <div className="w-6 h-6 rounded-full bg-[#0c286f] text-[#ffdea6] flex items-center justify-center font-['Barlow_Condensed'] text-xs font-bold uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden md:inline font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>
            </div>
          )}

          {/* Profile / Astrological Calculator Trigger */}
          <button
            onClick={currentUser ? onOpenUserProfile : onOpenBirthProfile}
            title={
              currentUser
                ? `Logged in as ${currentUser.name}`
                : savedProfile
                ? `Birth Profile Saved: ${savedProfile.birthplace}`
                : 'Sign In / Personal Astrological Profile'
            }
            aria-label="Personal Astrological Profile"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              currentUser
                ? 'bg-[#0c286f] ring-2 ring-[#ffdea6] text-white shadow-sm'
                : savedProfile
                ? 'bg-[#0c286f] ring-2 ring-[#ffdea6] text-white shadow-sm'
                : 'bg-[#00298f] text-white hover:bg-[#0c286f]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {currentUser ? 'manage_accounts' : savedProfile ? 'account_circle' : 'person'}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#1a1c1b] hover:bg-neutral-200/50 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2e3e0] bg-[#eff2ed]/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-[#0c286f]"
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo('sample-reading')}
            className="text-left font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-[#5b625e]"
          >
            Sample Reading
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="text-left font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-[#5b625e]"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBirthProfile();
            }}
            className="text-left font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-[#00298f] flex items-center justify-between"
          >
            <span>Astrological Engine & Personal Reading</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#ffdea6] text-[#271900]">
              {savedProfile ? 'Profile Active' : 'Enter Profile'}
            </span>
          </button>

          <div className="pt-2 border-t border-[#e2e3e0] flex flex-col gap-2">
            {!currentUser ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="py-2.5 rounded-lg border border-[#0c286f] text-[#0c286f] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="py-2.5 rounded-lg bg-[#b22b11] text-white font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUserProfile();
                }}
                className="py-2.5 px-3 rounded-lg bg-[#0c286f] text-white font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider flex items-center justify-between"
              >
                <span>Logged in as {currentUser.name}</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
