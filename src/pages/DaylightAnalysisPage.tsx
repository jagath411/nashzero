import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";
import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/button";
import { TbSun, TbEye, TbTarget, TbGrid3X3 } from "react-icons/tb";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from "recharts";

// Daylight factor grid data
const generateDaylightGrid = (size: number = 20, resolution: number = 10) => {
  const grid = [];
  for (let x = 0; x < resolution; x++) {
    for (let z = 0; z < resolution; z++) {
      const posX = (x / (resolution - 1) - 0.5) * size;
      const posZ = (z / (resolution - 1) - 0.5) * size;

      // Simulate daylight factor based on position and obstructions
      const distanceFromCenter = Math.sqrt(posX * posX + posZ * posZ);
      const obstructionFactor = Math.max(0, 1 - distanceFromCenter / (size * 0.4));
      const daylightFactor = (0.3 + Math.random() * 0.4) * obstructionFactor;

      grid.push({
        x: posX,
        z: posZ,
        daylightFactor: +daylightFactor.toFixed(3),
        udi: calculateUDI(daylightFactor),
        sdi: calculateSDI(daylightFactor)
      });
    }
  }
  return grid;
};

const calculateUDI = (daylightFactor: number): number => {
  // Useful Daylight Illuminance: 100-2000 lux (roughly 1-20% daylight factor)
  if (daylightFactor >= 0.01 && daylightFactor <= 0.20) return 1;
  if (daylightFactor > 0.20) return 0.5; // Over-lit
  return 0; // Under-lit
};

const calculateSDI = (daylightFactor: number): number => {
  // Spatial Daylight Autonomy: >300 lux for 50% of occupied hours
  return daylightFactor > 0.03 ? 1 : 0;
};

function DaylightGrid({ data, showGrid }: { data: any[], showGrid: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const colorMap = useMemo(() => {
    return data.map((point) => {
      const factor = point.daylightFactor;
      if (factor < 0.01) return new THREE.Color(0x1e40af); // Dark blue - very low
      if (factor < 0.02) return new THREE.Color(0x3b82f6); // Blue - low
      if (factor < 0.05) return new THREE.Color(0x10b981); // Green - good
      if (factor < 0.10) return new THREE.Color(0xf59e0b); // Yellow - high
      return new THREE.Color(0xef4444); // Red - very high
    });
  }, [data]);

  useFrame(() => {
    if (meshRef.current) {
      data.forEach((point, i) => {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(point.x, point.daylightFactor * 10, point.z);
        meshRef.current!.setMatrixAt(i, matrix);
        meshRef.current!.setColorAt(i, colorMap[i]);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (!showGrid) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, data.length]}>
      <boxGeometry args={[0.8, 0.1, 0.8]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}

function DaylightAnalysisScene({ showGrid }: { showGrid: boolean }) {
  const gridData = useMemo(() => generateDaylightGrid(), []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      <Grid
        args={[40, 40]} cellSize={2} cellThickness={0.5} cellColor="#d1d5db"
        sectionSize={10} sectionThickness={1} sectionColor="#9ca3af"
        fadeDistance={60} position={[0, 0, 0]}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#e8e4d8" />
      </mesh>

      {/* Sample building for context */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[8, 4, 8]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.7} />
      </mesh>

      <DaylightGrid data={gridData} showGrid={showGrid} />

      <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport />
      </GizmoHelper>
    </>
  );
}

// Analysis data
const daylightMetrics = [
  { hour: "6:00", avgFactor: 0.012, udi: 0.15, sdi: 0.08 },
  { hour: "9:00", avgFactor: 0.045, udi: 0.72, sdi: 0.65 },
  { hour: "12:00", avgFactor: 0.089, udi: 0.88, sdi: 0.82 },
  { hour: "15:00", avgFactor: 0.067, udi: 0.79, sdi: 0.71 },
  { hour: "18:00", avgFactor: 0.023, udi: 0.34, sdi: 0.28 },
];

const spatialDistribution = [
  { zone: "North", avgFactor: 0.042, udi: 0.68, sdi: 0.61 },
  { zone: "East", avgFactor: 0.056, udi: 0.74, sdi: 0.69 },
  { zone: "South", avgFactor: 0.078, udi: 0.82, sdi: 0.78 },
  { zone: "West", avgFactor: 0.051, udi: 0.71, sdi: 0.64 },
  { zone: "Center", avgFactor: 0.065, udi: 0.76, sdi: 0.72 },
];

export default function DaylightAnalysisPage() {
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div>
      <PageHeader title="Daylight Analysis" subtitle="Daylight factor distribution, UDi and SDi metrics for occupant comfort" />
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Avg Daylight Factor" value={5.2} unit="%" icon={<TbSun />} variant="solar" />
          <MetricCard label="UDi Score" value={78} unit="%" icon={<TbEye />} variant="energy" trend={{ value: 5, label: "above target" }} />
          <MetricCard label="SDi Score" value={72} unit="%" icon={<TbTarget />} variant="default" />
          <MetricCard label="Over-lit Areas" value={12} unit="%" icon={<TbSun />} variant="heat" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* 3D Visualization */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Daylight Factor Grid</h3>
                <p className="text-xs text-muted-foreground font-mono">3D visualization of daylight distribution</p>
              </div>
              <Button
                size="sm"
                variant={showGrid ? "default" : "outline"}
                onClick={() => setShowGrid(!showGrid)}
                className="gap-1.5"
              >
                <TbGrid3X3 size={14} />
                {showGrid ? "Hide Grid" : "Show Grid"}
              </Button>
            </div>
            <div className="h-96 rounded border border-border/50 overflow-hidden">
              <Canvas>
                <DaylightAnalysisScene showGrid={showGrid} />
              </Canvas>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {[
                { label: "<1%", color: "bg-blue-600" },
                { label: "1-2%", color: "bg-blue-400" },
                { label: "2-5%", color: "bg-green-500" },
                { label: "5-10%", color: "bg-yellow-500" },
                { label: ">10%", color: "bg-red-500" }
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Spatial Distribution */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Spatial Distribution</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Daylight metrics by zone</p>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="avgFactor" type="number" domain={[0, 0.1]} name="Daylight Factor" unit="%" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} />
                <YAxis dataKey="udi" type="number" domain={[0, 1]} name="UDi" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} />
                <ZAxis dataKey="sdi" range={[50, 200]} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 11 }} />
                <Scatter name="Zones" data={spatialDistribution} fill="hsl(36 100% 55%)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Analysis */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Hourly Daylight Performance</h3>
          <p className="text-xs text-muted-foreground mb-4 font-mono">Daylight factor, UDi, and SDi throughout the day</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={daylightMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="hour" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} />
              <YAxis yAxisId="factor" orientation="left" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} domain={[0, 0.1]} />
              <YAxis yAxisId="metrics" orientation="right" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} domain={[0, 1]} />
              <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
              <Line yAxisId="factor" type="monotone" dataKey="avgFactor" stroke="hsl(45 93% 58%)" strokeWidth={2} dot={{ r: 4 }} name="Avg Daylight Factor" />
              <Line yAxisId="metrics" type="monotone" dataKey="udi" stroke="hsl(162 72% 45%)" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3 }} name="UDi" />
              <Line yAxisId="metrics" type="monotone" dataKey="sdi" stroke="hsl(199 89% 48%)" strokeWidth={1.5} strokeDasharray="2 2" dot={{ r: 3 }} name="SDi" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}