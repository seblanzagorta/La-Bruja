import { CityLookup } from '../types';

export const POPULAR_BIRTHPLACES: CityLookup[] = [
  { name: 'Oaxaca de Juárez', region: 'Oaxaca', country: 'Mexico', lat: 17.0732, lon: -96.7266, timezone: 'America/Mexico_City' },
  { name: 'Santiago Matatlán', region: 'Oaxaca (Capital del Mezcal)', country: 'Mexico', lat: 16.8667, lon: -96.3833, timezone: 'America/Mexico_City' },
  { name: 'Mexico City (CDMX)', region: 'Federal District', country: 'Mexico', lat: 19.4326, lon: -99.1332, timezone: 'America/Mexico_City' },
  { name: 'Guadalajara', region: 'Jalisco', country: 'Mexico', lat: 20.6597, lon: -103.3496, timezone: 'America/Mexico_City' },
  { name: 'Puebla', region: 'Puebla', country: 'Mexico', lat: 19.0414, lon: -98.2063, timezone: 'America/Mexico_City' },
  { name: 'Monterrey', region: 'Nuevo León', country: 'Mexico', lat: 25.6866, lon: -100.3161, timezone: 'America/Monterrey' },
  { name: 'Mérida', region: 'Yucatán', country: 'Mexico', lat: 20.9674, lon: -89.5926, timezone: 'America/Merida' },
  { name: 'San Miguel de Allende', region: 'Guanajuato', country: 'Mexico', lat: 20.9144, lon: -100.7452, timezone: 'America/Mexico_City' },
  { name: 'Puerto Escondido', region: 'Oaxaca Coast', country: 'Mexico', lat: 15.8624, lon: -97.0768, timezone: 'America/Mexico_City' },
  { name: 'Tijuana', region: 'Baja California', country: 'Mexico', lat: 32.5149, lon: -117.0382, timezone: 'America/Tijuana' },
  { name: 'New York City', region: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
  { name: 'Los Angeles', region: 'California', country: 'United States', lat: 34.0522, lon: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'San Francisco', region: 'California', country: 'United States', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Austin', region: 'Texas', country: 'United States', lat: 30.2672, lon: -97.7431, timezone: 'America/Chicago' },
  { name: 'Chicago', region: 'Illinois', country: 'United States', lat: 41.8781, lon: -87.6298, timezone: 'America/Chicago' },
  { name: 'Miami', region: 'Florida', country: 'United States', lat: 25.7617, lon: -80.1918, timezone: 'America/New_York' },
  { name: 'Denver', region: 'Colorado', country: 'United States', lat: 39.7392, lon: -104.9903, timezone: 'America/Denver' },
  { name: 'London', region: 'Greater London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'Madrid', region: 'Community of Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, timezone: 'Europe/Madrid' },
  { name: 'Barcelona', region: 'Catalonia', country: 'Spain', lat: 41.3879, lon: 2.1699, timezone: 'Europe/Madrid' },
  { name: 'Paris', region: 'Île-de-France', country: 'France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Berlin', region: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.405, timezone: 'Europe/Berlin' },
  { name: 'Tokyo', region: 'Kanto', country: 'Japan', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Sydney', region: 'New South Wales', country: 'Australia', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Buenos Aires', region: 'Federal Capital', country: 'Argentina', lat: -34.6037, lon: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  { name: 'Toronto', region: 'Ontario', country: 'Canada', lat: 43.6532, lon: -79.3832, timezone: 'America/Toronto' }
];

export function searchCities(query: string): CityLookup[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return POPULAR_BIRTHPLACES.slice(0, 6);
  return POPULAR_BIRTHPLACES.filter(
    (c) =>
      c.name.toLowerCase().includes(clean) ||
      c.region.toLowerCase().includes(clean) ||
      c.country.toLowerCase().includes(clean)
  );
}
