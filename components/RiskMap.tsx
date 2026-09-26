"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { Project, RiskLevel } from "@/lib/types";
import { RISK_HEX } from "@/lib/risk";
import Link from "next/link";

function pinIcon(color: string, selected?: boolean) {
  const size = selected ? 38 : 30;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="4.5" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "yb-pin",
    iconSize: [size, size * 1.5],
    iconAnchor: [size / 2, size * 1.5],
    popupAnchor: [0, -size * 1.3],
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 7);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function RiskMap({
  projects,
  selectedId,
  onSelect,
  height = 560,
  extraMarker,
}: {
  projects: Project[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  height?: number;
  extraMarker?: { lat: number; lng: number; label: string };
}) {
  const points: [number, number][] = projects.map((p) => [p.lat, p.lng]);
  if (extraMarker) points.push([extraMarker.lat, extraMarker.lng]);

  return (
    <div style={{ height }} className="overflow-hidden rounded-lg">
      <MapContainer
        center={[22.5, 79]}
        zoom={5}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", background: "#eef3f0" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {projects.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={pinIcon(RISK_HEX[p.riskLevel], p.id === selectedId)}
            eventHandlers={{ click: () => onSelect?.(p.id) }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-forest-700">{p.name}</p>
                <p className="text-ink/60">
                  {p.district}, {p.state}
                </p>
                <p className="mt-1">
                  <span className="font-medium">{p.riskLevel}</span> \u00b7 {p.riskProbability}%
                </p>
                <Link href={`/projects/${p.id}`} className="mt-1.5 inline-block text-forest-600 underline">
                  Open project
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        {extraMarker && (
          <Marker position={[extraMarker.lat, extraMarker.lng]} icon={pinIcon("#0f2f24", true)}>
            <Popup>{extraMarker.label}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
