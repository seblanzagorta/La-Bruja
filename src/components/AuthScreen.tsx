import React, { useState } from 'react';
import { UserAccount } from '../types';
import { loginUser, registerUser, setAgeVerified } from '../utils/storage';
import { supabaseSignIn, supabaseSignUp, supabaseResetPassword } from '../services/auth';
import { POPULAR_BIRTHPLACES, searchCities } from '../data/cities';

interface AuthScreenProps {
  initialMode?: 'login' | 'signup';
  onSuccess: (user: UserAccount) => void;
  onBackToHome: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onSuccess,
  onBackToHome
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('1996-05-18');
  const [birthplace, setBirthplace] = useState('Oaxaca de Juárez, Mexico');
  const [citySuggestions, setCitySuggestions] = useState<typeof POPULAR_BIRTHPLACES>([]);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleCitySearch = (q: string) => {
    setBirthplace(q);
    if (q.trim().length > 1) {
      setCitySuggestions(searchCities(q));
    } else {
      setCitySuggestions([]);
    }
  };

  const handleDemoLogin = () => {
    setEmail('copita@labruja.app');
    setPassword('agave123');
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = loginUser('copita@labruja.app', 'agave123');
      setLoading(false);
      if (res.success && res.user) {
        setAgeVerified(true);
        onSuccess(res.user);
      }
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name or moniker.');
        return;
      }
      if (!ageConfirmed) {
        setErrorMsg('You must confirm you are of legal drinking age (21+).');
        return;
      }
      if (!termsAgreed) {
        setErrorMsg('Please agree to mindful ritual consumption.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        // Check if demo account
        if (email.trim().toLowerCase() === 'copita@labruja.app' && password === 'agave123') {
          const res = loginUser('copita@labruja.app', 'agave123');
          setLoading(false);
          if (res.user) {
            setAgeVerified(true);
            onSuccess(res.user);
            return;
          }
        }

        // Authenticate via Supabase
        const res = await supabaseSignIn(email, password);
        setLoading(false);
        if (res.success && res.user) {
          setAgeVerified(true);
          onSuccess(res.user);
        } else {
          setErrorMsg(res.error || 'Login failed. Please verify your credentials or sign up.');
        }
      } else {
        // Register via Supabase
        const res = await supabaseSignUp(name, email, password, birthDate, birthplace);
        setLoading(false);
        if (res.success && res.user) {
          setAgeVerified(true);
          if (res.message) {
            setInfoMsg(res.message);
          }
          // Proceed with logged-in user
          setTimeout(() => {
            if (res.user) onSuccess(res.user);
          }, 1200);
        } else {
          setErrorMsg(res.error || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setForgotLoading(true);
    const res = await supabaseResetPassword(forgotEmail);
    setForgotLoading(false);
    setForgotSuccess(true);
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    setLoading(true);
    setTimeout(() => {
      const demoEmail = `guest.${provider.toLowerCase()}@labruja.app`;
      const res = registerUser(
        `${provider} Explorer`,
        demoEmail,
        'agave123',
        '1995-10-28',
        'Oaxaca de Juárez, Mexico'
      );
      setLoading(false);
      if (res.user) {
        setAgeVerified(true);
        onSuccess(res.user);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#eff2ed] text-[#1a1c1b] flex flex-col justify-between selection:bg-[#ff6243] selection:text-white">
      {/* Top Bar Navigation */}
      <header className="w-full bg-[#eff2ed]/90 backdrop-blur-md border-b border-[#e2e3e0] py-4 px-5 lg:px-12 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          >
            <img
              alt="LA BRUJA Wordmark & Emblem"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtzvHAK28IcGlaeqvozylbXDxFD2v-SzjBtgUPaaJZKPR54HumqQxHBNAq6mjn5B9Xdigl94s648DnVGEevj19uswh474tWW02dcz71yczXwGlKX0XIcTtxqTpwbU9PYpHNCL5uQzBvNZmZTPDeetn3slvMeKpfy02n-O-ko28J3xBOPY2fe5F65ITDvjv_alZOWgK82hcgGi3MJNf_DgkT4lqieinnPgpSP7wT38MzqhqcpRIIbk"
            />
            <span className="font-['Barlow_Condensed'] text-2xl font-black text-[#0c286f] uppercase tracking-tight">
              LA BRUJA
            </span>
          </button>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-['Barlow_Condensed'] text-[#5b625e] hover:text-[#0c286f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Return to Sky Overview</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 lg:px-12 py-8 lg:py-14 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-[22px] overflow-hidden shadow-2xl border border-[#e2e3e0] bg-[#171b1a]">
          
          {/* Left Column: Atmospheric Brand & Archival Showcase (~45%) */}
          <div className="lg:col-span-5 bg-[#0c286f] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Radial Lights */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#163fb8]/60 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#b22b11]/30 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#ffdea6] px-3 py-1 rounded-full bg-white/10 border border-white/10">
                  Celestial Spirits Guild
                </span>
                <span className="w-2 h-2 rounded-full bg-[#ff6243] animate-pulse"></span>
              </div>

              <div>
                <h2 className="font-['Barlow_Condensed'] text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none text-white">
                  "The nocturnal sky guides the spirits we pour."
                </h2>
                <p className="font-['Manrope'] text-xs lg:text-sm text-[#e1e6e1] mt-3 leading-relaxed">
                  Consult the celestial calendar before lifting the copita. Save your personal birth coordinates and access verified artisanal palenque allocations.
                </p>
              </div>

              {/* 3 Pillars List */}
              <div className="flex flex-col gap-4 pt-2 border-t border-white/15">
                <div className="flex items-start gap-3">
                  <span className="font-['Barlow_Condensed'] text-base font-extrabold text-[#ffdea6]">01</span>
                  <div>
                    <h4 className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-white">
                      Natal Agave Blueprint
                    </h4>
                    <p className="font-['Manrope'] text-xs text-[#abb3af]">
                      Maps your solar element and twilight houses to ancient Mexican terroir.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-['Barlow_Condensed'] text-base font-extrabold text-[#ffdea6]">02</span>
                  <div>
                    <h4 className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-white">
                      Verified Palenquero Bottlings
                    </h4>
                    <p className="font-['Manrope'] text-xs text-[#abb3af]">
                      Exclusive monographs on Rey Campero, Real Minero, Mezcal Vago, and Lalocura.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-['Barlow_Condensed'] text-base font-extrabold text-[#ffdea6]">03</span>
                  <div>
                    <h4 className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-white">
                      Zero Tracking Privacy
                    </h4>
                    <p className="font-['Manrope'] text-xs text-[#abb3af]">
                      Your private astrological coordinates remain strictly encrypted in your local session.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Proof Tag */}
            <div className="relative z-10 pt-8 mt-6 border-t border-white/15 flex items-center justify-between text-xs text-[#abb3af]">
              <span className="font-mono text-[#ffdea6]">20:47 CST • Oaxaca Basin</span>
              <span className="font-['Barlow_Condensed'] uppercase font-bold text-white tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
                <span>21+ Mandate</span>
              </span>
            </div>
          </div>

          {/* Right Column: Authentication Form (~55%) */}
          <div className="lg:col-span-7 bg-[#171b1a] text-[#f0f3ee] p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto flex flex-col gap-6">
              
              {/* Mode Toggle Switcher */}
              <div className="p-1 rounded-xl bg-[#292f2d] flex items-center border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Barlow_Condensed'] transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#0c286f] text-white shadow-md'
                      : 'text-[#abb3af] hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Barlow_Condensed'] transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-[#b22b11] text-white shadow-md'
                      : 'text-[#abb3af] hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form Title */}
              <div>
                <h3 className="font-['Barlow_Condensed'] text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-white">
                  {mode === 'login' ? 'Welcome Back to the Ritual' : 'Begin Your Celestial Alignment'}
                </h3>
                <p className="font-['Manrope'] text-xs text-[#abb3af] mt-1">
                  {mode === 'login'
                    ? 'Enter your credentials to access your saved birth chart and daily agave pairings.'
                    : 'Create your complimentary membership to unlock personalized daily transits and palenque recommendations.'}
                </p>
              </div>

              {/* Quick 1-Click Demo Account Banner */}
              {mode === 'login' && (
                <div className="p-3.5 rounded-xl bg-[#0c286f]/30 border border-[#163fb8]/40 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#ffdea6]">local_bar</span>
                    <div>
                      <span className="font-bold text-white">Demo Maestro Account:</span>{' '}
                      <span className="text-[#e1e6e1]">copita@labruja.app</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-[#ffdea6] text-[#271900] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider hover:bg-[#efbf64] transition-all cursor-pointer whitespace-nowrap"
                  >
                    1-Click Sign In
                  </button>
                </div>
              )}

              {/* Info Banner */}
              {infoMsg && (
                <div className="p-3.5 rounded-xl bg-[#0c286f]/80 border border-[#ffdea6]/40 text-[#ffdea6] text-xs flex items-center gap-2 animate-fade-in">
                  <span className="material-symbols-outlined text-[18px] text-[#ffdea6] shrink-0">mark_email_read</span>
                  <span>{infoMsg}</span>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-fade-in">
                  <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === 'signup' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#e1e6e1] tracking-wider">
                      Full Name / Palenquero Moniker
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Ramos"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#292f2d] text-white placeholder:text-[#5b625e] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#b22b11] font-['Manrope'] text-sm"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#e1e6e1] tracking-wider">
                    Celestial Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="copita@labruja.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#292f2d] text-white placeholder:text-[#5b625e] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#b22b11] font-['Manrope'] text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#e1e6e1] tracking-wider">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-xs text-[#ffdea6] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#292f2d] text-white placeholder:text-[#5b625e] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#b22b11] font-['Manrope'] text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#abb3af] hover:text-white transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <span className="text-[11px] text-[#abb3af]">
                      Must contain at least 6 characters.
                    </span>
                  )}
                </div>

                {/* Optional Natal Pre-Calibration during Signup */}
                {mode === 'signup' && (
                  <div className="p-3.5 rounded-xl bg-[#292f2d]/60 border border-white/5 flex flex-col gap-3">
                    <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#ffdea6] tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">stars</span>
                      <span>Optional: Pre-Calibrate Your Natal Chart</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-[#abb3af] uppercase font-['Barlow_Condensed'] font-semibold">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="px-3 py-2 rounded-lg bg-[#171b1a] text-xs text-white border border-white/10"
                        />
                      </div>

                      <div className="flex flex-col gap-1 relative">
                        <label className="text-[11px] text-[#abb3af] uppercase font-['Barlow_Condensed'] font-semibold">
                          Birthplace
                        </label>
                        <input
                          type="text"
                          value={birthplace}
                          onChange={(e) => handleCitySearch(e.target.value)}
                          placeholder="e.g. Oaxaca de Juárez"
                          className="px-3 py-2 rounded-lg bg-[#171b1a] text-xs text-white border border-white/10"
                        />
                        {citySuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-[#292f2d] border border-white/15 rounded-lg shadow-xl max-h-32 overflow-y-auto">
                            {citySuggestions.slice(0, 4).map((c) => (
                              <button
                                key={`${c.name}-${c.lat}`}
                                type="button"
                                onClick={() => {
                                  setBirthplace(`${c.name}, ${c.country}`);
                                  setCitySuggestions([]);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-[#0c286f] cursor-pointer"
                              >
                                {c.name}, {c.region}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Checkboxes */}
                {mode === 'signup' ? (
                  <div className="flex flex-col gap-2 pt-1 text-xs text-[#abb3af]">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={ageConfirmed}
                        onChange={(e) => setAgeConfirmed(e.target.checked)}
                        className="mt-0.5 accent-[#b22b11] rounded w-4 h-4 cursor-pointer shrink-0"
                        required
                      />
                      <span>
                        I verify that I am of legal drinking age in my jurisdiction (21+ in the United States).
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-0.5 accent-[#b22b11] rounded w-4 h-4 cursor-pointer shrink-0"
                        required
                      />
                      <span>
                        I agree to mindful, responsible ritual consumption and the LA BRUJA terms of service.
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-[#abb3af] pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-[#0c286f] rounded w-4 h-4 cursor-pointer"
                      />
                      <span>Remember this browser</span>
                    </label>
                    <span className="text-[11px] text-[#5b625e]">Encrypted local session</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-full font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 ${
                    mode === 'signup'
                      ? 'bg-[#b22b11] hover:bg-[#b83720] text-white'
                      : 'bg-[#0c286f] hover:bg-[#163fb8] text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Aligning Celestial Account...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In to Calendar' : 'Create Celestial Membership'}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-[1px] bg-white/10"></div>
                <span className="font-['Barlow_Condensed'] text-xs uppercase text-[#5b625e] tracking-widest">
                  or continue with
                </span>
                <div className="flex-1 h-[1px] bg-white/10"></div>
              </div>

              {/* Quick Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="py-3 px-4 rounded-xl bg-[#292f2d] hover:bg-[#292f2d]/80 border border-white/10 text-xs font-['Manrope'] font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('Apple')}
                  className="py-3 px-4 rounded-xl bg-[#292f2d] hover:bg-[#292f2d]/80 border border-white/10 text-xs font-['Manrope'] font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.93-.92.04-2.02.61-2.67 1.39-.58.67-1.08 1.76-.94 2.81 1.03.08 2.05-.53 2.67-1.27z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Bottom Switch Note */}
              <p className="text-center font-['Manrope'] text-xs text-[#abb3af]">
                {mode === 'login' ? (
                  <>
                    Not yet a member of the guild?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg('');
                      }}
                      className="text-[#ffdea6] font-bold hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already hold celestial membership?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMsg('');
                      }}
                      className="text-[#ffdea6] font-bold hover:underline cursor-pointer"
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#171b1a] text-[#f0f3ee] rounded-2xl p-6 lg:p-8 border border-white/15 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#ffdea6]">
                Security Dispatch
              </span>
              <button
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setForgotSuccess(false);
                }}
                className="text-[#abb3af] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase text-white">
              Recover Celestial Access
            </h3>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-[#0c286f] border border-white/10 text-xs flex flex-col gap-2">
                <span className="font-bold text-[#ffdea6]">Dispatched to {forgotEmail}:</span>
                <p className="text-[#e1e6e1]">
                  A temporary celestial authentication key has been simulated for your local account (Default password: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white">agave123</code>).
                </p>
                <button
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setForgotSuccess(false);
                  }}
                  className="mt-2 py-2 px-4 rounded-lg bg-[#ffdea6] text-[#271900] font-['Barlow_Condensed'] uppercase font-bold text-xs self-start"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleForgotPasswordSubmit}
                className="flex flex-col gap-3"
              >
                <p className="text-xs text-[#abb3af]">
                  Enter your email address and we'll dispatch an instant reset link to recover your natal chart and palenque notes.
                </p>
                <input
                  type="email"
                  required
                  placeholder="copita@labruja.app"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#292f2d] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6243]"
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-full bg-[#b22b11] hover:bg-[#b83720] text-white font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider cursor-pointer mt-1 disabled:opacity-50"
                >
                  {forgotLoading ? 'Dispatching Recovery Key...' : 'Send Recovery Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 px-5 lg:px-12 border-t border-[#e2e3e0] text-center font-['Manrope'] text-xs text-[#5b625e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2025 LA BRUJA Spirits Co. All rights reserved.</span>
          <span className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider text-[#0c286f]">
            Strictly 21+ Verification Mandate • Mindful Agave Consumption
          </span>
        </div>
      </footer>
    </div>
  );
};
