import React from 'react';
import { UserAccount, BirthProfile } from '../types';
import { logoutUser } from '../utils/storage';
import { AGAVE_CATALOG } from '../data/agaves';

interface UserProfileModalProps {
  user: UserAccount | null;
  savedProfile: BirthProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenBirthProfile: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  savedProfile,
  isOpen,
  onClose,
  onLogout,
  onOpenBirthProfile
}) => {
  if (!isOpen || !user) return null;

  const handleLogoutClick = () => {
    logoutUser();
    onLogout();
    onClose();
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-[#f0f3ee]">
      <div className="relative w-full max-w-lg bg-[#171b1a] rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#0c286f] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#163fb8] ring-2 ring-[#ffdea6] flex items-center justify-center font-['Barlow_Condensed'] text-xl font-bold uppercase text-[#ffdea6]">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#ffdea6]">
                Celestial Guild Member
              </span>
              <h3 className="font-['Barlow_Condensed'] text-2xl font-bold uppercase tracking-tight text-white">
                {user.name}
              </h3>
            </div>
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
        <div className="p-6 lg:p-8 flex flex-col gap-6 text-sm font-['Manrope']">
          {/* Member Credentials Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#292f2d] border border-white/5">
            <div>
              <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#abb3af] block">
                Email Address
              </span>
              <span className="text-white text-xs truncate block font-mono">{user.email}</span>
            </div>
            <div>
              <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#abb3af] block">
                Member Since
              </span>
              <span className="text-white text-xs block font-mono">{memberSince}</span>
            </div>
          </div>

          {/* Active Natal Chart Status */}
          <div className="p-4 rounded-xl bg-[#0c286f]/30 border border-white/10 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-[#ffdea6] font-['Barlow_Condensed'] font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                <span>Natal Chart Calibration</span>
              </div>
              <p className="text-xs text-[#e1e6e1]">
                {savedProfile
                  ? `Calibrated for ${savedProfile.birthplace} (${savedProfile.birthDate})`
                  : 'No natal chart calibrated yet. Input birth data to sync.'}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenBirthProfile();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
            >
              {savedProfile ? 'Edit Chart' : 'Calibrate'}
            </button>
          </div>

          {/* Favorite Agave Varieties */}
          <div className="flex flex-col gap-2">
            <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#ffdea6] tracking-wider">
              Saved Guild Agave Monograph
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-[#292f2d] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-['Barlow_Condensed'] text-sm font-bold text-white block">
                    {AGAVE_CATALOG.espadin.commonName}
                  </span>
                  <span className="text-[11px] text-[#abb3af]">Catalyst • 8th House</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-amber-400">star</span>
              </div>
              <div className="p-3 rounded-lg bg-[#292f2d] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-['Barlow_Condensed'] text-sm font-bold text-white block">
                    {AGAVE_CATALOG.tepeztate.commonName}
                  </span>
                  <span className="text-[11px] text-[#abb3af]">25-Year • Ancient Grounder</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-amber-400">star</span>
              </div>
            </div>
          </div>

          {/* Security & Local Session Notice */}
          <div className="p-3 rounded-lg bg-[#292f2d]/50 border border-white/5 text-xs text-[#abb3af] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0">lock</span>
            <span>Your session and natal data are saved locally. No trackers active.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#292f2d] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleLogoutClick}
            className="px-4 py-2.5 rounded-full text-red-400 hover:text-red-300 font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider cursor-pointer flex items-center gap-1.5 hover:bg-red-950/40 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
