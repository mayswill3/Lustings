// utils/location.ts

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationData {
  town: string;
  county: string;
  region: string;
  postcode: string;
  nearest_station?: string;
}

const postcodeCache = new Map<string, Coordinates>();

export async function getPostcodeCoordinates(
  postcode: string
): Promise<Coordinates | null> {
  const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase();

  if (postcodeCache.has(normalizedPostcode)) {
    return postcodeCache.get(normalizedPostcode)!;
  }

  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${normalizedPostcode}`
    );
    if (!response.ok) {
      console.error(
        `Postcode API returned ${response.status}: ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();

    if (data.result) {
      const coordinates = {
        latitude: data.result.latitude,
        longitude: data.result.longitude
      };
      postcodeCache.set(normalizedPostcode, coordinates);
      return coordinates;
    }
    return null;
  } catch (error) {
    console.error('Error fetching postcode coordinates:', error);
    return null;
  }
}

export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 3958.8; // Earth's radius in miles
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in miles, rounded to nearest mile
}

// Available distance options for the proximity search
export const DISTANCE_OPTIONS = [
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 25, label: '25 miles' },
  { value: 50, label: '50 miles' },
  { value: 100, label: '100 miles' }
];

// Helper function to validate a UK postcode format
export function isValidUKPostcode(postcode: string): boolean {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return postcodeRegex.test(postcode.trim());
}

// Helper function to format a UK postcode
export function formatPostcode(postcode: string): string {
  const clean = postcode.replace(/\s+/g, '').toUpperCase();
  const length = clean.length;
  return `${clean.slice(0, length - 3)} ${clean.slice(length - 3)}`;
}

// Function to get nearest locations
export function getNearbyLocations(
  userCoords: Coordinates,
  locations: Array<LocationData & { coordinates?: Coordinates }>,
  maxDistance: number
): LocationData[] {
  return locations
    .filter((location) => location.coordinates) // Only consider locations with coordinates
    .filter((location) => {
      const distance = calculateDistance(userCoords, location.coordinates!);
      return distance <= maxDistance;
    })
    .sort((a, b) => {
      const distanceA = calculateDistance(userCoords, a.coordinates!);
      const distanceB = calculateDistance(userCoords, b.coordinates!);
      return distanceA - distanceB;
    });
}
