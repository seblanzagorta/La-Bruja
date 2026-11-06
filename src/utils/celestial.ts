import { LunarPhaseInfo, LunarPhaseKey, CelestialState, AgaveProfile, BirthProfile } from '../types';
import { AGAVE_CATALOG } from '../data/agaves';

export const LUNAR_PHASES: LunarPhaseInfo[] = [
  {
    key: 'new_moon',
    name: 'New Moon',
    glyph: '🌑',
    illumination: 0,
    summary: 'Dark Sky • Void of Course • Quiet Germination',
    recommendedAgaveId: 'tepeztate'
  },
  {
    key: 'waxing_crescent',
    name: 'Waxing Crescent',
    glyph: '🌒',
    illumination: 24,
    summary: 'Nascent Light • Emergence • Clarifying Vision',
    recommendedAgaveId: 'madrecuixe'
  },
  {
    key: 'first_quarter',
    name: 'First Quarter',
    glyph: '🌓',
    illumination: 50,
    summary: 'Equilibrium & Tension • Decisive Action',
    recommendedAgaveId: 'jabali'
  },
  {
    key: 'waxing_gibbous',
    name: 'Waxing Gibbous',
    glyph: '🌔',
    illumination: 84,
    summary: 'Swelling Momentum • Scorpio 8th House Depth',
    recommendedAgaveId: 'espadin'
  },
  {
    key: 'full_moon',
    name: 'Full Moon',
    glyph: '🌕',
    illumination: 100,
    summary: 'Peak Illumination • Oceanic Intuition & High Terroir',
    recommendedAgaveId: 'tobala'
  },
  {
    key: 'waning_gibbous',
    name: 'Waning Gibbous',
    glyph: '🌖',
    illumination: 78,
    summary: 'Harvest Fellowship • Expansive Generosity',
    recommendedAgaveId: 'arroqueno'
  },
  {
    key: 'last_quarter',
    name: 'Last Quarter',
    glyph: '🌗',
    illumination: 50,
    summary: 'Re-evaluation • Structural Integrity & Herbaceous Earth',
    recommendedAgaveId: 'madrecuixe'
  },
  {
    key: 'waning_crescent',
    name: 'Waning Crescent',
    glyph: '🌘',
    illumination: 14,
    summary: 'Restorative Silence • Balsamic Transmutation',
    recommendedAgaveId: 'sierra_negra'
  }
];

export function getTonightCelestialState(selectedPhaseKey?: LunarPhaseKey): CelestialState {
  const phase = selectedPhaseKey
    ? LUNAR_PHASES.find((p) => p.key === selectedPhaseKey) || LUNAR_PHASES[3]
    : LUNAR_PHASES[3]; // Default Waxing Gibbous (84%)

  let engineNote = 'Scorpio transiting 8th solar house activates deep, mineral-forward agave varietals that ground volatile mental tension.';
  if (phase.key === 'full_moon') {
    engineNote = 'Peak lunar illumination in Pisces elevates high-altitude wild botanical notes and delicate clay-softened aromatics.';
  } else if (phase.key === 'new_moon') {
    engineNote = 'Dark balsamic moon calls for 25-year cliffside Tepeztate—ancient roots offering profound stillness against nocturnal void.';
  } else if (phase.key === 'waning_gibbous') {
    engineNote = 'Waning Gibbous amplifies communal resonance, favoring colossal Arroqueño with rich chocolate-green pepper warmth.';
  } else if (phase.key === 'first_quarter') {
    engineNote = 'Quarter moon tension sparks fiery transformation, ideally met with the tempestuous complexity of wild Jabalí.';
  } else if (phase.key === 'last_quarter' || phase.key === 'waxing_crescent') {
    engineNote = 'Subtle angular aspect sharpens analytical discernment, calling for Karwinskii vertical structure and graphite precision.';
  }

  return {
    lunarPhase: phase,
    solarHouse: '8th House',
    solarSign: 'Scorpio',
    fixedElement: 'Fixed Water • Depth',
    coordinatesLabel: 'LAT: 17.0732° N • LON: 96.7266° W',
    localTimeCST: '20:47 CST',
    engineSignalNote: engineNote
  };
}

export function calculateBirthZodiac(birthDateStr: string): { sign: string; element: 'Water' | 'Earth' | 'Fire' | 'Air'; house: string } {
  if (!birthDateStr) return { sign: 'Scorpio', element: 'Water', house: '8th House' };
  const d = new Date(birthDateStr);
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: 'Aries', element: 'Fire', house: '1st House' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: 'Taurus', element: 'Earth', house: '2nd House' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini', element: 'Air', house: '3rd House' };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer', element: 'Water', house: '4th House' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo', element: 'Fire', house: '5th House' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo', element: 'Earth', house: '6th House' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra', element: 'Air', house: '7th House' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: 'Scorpio', element: 'Water', house: '8th House' };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: 'Sagittarius', element: 'Fire', house: '9th House' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: 'Capricorn', element: 'Earth', house: '10th House' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: 'Aquarius', element: 'Air', house: '11th House' };
  return { sign: 'Pisces', element: 'Water', house: '12th House' };
}

export function computeReadingForProfile(
  profile: BirthProfile,
  activePhaseKey?: LunarPhaseKey
): {
  agave: AgaveProfile;
  solarSign: string;
  birthElement: string;
  astrologicalTension: string;
  botanicalCounterpart: string;
  ritualGuidance: string;
} {
  const zodiac = calculateBirthZodiac(profile.birthDate);
  const phaseKey = activePhaseKey || 'waxing_gibbous';

  // Deterministic scoring matrix
  const candidates: { agaveId: string; score: number }[] = [
    { agaveId: 'espadin', score: 10 },
    { agaveId: 'tobala', score: 8 },
    { agaveId: 'tepeztate', score: 7 },
    { agaveId: 'arroqueno', score: 8 },
    { agaveId: 'madrecuixe', score: 7 },
    { agaveId: 'jabali', score: 6 },
    { agaveId: 'sierra_negra', score: 6 }
  ];

  // Adjust scores deterministically based on birth element & time
  candidates.forEach((c) => {
    const ag = AGAVE_CATALOG[c.agaveId];
    if (ag.element === zodiac.element) c.score += 15;
    if (ag.id === 'espadin' && (zodiac.sign === 'Scorpio' || phaseKey === 'waxing_gibbous')) c.score += 8;
    if (ag.id === 'tobala' && (zodiac.element === 'Water' || phaseKey === 'full_moon')) c.score += 12;
    if (ag.id === 'tepeztate' && (zodiac.element === 'Earth' || phaseKey === 'new_moon')) c.score += 12;
    if (ag.id === 'arroqueno' && (zodiac.element === 'Fire' || phaseKey === 'waning_gibbous')) c.score += 12;
    if (ag.id === 'madrecuixe' && (zodiac.element === 'Air' || phaseKey === 'waxing_crescent' || phaseKey === 'last_quarter')) c.score += 12;
    if (ag.id === 'jabali' && (zodiac.sign === 'Aries' || zodiac.sign === 'Sagittarius')) c.score += 10;
  });

  // Sort descending
  candidates.sort((a, b) => b.score - a.score);
  const winningAgave = AGAVE_CATALOG[candidates[0].agaveId] || AGAVE_CATALOG.espadin;

  return {
    agave: winningAgave,
    solarSign: zodiac.sign,
    birthElement: zodiac.element,
    astrologicalTension: `Your ${zodiac.sign} sun (${zodiac.element}) engages with tonight's ${phaseKey.replace('_', ' ')} transit, precipitating high energetic velocity that seeks an anchoring botanical compass.`,
    botanicalCounterpart: `${winningAgave.commonName} (${winningAgave.scientificName}), cultivated in ${winningAgave.terroirOrigin}, provides the essential ${winningAgave.element.toLowerCase()} polarity to harmonize this transit.`,
    ritualGuidance: `Sip reverently from a shallow traditional clay or barro copita. Allow the spirit to breathe for two minutes before the first pass.`
  };
}
