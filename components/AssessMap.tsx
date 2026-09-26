"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Project } from "@/lib/types";
import { RISK_HEX } from "@/lib/risk";

function pinIcon(color: string, size = 30) {
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
  });
}

function ClickCatcher({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function AssessMap({
  projects,
  selected,
  onPick,
}: {
  projects: Project[];
  selected: { lat: number; lng: number };
  onPick: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer center={[selected.lat, selected.lng]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickCatcher onPick={onPick} />
      {projects.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(RISK_HEX[p.riskLevel], 24)} />
      ))}
      <Marker position={[selected.lat, selected.lng]} icon={pinIcon("#0f2f24", 34)} />
    </MapContainer>
  );
}
