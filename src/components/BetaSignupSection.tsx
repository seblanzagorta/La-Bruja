import React, { useState, useEffect } from 'react';
import { saveBetaEmail, getSavedBetaEmail } from '../utils/storage';

export const BetaSignupSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [ageChecked, setAgeChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const existing = getSavedBetaEmail();
    if (existing) {
      setEmail(existing);
      setIsSuccess(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!ageChecked && !isSuccess) {
      setErrorMsg('You must confirm legal drinking age (21+) to access LA BRUJA.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      saveBetaEmail(email);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  return (
    <section className="w-full bg-[#0c286f] py-16 lg:py-24 text-[#f0f3ee]" id="beta-signup">
      <div className="max-w-7xl mx-auto px-5 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text details */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center gap-1.5 font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#ffdea6] tracking-widest">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span>The Calendar Is Opening Soon</span>
            </div>

            <h2 className="font-['Barlow_Condensed'] text-headline-section uppercase tracking-tighter leading-none text-[#f0f3ee]">
              Get your first daily reading.
            </h2>

            <p className="font-['Manrope'] text-base lg:text-lg text-[#e1e6e1] max-w-lg leading-relaxed">
              Enter your email to receive early beta invitations, daily sky readings, and regional artisanal palenque releases before our public release.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[#e1e6e1]/80 font-['Manrope'] text-xs pt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#ffdea6]">lock</span>
                <span>Strictly Private</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#ffdea6]">schedule</span>
                <span>Daily at Twilight</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#b22b11]">verified_user</span>
                <span>21+ Mandate</span>
              </span>
            </div>
          </div>

          {/* Form module */}
          <div className="lg:col-span-6">
            <div className="bg-[#171b1a]/70 backdrop-blur-xl p-6 lg:p-10 rounded-[18px] shadow-2xl flex flex-col gap-4 border border-white/10">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider text-[#e1e6e1]"
                    htmlFor="beta-email"
                  >
                    Celestial Dispatch Email Address
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-5 py-4 rounded-full bg-[#292f2d]/90 text-[#f0f3ee] placeholder:text-[#5b625e] focus:outline-none focus:ring-2 focus:ring-[#b22b11] transition-all font-['Manrope'] text-sm lg:text-base border border-white/10 disabled:opacity-75"
                      id="beta-email"
                      placeholder="copita@labruja.app"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      disabled={isSuccess}
                      required
                    />
                  </div>
                  {errorMsg && (
                    <span className="text-red-400 font-['Manrope'] text-xs mt-1">
                      {errorMsg}
                    </span>
                  )}
                </div>

                {!isSuccess && (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      className="mt-1 accent-[#b22b11] rounded w-4 h-4 cursor-pointer"
                      id="age-check"
                      type="checkbox"
                      checked={ageChecked}
                      onChange={(e) => {
                        setAgeChecked(e.target.checked);
                        setErrorMsg('');
                      }}
                      required
                    />
                    <label
                      className="font-['Manrope'] text-xs text-[#e1e6e1]/80 cursor-pointer select-none leading-relaxed"
                      htmlFor="age-check"
                    >
                      I confirm that I am of legal drinking age in my jurisdiction (21+ in the United States) and agree to mindful, responsible ritual consumption.
                    </label>
                  </div>
                )}

                {!isSuccess ? (
                  <button
                    className="w-full py-4 rounded-full bg-[#b22b11] hover:bg-[#b83720] text-[#f0f3ee] font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    id="beta-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        <span>Aligning Sky Coordinates...</span>
                      </>
                    ) : (
                      <>
                        <span>Join The Beta</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-[#163fb8] text-[#f0f3ee] text-center font-['Manrope'] text-sm animate-fade-in border border-white/20 flex flex-col gap-1">
                    <span className="font-['Barlow_Condensed'] text-base uppercase font-bold text-[#ffdea6]">
                      ✦ Registration Confirmed ✦
                    </span>
                    <span>The sky will find your inbox at dusk with the first artisanal dispatch.</span>
                  </div>
                )}
              </form>

              <p className="font-['Manrope'] text-xs text-[#abb3af] text-center">
                No spam or synthetic marketing. Only celestial agave guidance and craft mezcal dispatches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
