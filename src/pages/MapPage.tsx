import { useEffect, useRef } from "react";
import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import { TbMap2, TbRuler, TbPolygon } from "react-icons/tb";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const CENTER: LatLngExpression = [25.2048, 55.2708];

const sitePolygon: LatLngExpression[] = [
  [25.2058, 55.2698],
  [25.2058, 55.2718],
  [25.2042, 55.2718],
  [25.2042, 55.2698],
];

const buildingFootprints: { name: string; coords: LatLngExpression[]; color: string }[] = [
  {
    name: "Tower A",
    color: "#34d399",
    coords: [
      [25.2054, 55.2702],
      [25.2054, 55.2708],
      [25.2048, 55.2708],
      [25.2048, 55.2702],
    ],
  },
  {
    name: "Podium",
    color: "#60a5fa",
    coords: [
      [25.2048, 55.2700],
      [25.2048, 55.2714],
      [25.2044, 55.2714],
      [25.2044, 55.2700],
    ],
  },
];

function MapSetup() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function MapPage() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Site & Context Map" subtitle="GIS mapping and geospatial analysis — Dubai, UAE" />
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <MetricCard label="Site Area" value={3200} unit="m²" icon={<TbPolygon />} variant="green" />
          <MetricCard label="Plot Ratio" value={2.8} icon={<TbRuler />} variant="default" />
          <MetricCard label="Ground Coverage" value={42} unit="%" icon={<TbMap2 />} variant="water" />
        </div>

        {/* Map */}
        <div className="flex-1 rounded-lg border border-border overflow-hidden min-h-[400px]">
          <MapContainer center={CENTER} zoom={17} className="h-full w-full" style={{ background: "hsl(220 20% 7%)" }}>
            <MapSetup />
            <TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Polygon positions={sitePolygon} pathOptions={{ color: "#22d3ee", weight: 2, fillColor: "#22d3ee", fillOpacity: 0.08, dashArray: "6 4" }} />
            {buildingFootprints.map((b) => (
              <Polygon key={b.name} positions={b.coords} pathOptions={{ color: b.color, weight: 2, fillColor: b.color, fillOpacity: 0.25 }}>
                <Popup><span className="font-mono text-xs">{b.name}</span></Popup>
              </Polygon>
            ))}
            <Marker position={CENTER}>
              <Popup><span className="font-mono text-xs">Site Center<br/>25.2048°N, 55.2708°E</span></Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
