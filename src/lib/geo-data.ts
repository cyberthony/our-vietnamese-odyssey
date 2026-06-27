/**
 * Accurate country GeoJSON overlays (Natural Earth 50m resolution).
 * Extracted from world-atlas via topojson-client at build time.
 *
 * Bundle sizes: Vietnam ~24 KB, South Korea ~10 KB, North Korea ~10 KB
 * Total: ~44 KB (well under Cloudflare's 25 MB per-file limit)
 */

import allCountries from "./countries-geo.json";

// Each country is identified by its ISO 3166-1 numeric code in the GeoJSON
const COUNTRY_IDS = {
  SOUTH_KOREA: "410",
  NORTH_KOREA: "408",
  VIETNAM: "704",
} as const;

function extractCountry(id: string) {
  const feature = (allCountries as GeoJSON.FeatureCollection).features.find(
    (f) => f.id === id
  );
  if (!feature) throw new Error(`Country not found in GeoJSON: ${id}`);
  return {
    type: "FeatureCollection" as const,
    features: [feature],
  };
}

export const SOUTH_KOREA = extractCountry(COUNTRY_IDS.SOUTH_KOREA);
export const NORTH_KOREA = extractCountry(COUNTRY_IDS.NORTH_KOREA);
export const VIETNAM = extractCountry(COUNTRY_IDS.VIETNAM);
