import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TbDraw, TbPolygon, TbRectangle, TbTrash, TbCheck } from "react-icons/tb";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface SiteDrawerProps {
  onBoundaryComplete?: (coordinates: [number, number][]) => void;
}

export default function SiteDrawer({ onBoundaryComplete }: SiteDrawerProps) {
  const map = useMap();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState<"polygon" | "rectangle" | null>(null);
  const [points, setPoints] = useState<[number, number][]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const pointMarkersRef = useRef<L.CircleMarker[]>([]);

  const startDrawing = (mode: "polygon" | "rectangle") => {
    setDrawMode(mode);
    setIsDrawing(true);
    setPoints([]);
    clearDrawing();

    map.dragging.disable();
    map.on("click", handleMapClick);

    if (mode === "rectangle") {
      map.once("click", handleRectStart);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!isDrawing) return;

    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    const newPoints = [...points, newPoint];
    setPoints(newPoints);

    // Add visual marker
    const marker = L.circleMarker([newPoint[0], newPoint[1]], {
      radius: 4,
      fillColor: "#22d3ee",
      color: "#06b6d4",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(map);

    pointMarkersRef.current.push(marker);

    // Update polyline
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }

    if (newPoints.length >= 2) {
      polylineRef.current = L.polyline(newPoints, {
        color: "#22d3ee",
        weight: 2,
        dashArray: "6 4",
      }).addTo(map);
    }

    // Auto-complete on 4 points for rectangle
    if (drawMode === "rectangle" && newPoints.length === 2) {
      completeBoundary(newPoints);
    }
  };

  const handleRectStart = () => {
    map.once("click", (e: L.LeafletMouseEvent) => {
      const rect = L.rectangle(
        [
          [points[0][0], points[0][1]],
          [e.latlng.lat, e.latlng.lng],
        ],
        {
          color: "#22d3ee",
          weight: 2,
          fillColor: "#22d3ee",
          fillOpacity: 0.15,
        }
      ).addTo(map);

      polygonRef.current = rect as any;
      const bounds = rect.getBounds();
      const vertices: [number, number][] = [
        [bounds.getNorth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()],
        [bounds.getSouth(), bounds.getEast()],
        [bounds.getSouth(), bounds.getWest()],
      ];

      completeBoundary(vertices);
    });
  };

  const completeBoundary = (coordinates: [number, number][]) => {
    if (coordinates.length >= 3) {
      if (polylineRef.current) map.removeLayer(polylineRef.current);

      // Show final polygon
      const finalPolygon = L.polygon(coordinates, {
        color: "#22d3ee",
        weight: 2,
        fillColor: "#06b6d4",
        fillOpacity: 0.1,
        dashArray: "6 4",
      }).addTo(map);

      polygonRef.current = finalPolygon;

      // Fit map to bounds
      const group = L.featureGroup([finalPolygon]);
      map.fitBounds(group.getBounds(), { padding: [50, 50] });

      stopDrawing();
      onBoundaryComplete?.(coordinates);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setDrawMode(null);
    map.dragging.enable();
    map.off("click", handleMapClick);
  };

  const clearDrawing = () => {
    setPoints([]);

    pointMarkersRef.current.forEach((marker) => map.removeLayer(marker));
    pointMarkersRef.current = [];

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }
  };

  const handleCancel = () => {
    stopDrawing();
    clearDrawing();
  };

  return (
    <div className="absolute bottom-6 left-6 z-20 space-y-3">
      {/* Main Drawing Tools */}
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg space-y-2">
        <p className="text-xs font-semibold text-foreground">Draw Site Boundary</p>

        {!isDrawing ? (
          <div className="space-y-2">
            <Button
              size="sm"
              variant="default"
              className="w-full gap-2 text-xs"
              onClick={() => startDrawing("polygon")}
            >
              <TbPolygon size={14} />
              Polygon (Click to add points)
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2 text-xs"
              onClick={() => startDrawing("rectangle")}
            >
              <TbRectangle size={14} />
              Rectangle (2 clicks)
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="px-3 py-2 bg-muted/50 rounded border border-border/50">
              <p className="text-xs text-foreground">
                {drawMode === "rectangle"
                  ? "Click two opposite corners"
                  : `Points: ${points.length}`}
              </p>
              <ul className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                <li>• Click on map to add points</li>
                <li>• Minimum 3 points needed</li>
                <li>• Use ✓ to finish</li>
              </ul>
            </div>

            <Button
              size="sm"
              variant="default"
              className="w-full gap-2 text-xs"
              onClick={() => completeBoundary(points)}
              disabled={points.length < 3 && drawMode !== "rectangle"}
            >
              <TbCheck size={14} />
              Finish {drawMode === "rectangle" ? "Rectangle" : "Polygon"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2 text-xs"
              onClick={handleCancel}
            >
              <TbTrash size={14} />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isDrawing && (
        <div className="bg-card/80 backdrop-blur border border-border rounded-lg p-3 text-xs text-muted-foreground max-w-xs space-y-1">
          <p className="font-mono font-semibold text-foreground">💡 Drawing Tips:</p>
          <ul className="space-y-0.5 font-mono">
            <li>• Polygon: Create irregular shapes</li>
            <li>• Rectangle: Quick rectangular bounds</li>
            <li>• Click inside search box to clear</li>
          </ul>
        </div>
      )}
    </div>
  );
}
