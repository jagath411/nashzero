import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { TbBuildingSkyscraper, TbSearch, TbMapPin, TbTrash } from "react-icons/tb";
import * as turf from "@turf/turf";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function DrawHandler({ points, setPoints }: { points: [number, number][]; setPoints: (p: [number, number][]) => void }) {
  useMapEvents({
    click(e) {
      setPoints([...points, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
}

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 17, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [points, setPoints] = useState<[number, number][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const { user } = useAuth();
  const { addProject } = useProject();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.length > 0) {
        setFlyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch {
      // fallback
    }
  };

  const handleCreateProject = () => {
    if (points.length < 3) return;
    const poly = turf.polygon([[...points.map(p => [p[1], p[0]]), [points[0][1], points[0][0]]]]);
    const area = turf.area(poly);
    const center = turf.centroid(poly);
    const id = `proj-${Date.now()}`;
    addProject({
      id,
      name: search || "New Project",
      location: search,
      site: {
        coordinates: points,
        center: [center.geometry.coordinates[1], center.geometry.coordinates[0]],
        area,
      },
      createdAt: new Date().toISOString(),
    });
    navigate(`/project/${id}/context`);
  };

  return (
    <div className="h-screen w-screen relative">
      {/* Map */}
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={13}
        className="h-full w-full z-0"
        style={{ background: "#e8e4d8" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        <FlyToLocation coords={flyTo} />
        {drawing && <DrawHandler points={points} setPoints={setPoints} />}
        {points.length >= 3 && (
          <Polygon
            positions={points}
            pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.2, weight: 2 }}
          />
        )}
      </MapContainer>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <TbBuildingSkyscraper className="text-primary-foreground" size={18} />
          </div>
          <span className="text-lg font-bold text-foreground drop-shadow-lg">NashZero</span>
        </div>
        <div>
          {user ? (
            <span className="text-sm text-foreground bg-card/80 backdrop-blur px-3 py-1.5 rounded-md">{user.name}</span>
          ) : (
            <Link to="/signin">
              <Button variant="outline" size="sm" className="bg-card/80 backdrop-blur">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Center search */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] w-full max-w-lg px-4">
        {!drawing && points.length === 0 && (
          <div className="space-y-3">
            <div className="bg-card/90 backdrop-blur-lg rounded-xl p-1 shadow-2xl border border-border flex">
              <div className="flex items-center px-3 text-muted-foreground">
                <TbSearch size={18} />
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Locate your site and mark boundary..."
                className="border-0 bg-transparent focus-visible:ring-0 text-foreground"
              />
              <Button onClick={handleSearch} size="sm" className="m-1">Search</Button>
            </div>
            {flyTo && (
              <Button onClick={() => setDrawing(true)} className="w-full gap-2" variant="default">
                <TbMapPin size={16} /> Start Drawing Boundary
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Drawing controls */}
      {drawing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-3">
          <div className="bg-card/90 backdrop-blur-lg rounded-xl px-4 py-3 shadow-2xl border border-border flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Click on map to add points ({points.length} placed)
            </p>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => { setPoints([]); setDrawing(false); }}
              className="gap-1"
            >
              <TbTrash size={14} /> Reset
            </Button>
            {points.length >= 3 && (
              <Button size="sm" onClick={handleCreateProject} className="gap-1">
                Create Project
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
