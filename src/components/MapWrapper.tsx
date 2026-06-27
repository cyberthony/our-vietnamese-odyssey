"use client";

import dynamic from "next/dynamic";
import type { MapProps } from "./Map";
import MapSkeleton from "./MapSkeleton";

/**
 * Lazy-loading wrapper for the Leaflet map.
 * Uses next/dynamic with ssr: false to avoid "window is not defined" errors
 * during static export build.
 */
const LeafletMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default function MapWrapper(props: MapProps) {
  return <LeafletMap {...props} />;
}
