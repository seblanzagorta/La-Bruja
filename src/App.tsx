/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PhilosophicalStatement } from './components/PhilosophicalStatement';
import { DailyReadingSection } from './components/DailyReadingSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SocialRitualSection } from './components/SocialRitualSection';
import { BetaSignupSection } from './components/BetaSignupSection';
import { CulturalComplianceSection } from './components/CulturalComplianceSection';
import { Footer } from './components/Footer';

import { BirthProfileModal } from './components/BirthProfileModal';
import { PartnerBottleModal } from './components/PartnerBottleModal';
import { MethodResponsibilityModal } from './components/MethodResponsibilityModal';
import { AgeGateModal } from './components/AgeGateModal';
import { AuthScreen } from './components/AuthScreen';
import { UserProfileModal } from './components/UserProfileModal';

import { AGAVE_CATALOG } from './data/agaves';
import { getTonightCelestialState, computeReadingForProfile } from './utils/celestial';
import {
  getAgeVerified,
  getSavedBirthProfile,
  getCurrentUser,
  clearAllUserData
} from './utils/storage';
import { supabase } from './lib/supabase';
import { supabaseGetCurrentSessionUser, supabaseSignOut } from './services/auth';
import { AgaveProfile, BirthProfile, LunarPhaseKey, UserAccount } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'login' | 'signup'>('home');
  const [isAgeVerified, setIsAgeVerified] = useState(true);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [savedProfile, setSavedProfile] = useState<BirthProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Celestial & Agave State
  const [activePhaseKey, setActivePhaseKey] = useState<LunarPhaseKey>('waxing_gibbous');
  const [selectedBottleAgave, setSelectedBottleAgave] = useState<AgaveProfile | null>(null);

  // Modals
  const [showBirthModal, setShowBirthModal] = useState(false);
  const [showBottleModal, setShowBottleModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  useEffect(() => {
    const verified = getAgeVerified();
    setIsAgeVerified(verified);
    if (!verified) {
      setShowAgeGate(true);
    }
    const profile = getSavedBirthProfile();
    setSavedProfile(profile);

    // Initial check from local storage
    const cachedUser = getCurrentUser();
    if (cachedUser) {
      setCurrentUser(cachedUser);
    }

    // Verify session with Supabase
    supabaseGetCurrentSessionUser().then((sessionUser) => {
      if (sessionUser) {
        setCurrentUser(sessionUser);
      }
    });

    // Listen for Supabase auth state transitions
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await supabaseGetCurrentSessionUser();
        if (user) {
          setCurrentUser(user);
        }
      } else {
        // If signed out on Supabase
        const current = getCurrentUser();
        if (current && current.email !== 'copita@labruja.app') {
          setCurrentUser(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const celestialState = getTonightCelestialState(activePhaseKey);

  // Compute active agave recommendation
  let currentAgave: AgaveProfile = AGAVE_CATALOG.espadin;
  let isPersonalReading = false;

  if (savedProfile) {
    const result = computeReadingForProfile(savedProfile, activePhaseKey);
    currentAgave = result.agave;
    isPersonalReading = true;
  } else {
    const defaultAgaveId = celestialState.lunarPhase.recommendedAgaveId;
    currentAgave = AGAVE_CATALOG[defaultAgaveId] || AGAVE_CATALOG.espadin;
  }

  const handleOpenBottle = (agave: AgaveProfile) => {
    setSelectedBottleAgave(agave);
    setShowBottleModal(true);
  };

  const handleSelectAgaveMonograph = (agaveId: string) => {
    const found = AGAVE_CATALOG[agaveId];
    if (found) {
      setSelectedBottleAgave(found);
      setShowBottleModal(true);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Delete all stored birth profiles, user accounts, and cached readings from this browser?')) {
      clearAllUserData();
      setSavedProfile(null);
      setCurrentUser(null);
      setActivePhaseKey('waxing_gibbous');
      setStatusToast('All client data has been deleted from your browser.');
      setTimeout(() => setStatusToast(null), 4000);
    }
  };

  const scrollTo = (id: string) => {
    if (currentScreen !== 'home') {
      setCurrentScreen('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If user navigated to Login or Signup screen
  if (currentScreen === 'login' || currentScreen === 'signup') {
    return (
      <div className="min-h-screen bg-[#eff2ed] font-['Manrope'] text-[#1a1c1b] antialiased">
        <AuthScreen
          initialMode={currentScreen}
          onSuccess={(user) => {
            setCurrentUser(user);
            setCurrentScreen('home');
            const profile = getSavedBirthProfile();
            setSavedProfile(profile);
            setStatusToast(`Welcome back, ${user.name}. Celestial session verified.`);
            setTimeout(() => setStatusToast(null), 4000);
          }}
          onBackToHome={() => setCurrentScreen('home')}
        />

        {statusToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0c286f] text-[#f0f3ee] px-5 py-3 rounded-xl shadow-2xl border border-white/20 text-xs font-['Manrope'] flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[18px] text-[#ffdea6]">info</span>
            <span>{statusToast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eff2ed] font-['Manrope'] text-[#1a1c1b] antialiased">
      {/* Age Gate Check */}
      <AgeGateModal
        isOpen={showAgeGate && !isAgeVerified}
        onVerified={() => {
          setIsAgeVerified(true);
          setShowAgeGate(false);
        }}
      />

      {/* Persistent Toast notification */}
      {statusToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c286f] text-[#f0f3ee] px-5 py-3 rounded-xl shadow-2xl border border-white/20 text-xs font-['Manrope'] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-[#ffdea6]">info</span>
          <span>{statusToast}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        onOpenBirthProfile={() => setShowBirthModal(true)}
        onOpenMethod={() => setShowMethodModal(true)}
        onOpenBeta={() => scrollTo('beta-signup')}
        savedProfile={savedProfile}
        currentUser={currentUser}
        onOpenAuth={(mode) => setCurrentScreen(mode)}
        onOpenUserProfile={() => setShowUserProfileModal(true)}
      />

      {/* Main Content Sections */}
      <main className="w-full pt-20 bg-[#eff2ed]">
        {/* Section 1: Hero Section */}
        <HeroSection
          celestialState={celestialState}
          agaveMatch={currentAgave}
          onPreviewReading={() => scrollTo('sample-reading')}
          onJoinBeta={() => setCurrentScreen('signup')}
          onOpenBirthProfile={() => setShowBirthModal(true)}
        />

        {/* Section 2: Philosophical Statement */}
        <PhilosophicalStatement onOpenMethod={() => setShowMethodModal(true)} />

        {/* Section 3: Interactive Daily Reading */}
        <DailyReadingSection
          celestialState={celestialState}
          agave={currentAgave}
          activePhaseKey={activePhaseKey}
          onSelectPhase={(phaseKey) => setActivePhaseKey(phaseKey)}
          onViewBottle={handleOpenBottle}
          onOpenBirthProfile={() => setShowBirthModal(true)}
          isPersonalReading={isPersonalReading}
        />

        {/* Section 4: How It Works */}
        <HowItWorksSection />

        {/* Section 5: Varietal Expedition & Social Ritual */}
        <SocialRitualSection
          onSelectAgaveMonograph={handleSelectAgaveMonograph}
        />

        {/* Section 6: Beta Signup */}
        <BetaSignupSection />

        {/* Section 7: Cultural Compliance Disclosure */}
        <CulturalComplianceSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenMethod={() => setShowMethodModal(true)}
        onClearData={handleClearAllData}
        hasStoredData={!!savedProfile || !!currentUser}
      />

      {/* Interactive Modals */}
      <BirthProfileModal
        isOpen={showBirthModal}
        onClose={() => setShowBirthModal(false)}
        savedProfile={savedProfile}
        onProfileUpdated={(updated) => {
          setSavedProfile(updated);
          if (updated) {
            setStatusToast(`Personal natal chart calibrated for ${updated.birthplace}`);
            setTimeout(() => setStatusToast(null), 4000);
            scrollTo('sample-reading');
          }
        }}
      />

      {selectedBottleAgave && (
        <PartnerBottleModal
          agave={selectedBottleAgave}
          isOpen={showBottleModal}
          onClose={() => setShowBottleModal(false)}
        />
      )}

      <MethodResponsibilityModal
        isOpen={showMethodModal}
        onClose={() => setShowMethodModal(false)}
      />

      <UserProfileModal
        isOpen={showUserProfileModal}
        user={currentUser}
        savedProfile={savedProfile}
        onClose={() => setShowUserProfileModal(false)}
        onLogout={() => {
          supabaseSignOut();
          setCurrentUser(null);
          setStatusToast('You have signed out of your celestial account.');
          setTimeout(() => setStatusToast(null), 3000);
        }}
        onOpenBirthProfile={() => setShowBirthModal(true)}
      />
    </div>
  );
}
