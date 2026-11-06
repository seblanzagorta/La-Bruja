import React, { useState, useEffect } from 'react';
import { BirthProfile, CityLookup } from '../types';
import { searchCities, POPULAR_BIRTHPLACES } from '../data/cities';
import { saveBirthProfile, clearBirthProfile } from '../utils/storage';

interface BirthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProfile: BirthProfile | null;
  onProfileUpdated: (profile: BirthProfile | null) => void;
}

export const BirthProfileModal: React.FC<BirthProfileModalProps> = ({
  isOpen,
  onClose,
  savedProfile,
  onProfileUpdated
}) => {
  const [birthDate, setBirthDate] = useState(savedProfile?.birthDate || '1995-10-28');
  const [birthTime, setBirthTime] = useState(savedProfile?.birthTime || '20:45');
  const [cityQuery, setCityQuery] = useState(savedProfile?.birthplace || 'Oaxaca de Juárez, Mexico');
  const [selectedCity, setSelectedCity] = useState<CityLookup>({
    name: 'Oaxaca de Juárez',
    region: 'Oaxaca',
    country: 'Mexico',
    lat: 17.0732,
    lon: -96.7266,
    timezone: 'America/Mexico_City'
  });
  const [citySuggestions, setCitySuggestions] = useState<CityLookup[]>([]);
  const [consentChecked, setConsentChecked] = useState(!!savedProfile);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState(0);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (savedProfile) {
      setBirthDate(savedProfile.birthDate);
      setBirthTime(savedProfile.birthTime);
      setCityQuery(savedProfile.birthplace);
      setSelectedCity({
        name: savedProfile.birthplace,
        region: 'Verified Region',
        country: 'Global',
        lat: savedProfile.latitude,
        lon: savedProfile.longitude,
        timezone: savedProfile.timeZone
      });
      setConsentChecked(true);
    }
  }, [savedProfile]);

  const handleCitySearch = (query: string) => {
    setCityQuery(query);
    if (query.trim().length > 1) {
      setCitySuggestions(searchCities(query));
    } else {
      setCitySuggestions([]);
    }
  };

  const handleSelectCity = (city: CityLookup) => {
    setSelectedCity(city);
    setCityQuery(`${city.name}, ${city.region}`);
    setCitySuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setValidationError('Please select your birth date.');
      return;
    }
    if (!consentChecked) {
      setValidationError('You must consent to client-side local calculation.');
      return;
    }

    setValidationError('');
    setIsCalculating(true);
    setCalcStep(1);

    // Astronomical calculation ceremony
    setTimeout(() => setCalcStep(2), 500);
    setTimeout(() => setCalcStep(3), 1000);
    setTimeout(() => {
      const newProfile: BirthProfile = {
        birthDate,
        birthTime: birthTime || '12:00',
        birthplace: cityQuery,
        latitude: selectedCity.lat,
        longitude: selectedCity.lon,
        timeZone: selectedCity.timezone,
        consentTimestamp: Date.now()
      };

      saveBirthProfile(newProfile);
      onProfileUpdated(newProfile);
      setIsCalculating(false);
      onClose();
    }, 1500);
  };

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your stored birth profile from this browser?')) {
      clearBirthProfile();
      onProfileUpdated(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#171b1a] text-[#f0f3ee] rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#0c286f] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex flex-col">
            <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-widest text-[#ffdea6]">
              Astrological Agave Engine
            </span>
            <h3 className="font-['Barlow_Condensed'] text-2xl font-bold uppercase tracking-tight">
              {savedProfile ? 'Your Personal Birth Chart' : 'Input Your Birth Profile'}
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

        {/* Calculation in Progress */}
        {isCalculating ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#ffdea6] border-t-transparent animate-spin flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-[#ffdea6]">auto_awesome</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-wider text-white">
                Aligning Celestial Coordinates
              </span>
              <p className="font-['Manrope'] text-sm text-[#abb3af] max-w-sm">
                {calcStep === 1 && 'Calculating solar house & natal element...'}
                {calcStep === 2 && 'Synthesizing lunar phase tension with Oaxaca agave terroir...'}
                {calcStep === 3 && 'Harmonizing botanical balance engine...'}
              </p>
            </div>
          </div>
        ) : (
          <form className="p-6 lg:p-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <p className="font-['Manrope'] text-xs lg:text-sm text-[#abb3af] leading-relaxed">
              LA BRUJA matches your birth transit with tonight's sky to recommend the ideal artisanal agave varietal. All calculations happen entirely in your local browser.
            </p>

            {validationError && (
              <div className="p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-200 text-xs">
                {validationError}
              </div>
            )}

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#e1e6e1] tracking-wider">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-[#292f2d] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff6243] font-['Manrope'] text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#e1e6e1] tracking-wider">
                  Local Birth Time (Estimated)
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-[#292f2d] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff6243] font-['Manrope'] text-sm"
                />
              </div>
            </div>

            {/* Birthplace Search */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="font-['Barlow_Condensed'] text-xs uppercase font-bold text-[#e1e6e1] tracking-wider">
                Birthplace City &amp; Region
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  placeholder="e.g. Oaxaca de Juárez, Mexico City, New York..."
                  className="w-full px-4 py-3 rounded-xl bg-[#292f2d] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff6243] font-['Manrope'] text-sm pl-10"
                  required
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#abb3af]">
                  location_on
                </span>
              </div>

              {/* City Autocomplete Dropdown */}
              {citySuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#292f2d] border border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                  {citySuggestions.map((city) => (
                    <button
                      key={`${city.name}-${city.lat}`}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#0c286f] text-white flex items-center justify-between border-b border-white/5 last:border-0 cursor-pointer"
                    >
                      <span className="font-medium">{city.name}, {city.region}</span>
                      <span className="text-[#abb3af] font-mono text-[10px]">{city.country}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Current Selected Coordinates Pill */}
              <div className="flex items-center justify-between text-[11px] text-[#abb3af] pt-1 px-1">
                <span>Coordinates: {selectedCity.lat.toFixed(4)}° N, {selectedCity.lon.toFixed(4)}° W</span>
                <span>TZ: {selectedCity.timezone}</span>
              </div>
            </div>

            {/* Privacy Consent Checkbox */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                id="consent-profile"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 accent-[#b22b11] rounded w-4 h-4 cursor-pointer shrink-0"
                required
              />
              <label
                htmlFor="consent-profile"
                className="font-['Manrope'] text-xs text-[#abb3af] leading-relaxed cursor-pointer select-none"
              >
                I consent to processing my birth date and coordinates strictly within this browser. No personal data is stored on external servers or transmitted to third parties.
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
              {savedProfile ? (
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  className="px-4 py-3 rounded-full text-red-400 hover:text-red-300 font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  Delete Profile
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#f0f3ee] font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#b22b11] hover:bg-[#b83720] text-white font-['Barlow_Condensed'] text-xs uppercase font-bold tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{savedProfile ? 'Update & Calculate' : 'Calculate Sky Match'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
