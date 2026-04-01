import { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import { TbMap2, TbRuler, TbPolygon } from "react-icons/tb";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import LocationSearch from "@/components/map/LocationSearch";
import SiteDrawer from "@/components/map/SiteDrawer";
import MapGuide from "@/components/map/MapGuide";

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DEFAULT_CENTER: LatLngExpression = [25.2048, 55.2708];

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
    // Set up map with better defaults
    map.invalidateSize();
    map.zoomControl.setPosition("bottomright");
  }, [map]);
  return null;
}

interface SiteData {
  name: string;
  lat: number;
  lng: number;
  boundary?: [number, number][];
}

export default function MapPage() {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(DEFAULT_CENTER);
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null);
  const [siteBoundary, setSiteBoundary] = useState<[number, number][]>([]);
  const [showGuide, setShowGuide] = useState(true);

  const handleLocationSelect = (location: { name: string; lat: number; lng: number }) => {
    setSelectedSite(location);
    setMapCenter([location.lat, location.lng]);
    setSiteBoundary([]); // Reset boundary when changing location
  };

  const handleBoundaryComplete = (coordinates: [number, number][]) => {
    setSiteBoundary(coordinates);
    if (selectedSite) {
      setSelectedSite({
        ...selectedSite,
        boundary: coordinates,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Site & Context Map" subtitle="GIS mapping and geospatial analysis — Define your project location and boundaries" />
      <div className="p-6 space-y-4 flex-1 flex flex-col relative">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            label="Site Area"
            value={siteBoundary.length > 0 ? 3200 : 0}
            unit="m²"
            icon={<TbPolygon />}
            variant={siteBoundary.length > 0 ? "green" : "default"}
          />
          <MetricCard label="Plot Ratio" value={siteBoundary.length > 0 ? 2.8 : 0} icon={<TbRuler />} variant="default" />
          <MetricCard label="Ground Coverage" value={siteBoundary.length > 0 ? 42 : 0} unit="%" icon={<TbMap2 />} variant="water" />
        </div>

        {/* Status Bar */}
        {(selectedSite || siteBoundary.length > 0) && (
          <div className="bg-muted/50 border border-border rounded-lg px-4 py-2 flex items-center justify-between">
            <div className="text-sm">
              {selectedSite && (
                <p className="text-foreground font-medium">
                  📍 {selectedSite.name}
                  {siteBoundary.length > 0 && ` • Boundary defined (${siteBoundary.length} points)`}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedSite(null);
                setSiteBoundary([]);
                setMapCenter(DEFAULT_CENTER);
              }}
              className="text-xs px-3 py-1 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 rounded-lg border border-border overflow-hidden min-h-[400px] relative">
          <MapContainer center={mapCenter} zoom={17} className="h-full w-full z-0" style={{ background: "hsl(220 20% 7%)" }}>
            <MapSetup />
            <TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Default site polygon */}
            {!selectedSite && (
              <>
                <Polygon
                  positions={sitePolygon}
                  pathOptions={{ color: "#22d3ee", weight: 2, fillColor: "#22d3ee", fillOpacity: 0.08, dashArray: "6 4" }}
                />
                {buildingFootprints.map((b) => (
                  <Polygon key={b.name} positions={b.coords} pathOptions={{ color: b.color, weight: 2, fillColor: b.color, fillOpacity: 0.25 }}>
                    <Popup>
                      <span className="font-mono text-xs">{b.name}</span>
                    </Popup>
                  </Polygon>
                ))}
                <Marker position={DEFAULT_CENTER}>
                  <Popup>
                    <span className="font-mono text-xs">
                      Site Center
                      <br />
                      25.2048°N, 55.2708°E
                    </span>
                  </Popup>
                </Marker>
              </>
            )}

            {/* User-drawn boundary */}
            {siteBoundary.length > 0 && (
              <Polygon
                positions={siteBoundary}
                pathOptions={{
                  color: "#22d3ee",
                  weight: 2,
                  fillColor: "#06b6d4",
                  fillOpacity: 0.15,
                  dashArray: "6 4",
                }}
              />
            )}

            {/* Location marker */}
            {selectedSite && (
              <Marker position={[selectedSite.lat, selectedSite.lng]}>
                <Popup>
                  <span className="font-mono text-xs">
                    {selectedSite.name}
                    <br />
                    {selectedSite.lat.toFixed(4)}°N, {selectedSite.lng.toFixed(4)}°E
                  </span>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Location Search Component */}
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            onClear={() => {
              setSelectedSite(null);
              setSiteBoundary([]);
              setMapCenter(DEFAULT_CENTER);
            }}
          />

          {/* Site Drawer Component */}
          {selectedSite && <SiteDrawer onBoundaryComplete={handleBoundaryComplete} />}

          {/* Map Guide */}
          {showGuide && <MapGuide onDismiss={() => setShowGuide(false)} />}
        </div>
      </div>
    </div>
  );
}
