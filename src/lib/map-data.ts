/**
 * Centralized map data for the Odyssey route map.
 * Single source of truth shared between the Leaflet Map component
 * and the InteractiveMap details panel.
 */

export interface CityData {
  id: string;
  nameKey: string; // i18n key under Itinerary.steps.<nameKey>
  lat: number;
  lng: number;
  country: "korea" | "vietnam";
  order: number; // chronological order in the trip
  /** Direction for the permanent label tooltip to prevent overlap */
  labelDir: "left" | "right" | "bottom" | "top";
  /** Extra vertical offset for the label in pixels */
  labelOffsetY: number;
}

export interface RouteSegment {
  id: string;
  from: string; // city id
  to: string;   // city id
  type: "flight" | "land";
}

/** All 9 cities displayed on the map, in chronological trip order.
 *  labelDir alternates left/right for the Vietnam cluster to prevent overlap. */
export const CITIES: CityData[] = [
  {
    id: "seoul",
    nameKey: "seoul",
    lat: 37.5665,
    lng: 126.978,
    country: "korea",
    order: 1,
    labelDir: "right",
    labelOffsetY: 0,
  },
  {
    id: "jeju",
    nameKey: "jeju",
    lat: 33.4996,
    lng: 126.5312,
    country: "korea",
    order: 2,
    labelDir: "right",
    labelOffsetY: 0,
  },
  {
    id: "hanoi1",
    nameKey: "hanoi1",
    lat: 21.0285,
    lng: 105.8542,
    country: "vietnam",
    order: 3,
    labelDir: "left",
    labelOffsetY: -4,
  },
  {
    id: "hoian",
    nameKey: "hoian",
    lat: 15.8801,
    lng: 108.338,
    country: "vietnam",
    order: 4,
    labelDir: "right",
    labelOffsetY: 2,
  },
  {
    id: "danang",
    nameKey: "danang",
    lat: 16.0544,
    lng: 108.2022,
    country: "vietnam",
    order: 5,
    labelDir: "left",
    labelOffsetY: -2,
  },
  {
    id: "hue",
    nameKey: "hue",
    lat: 16.4637,
    lng: 107.5909,
    country: "vietnam",
    order: 6,
    labelDir: "right",
    labelOffsetY: 2,
  },
  {
    id: "quangbinh",
    nameKey: "quangbinh",
    lat: 17.4685,
    lng: 106.5997,
    country: "vietnam",
    order: 7,
    labelDir: "left",
    labelOffsetY: -2,
  },
  {
    id: "vinh",
    nameKey: "vinh",
    lat: 18.6796,
    lng: 105.6813,
    country: "vietnam",
    order: 8,
    labelDir: "right",
    labelOffsetY: 2,
  },
  {
    id: "ninhbinh",
    nameKey: "ninhbinh",
    lat: 20.2506,
    lng: 105.9745,
    country: "vietnam",
    order: 9,
    labelDir: "left",
    labelOffsetY: 0,
  },
];

/** Route segments connecting the cities in chronological order.
 *  Hanoi → Hoi An is a flight, then land route goes back north. */
export const ROUTE_SEGMENTS: RouteSegment[] = [
  { id: "seoul-jeju", from: "seoul", to: "jeju", type: "flight" },
  { id: "jeju-hanoi", from: "jeju", to: "hanoi1", type: "flight" },
  { id: "hanoi-hoian", from: "hanoi1", to: "hoian", type: "flight" },
  { id: "hoian-danang", from: "hoian", to: "danang", type: "land" },
  { id: "danang-hue", from: "danang", to: "hue", type: "land" },
  { id: "hue-quangbinh", from: "hue", to: "quangbinh", type: "land" },
  { id: "quangbinh-vinh", from: "quangbinh", to: "vinh", type: "land" },
  { id: "vinh-ninhbinh", from: "vinh", to: "ninhbinh", type: "land" },
];

/** Helper: get a city by its id */
export function getCityById(id: string): CityData | undefined {
  return CITIES.find((c) => c.id === id);
}

/** Map center: midpoint between Seoul and Hoi An, with the Vietnam coast visible */
export const MAP_CENTER: [number, number] = [26.7, 116];
export const MAP_ZOOM = 6;
export const MAP_MIN_ZOOM = 5;
export const MAP_MAX_ZOOM = 10;

/**
 * Generate interpolated bezier control points for a curved flight path.
 * Returns an array of [lat, lng] points that Leaflet can render as a Polyline.
 */
export function generateFlightCurve(
  from: [number, number],
  to: [number, number],
  numPoints: number = 60
): [number, number][] {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;

  // Control point: offset eastward (toward the sea) for a natural flight arc
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  // Arc eastward over the sea — natural for flights along the East Asian coast
  const cpLat = midLat + 1.5;
  const cpLng = midLng + 6;

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Quadratic bezier
    const lat = (1 - t) ** 2 * lat1 + 2 * (1 - t) * t * cpLat + t ** 2 * lat2;
    const lng = (1 - t) ** 2 * lng1 + 2 * (1 - t) * t * cpLng + t ** 2 * lng2;
    points.push([lat, lng]);
  }

  return points;
}

/** Get midpoint of a flight route (for placing airplane icon) */
export function getFlightMidpoint(
  from: [number, number],
  to: [number, number]
): [number, number] {
  const points = generateFlightCurve(from, to, 60);
  return points[Math.floor(points.length / 2)];
}
