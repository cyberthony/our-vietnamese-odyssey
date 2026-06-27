"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  GeoJSON,
  useMap,
  Tooltip,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  CITIES,
  ROUTE_SEGMENTS,
  generateFlightCurve,
  getFlightMidpoint,
  MAP_CENTER,
  MAP_ZOOM,
  MAP_MIN_ZOOM,
  MAP_MAX_ZOOM,
  getCityById,
} from "@/lib/map-data";
import { SOUTH_KOREA, NORTH_KOREA, VIETNAM } from "@/lib/geo-data";

// ── Fix Leaflet default icon paths in bundled environments ──
// @ts-expect-error - Leaflet internal API
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Tile layer URLs ──
const TILE_LIGHT =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

// ── Props ──
export interface MapProps {
  selectedId: string;
  onSelectCity: (id: string) => void;
  className?: string;
}

// ── Premium SVG pin marker factory ──
// Renders a teardrop pin shape with the trip order number inside.
function createPinIcon(
  order: number,
  isSelected: boolean,
  isLight: boolean,
  isKorea: boolean
): L.DivIcon {
  // Colors: korea → sage green tone, vietnam → terracotta / rose tone
  const baseColor = isKorea
    ? isLight
      ? "#CCD5AE"
      : "#a3b18a"
    : isLight
    ? "#D4A373"
    : "#E8C5C8";
  const selectedColor = isKorea ? "#a3b18a" : "#D4A373";
  const fill = isSelected ? selectedColor : baseColor;
  const size = isSelected ? 42 : 34;
  const shadow = isSelected
    ? "0 4px 20px rgba(0,0,0,0.35)"
    : "0 2px 8px rgba(0,0,0,0.25)";

  const svgPin = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 40" style="display:block; filter: drop-shadow(${shadow});">
      <defs>
        <radialGradient id="pinGrad-${order}" cx="40%" cy="30%">
          <stop offset="0%" stop-color="white" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Teardrop pin shape -->
      <path
        d="M16 0 C7.2 0 0 7.2 0 16 C0 24 16 40 16 40 C16 40 32 24 32 16 C32 7.2 24.8 0 16 0 Z"
        fill="${fill}"
      />
      <!-- Highlight gradient overlay -->
      <path
        d="M16 0 C7.2 0 0 7.2 0 16 C0 24 16 40 16 40 C16 40 32 24 32 16 C32 7.2 24.8 0 16 0 Z"
        fill="url(#pinGrad-${order})"
      />
      <!-- Inner circle for number -->
      <circle cx="16" cy="14" r="10" fill="white" fill-opacity="${isSelected ? "1" : "0.95"}" />
      <text
        x="16"
        y="18"
        text-anchor="middle"
        font-family="var(--font-plus-jakarta), sans-serif"
        font-size="12"
        font-weight="800"
        fill="${isLight ? "#1E2022" : "#18181b"}"
      >${order}</text>
      ${
        isSelected
          ? `<circle cx="16" cy="14" r="14" fill="none" stroke="${selectedColor}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6">
               <animate attributeName="r" from="14" to="20" dur="1.5s" repeatCount="indefinite"/>
               <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
             </circle>`
          : ""
      }
    </svg>`;

  return L.divIcon({
    className: "odyssey-pin-marker",
    html: svgPin,
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // bottom center of the pin
    popupAnchor: [0, -size],
  });
}

// ── Fly-to controller ──
function FlyController({ selectedId }: { selectedId: string }) {
  const map = useMap();
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (selectedId !== prevId.current) {
      prevId.current = selectedId;
      const city = getCityById(selectedId);
      if (city) {
        map.flyTo([city.lat, city.lng], Math.max(map.getZoom(), 7), {
          duration: 1.2,
          easeLinearity: 0.25,
        });
      }
    }
  }, [selectedId, map]);

  return null;
}

// ── Bounds limiter ──
function BoundsLimiter() {
  const map = useMap();

  useEffect(() => {
    const southWest = L.latLng(8, 92);
    const northEast = L.latLng(46, 148);
    map.setMaxBounds(L.latLngBounds(southWest, northEast));
    map.setMinZoom(MAP_MIN_ZOOM);
    map.setMaxZoom(MAP_MAX_ZOOM);
  }, [map]);

  return null;
}

// ── Theme-aware tile switcher ──
function ThemeTileSwitcher() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <TileLayer
      key={isLight ? "light" : "dark"}
      url={isLight ? TILE_LIGHT : TILE_DARK}
      attribution={TILE_ATTR}
    />
  );
}

// ── Main Map Component ──
export default function Map({ selectedId, onSelectCity, className }: MapProps) {
  const t = useTranslations("Itinerary");
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Build route polylines ──
  const flightRoutes = useMemo(() => {
    return ROUTE_SEGMENTS.filter((s) => s.type === "flight").map((seg) => {
      const fromCity = getCityById(seg.from)!;
      const toCity = getCityById(seg.to)!;
      const points = generateFlightCurve(
        [fromCity.lat, fromCity.lng],
        [toCity.lat, toCity.lng]
      );
      return { id: seg.id, points, from: fromCity, to: toCity };
    });
  }, []);

  const landRoutes = useMemo(() => {
    return ROUTE_SEGMENTS.filter((s) => s.type === "land").map((seg) => {
      const fromCity = getCityById(seg.from)!;
      const toCity = getCityById(seg.to)!;
      return {
        id: seg.id,
        points: [
          [fromCity.lat, fromCity.lng] as [number, number],
          [toCity.lat, toCity.lng] as [number, number],
        ],
      };
    });
  }, []);

  const flightColor = isLight ? "#D4A373" : "#E8C5C8";
  const landColor = isLight ? "#CCD5AE" : "#a3b18a";

  return (
    <div
      className={`w-full rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm ${className ?? ""}`}
    >
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-[420px] md:h-[480px] lg:h-[520px] rounded-3xl z-0"
        style={{ background: isLight ? "#f4f4f4" : "#0d0d0e" }}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
        {/* Tile layer */}
        <ThemeTileSwitcher />

        {/* ── Country tint overlays (semi-transparent) ── */}
        <GeoJSON
          key={`nk-${isLight}`}
          data={NORTH_KOREA}
          pathOptions={{
            color: isLight ? "#a3b18a" : "#6b7f4a",
            weight: 1,
            fillColor: isLight ? "#CCD5AE" : "#5a6b3e",
            fillOpacity: isLight ? 0.25 : 0.3,
          }}
        />
        <GeoJSON
          key={`sk-${isLight}`}
          data={SOUTH_KOREA}
          pathOptions={{
            color: isLight ? "#8fa86b" : "#7a8f5a",
            weight: 1.5,
            fillColor: isLight ? "#CCD5AE" : "#5a6b3e",
            fillOpacity: isLight ? 0.35 : 0.4,
          }}
        />
        <GeoJSON
          key={`vn-${isLight}`}
          data={VIETNAM}
          pathOptions={{
            color: isLight ? "#c4935e" : "#d4a0a5",
            weight: 1.5,
            fillColor: isLight ? "#D4A373" : "#E8C5C8",
            fillOpacity: isLight ? 0.3 : 0.35,
          }}
        />

        {/* Styled zoom control */}
        <ZoomControl position="bottomright" />

        {/* Controllers */}
        <FlyController selectedId={selectedId} />
        <BoundsLimiter />

        {/* ── Flight routes (dashed arcs with glow) ── */}
        {flightRoutes.map((route) => (
          <React.Fragment key={route.id}>
            {/* Glow layer */}
            <Polyline
              positions={route.points}
              pathOptions={{
                color: flightColor,
                weight: 6,
                dashArray: "8, 6",
                opacity: 0.2,
              }}
            />
            {/* Core line */}
            <Polyline
              positions={route.points}
              pathOptions={{
                color: flightColor,
                weight: 2.5,
                dashArray: "8, 6",
                opacity: 0.85,
              }}
            />
          </React.Fragment>
        ))}

        {/* Flight midpoint airplane markers */}
        {flightRoutes.map((route) => {
          const mid = getFlightMidpoint(
            [route.from.lat, route.from.lng],
            [route.to.lat, route.to.lng]
          );
          const planeIcon = L.divIcon({
            className: "odyssey-plane-marker",
            html: `<div style="
              display:flex;align-items:center;justify-content:center;
              width:26px;height:26px;border-radius:50%;
              background:${isLight ? "#ffffffdd" : "#18181bdd"};
              backdrop-filter:blur(4px);font-size:14px;line-height:1;
              border:1px solid ${isLight ? "#e4e4e7" : "#27272a"};
            ">✈️</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });
          return (
            <Marker
              key={`plane-${route.id}`}
              position={mid}
              icon={planeIcon}
              interactive={false}
            />
          );
        })}

        {/* ── Land routes (dashed with glow) ── */}
        {landRoutes.map((route) => (
          <React.Fragment key={route.id}>
            {/* Glow layer */}
            <Polyline
              positions={route.points}
              pathOptions={{
                color: landColor,
                weight: 6,
                dashArray: "6, 4",
                opacity: 0.2,
              }}
            />
            {/* Core line */}
            <Polyline
              positions={route.points}
              pathOptions={{
                color: landColor,
                weight: 3,
                dashArray: "6, 4",
                opacity: 0.9,
              }}
            />
          </React.Fragment>
        ))}

        {/* ── City markers ── */}
        {CITIES.map((city) => {
          const isSelected = selectedId === city.id;
          const isKorean = city.country === "korea";
          const icon = createPinIcon(city.order, isSelected, isLight, isKorean);
          const label = t(`steps.${city.nameKey}.title`).split(" (")[0];

          return (
            <Marker
              key={city.id}
              position={[city.lat, city.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectCity(city.id),
              }}
            >
              {/* Permanent label — direction alternates to prevent overlap */}
              <Tooltip
                permanent
                direction={city.labelDir}
                offset={[
                  city.labelDir === "left" ? -10 : city.labelDir === "right" ? 10 : 0,
                  city.labelOffsetY +
                    (city.labelDir === "bottom" ? 8 : city.labelDir === "top" ? -8 : 0),
                ]}
                className="odyssey-city-tooltip"
              >
                <span
                  style={{
                    fontFamily: "var(--font-plus-jakarta), sans-serif",
                    fontSize: isSelected ? "12px" : "10.5px",
                    fontWeight: isSelected ? 800 : 600,
                    letterSpacing: "0.02em",
                    color: isSelected
                      ? isLight
                        ? "#D4A373"
                        : "#E8C5C8"
                      : isLight
                      ? "#3f3f46"
                      : "#d4d4d8",
                    background: isLight
                      ? isSelected
                        ? "#ffffff"
                        : "#ffffffee"
                      : isSelected
                      ? "#27272a"
                      : "#18181bee",
                    padding: isSelected ? "4px 12px" : "3px 10px",
                    borderRadius: "999px",
                    whiteSpace: "nowrap",
                    border: `1.5px solid ${
                      isSelected
                        ? isKorean
                          ? isLight
                            ? "#a3b18a"
                            : "#CCD5AE"
                          : "#D4A373"
                        : isLight
                        ? "#e4e4e7"
                        : "#3f3f46"
                    }`,
                    backdropFilter: "blur(6px)",
                    transition: "all 0.3s ease",
                    boxShadow: isSelected
                      ? "0 2px 12px rgba(0,0,0,0.15)"
                      : "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {label}
                </span>
              </Tooltip>

              {/* Popup on click */}
              <Popup className="odyssey-city-popup">
                <div
                  style={{
                    fontFamily: "var(--font-plus-jakarta), sans-serif",
                    minWidth: "170px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                      color: isKorean ? "#a3b18a" : "#D4A373",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {isKorean
                      ? "🇰🇷 Corée du Sud"
                      : "🇻🇳 Vietnam"}
                  </span>
                  <h3
                    style={{
                      fontFamily:
                        "var(--font-playfair), Georgia, serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      margin: "0 0 6px 0",
                      color: "#1E2022",
                    }}
                  >
                    {t(`steps.${city.nameKey}.title`)}
                  </h3>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#71717a",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <span>📅 {t(`steps.${city.nameKey}.date`)}</span>
                    <span>
                      🏨 {t(`steps.${city.nameKey}.hotel`)}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
