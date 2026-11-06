export type LunarPhaseKey =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface LunarPhaseInfo {
  key: LunarPhaseKey;
  name: string;
  glyph: string;
  illumination: number; // 0 - 100
  summary: string;
  recommendedAgaveId: string;
}

export interface PartnerProduct {
  id: string;
  brand: string;
  bottleName: string;
  abv: string;
  msrp: string;
  palenqueLocation: string;
  maestroMezcalero: string;
  distillationType: string;
  harvestAge: string;
  verifiedNotes: string;
  imageUrl?: string;
  retailerUrl: string;
  sponsorshipDisclosure: string;
}

export interface AgaveProfile {
  id: string;
  commonName: string;
  scientificName: string;
  maturityYears: number;
  terroirOrigin: string;
  flavorProfile: string;
  archetypeTitle: string;
  personalityDescription: string;
  agaveLore: string;
  occasionAndRitual: string;
  element: 'Water' | 'Earth' | 'Fire' | 'Air';
  solarHouseAffinity: string;
  astrologicalEnergy: string;
  partnerProduct: PartnerProduct;
}

export interface BirthProfile {
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthplace: string; // "Oaxaca de Juárez, Mexico"
  latitude: number;
  longitude: number;
  timeZone: string;
  consentTimestamp: number;
}

export interface CelestialState {
  lunarPhase: LunarPhaseInfo;
  solarHouse: string;
  solarSign: string;
  fixedElement: string;
  coordinatesLabel: string;
  localTimeCST: string;
  engineSignalNote: string;
}

export interface CityLookup {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  birthplace?: string;
  createdAt: number;
  savedFavorites?: string[];
}
