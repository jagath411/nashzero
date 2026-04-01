import { useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Environment, PerspectiveCamera, Sky } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { TbPlus, TbChartBar, TbCompass } from "react-icons/tb";
import * as THREE from "three";
import LeftToolbar from "@/components/studio/LeftToolbar";
import RightToolbar from "@/components/studio/RightToolbar";
import SetupUnitsDialog from "@/components/studio/SetupUnitsDialog";
import RadiationPanel from "@/components/studio/RadiationPanel";
import ShadowControlPanel from "@/components/studio/ShadowControlPanel";
import LandscapeSelector from "@/components/studio/LandscapeSelector";
import TreePlacementPanel from "@/components/studio/TreePlacementPanel";
import DXFImport from "@/components/studio/DXFImport";

interface BuildingBlock {
  id: string;
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  type?: 'box' | 'dxf';
  geometry?: THREE.BufferGeometry;
}

function Building({ block, selected, onClick }: { block: BuildingBlock; selected: boolean; onClick: () => void }) {
  if (block.type === 'dxf' && block.geometry) {
    return (
      <mesh
        position={block.position}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        castShadow receiveShadow
      >
        <primitive object={block.geometry} />
        <meshStandardMaterial
          color={selected ? "#3b82f6" : block.color}
          transparent opacity={selected ? 0.9 : 0.8}
          roughness={0.4} metalness={0.1}
        />
        {selected && (
          <lineSegments>
            <edgesGeometry args={[block.geometry]} />
            <lineBasicMaterial color="#3b82f6" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
    );
  }

  return (
    <mesh
      position={[block.position[0], block.position[1] + block.dimensions[1] / 2, block.position[2]]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      castShadow receiveShadow
    >
      <boxGeometry args={block.dimensions} />
      <meshStandardMaterial
        color={selected ? "#3b82f6" : block.color}
        transparent opacity={selected ? 0.9 : 0.8}
        roughness={0.4} metalness={0.1}
      />
      {selected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...block.dimensions)]} />
          <lineBasicMaterial color="#3b82f6" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

function Scene({ blocks, selectedId, onSelect }: { blocks: BuildingBlock[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[30, 20, 30]} fov={50} />
      <Sky sunPosition={[100, 50, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[15, 30, 15]} intensity={1} castShadow shadow-mapSize={2048} />

      <Grid
        args={[200, 200]} cellSize={2} cellThickness={0.5} cellColor="#d1d5db"
        sectionSize={10} sectionThickness={1} sectionColor="#9ca3af"
        fadeDistance={80} position={[0, 0, 0]}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#e8e4d8" />
      </mesh>

      {blocks.map((block) => (
        <Building key={block.id} block={block} selected={selectedId === block.id} onClick={() => onSelect(block.id)} />
      ))}

      <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport />
      </GizmoHelper>
    </>
  );
}

const defaultBlocks: BuildingBlock[] = [
  { id: "tower-1", position: [0, 0, 0], dimensions: [8, 24, 8], color: "#93c5fd" },
  { id: "podium", position: [0, 0, 12], dimensions: [16, 6, 10], color: "#a5b4fc" },
  { id: "tower-2", position: [14, 0, 0], dimensions: [6, 18, 6], color: "#c4b5fd" },
];

export default function StudioPage() {
  const [blocks, setBlocks] = useState<BuildingBlock[]>(defaultBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [leftTool, setLeftTool] = useState("select");
  const [rightTool, setRightTool] = useState("");
  const [showUnits, setShowUnits] = useState(true);
  const [showShapeDialog, setShowShapeDialog] = useState(false);
  const [showLandscape, setShowLandscape] = useState(false);
  const [showTrees, setShowTrees] = useState(false);
  const [showDXFImport, setShowDXFImport] = useState(false);

  const handleDXFImport = useCallback((geometry: THREE.BufferGeometry, position: [number, number, number]) => {
    const id = `dxf-${Date.now()}`;
    setBlocks((prev) => [
      ...prev,
      {
        id,
        position,
        dimensions: [0, 0, 0], // Not used for DXF
        color: "#64748b",
        type: 'dxf',
        geometry
      },
    ]);
    setSelectedId(id);
    setShowDXFImport(false);
  }, []);

  const handleLeftTool = (id: string) => {
    setLeftTool(id);
    if (id === "draw") setShowShapeDialog(true);
    if (id === "terrain") setShowLandscape(true);
    if (id === "import") setShowDXFImport(true);
    if (id === "delete" && selectedId) {
      setBlocks((prev) => prev.filter((b) => b.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleRightTool = (id: string) => {
    setRightTool(rightTool === id ? "" : id);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Setup units dialog */}
      <SetupUnitsDialog open={showUnits} onConfirm={() => setShowUnits(false)} />

      {/* Shape draw dialog */}
      <ShapeDrawDialog open={showShapeDialog} onSelect={(s) => { setShowShapeDialog(false); addBlock(); }} onClose={() => setShowShapeDialog(false)} />

      {/* DXF import dialog */}
      {showDXFImport && <DXFImport onImport={handleDXFImport} onClose={() => setShowDXFImport(false)} />}

      {/* Top bar */}
      <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">Nash Studio</h2>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">{blocks.length} objects</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={addBlock} className="gap-1.5 h-8 text-xs">
            <TbPlus size={13} /> Add Block
          </Button>
          <Button size="sm" className="gap-1.5 h-8 text-xs">
            <TbChartBar size={13} /> Analyse Massing
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative">
        <Canvas shadows className="!bg-sky-100">
          <Scene blocks={blocks} selectedId={selectedId} onSelect={setSelectedId} />
        </Canvas>

        {/* Toolbars */}
        <LeftToolbar activeTool={leftTool} onToolChange={handleLeftTool} />
        <RightToolbar activeTool={rightTool} onToolChange={handleRightTool} />

        {/* Floating panels */}
        {rightTool === "energy" && <RadiationPanel onClose={() => setRightTool("")} />}
        {rightTool === "shadow" && <ShadowControlPanel onClose={() => setRightTool("")} />}
        {showLandscape && <LandscapeSelector onSelect={(t) => setShowLandscape(false)} onClose={() => setShowLandscape(false)} />}
        {showTrees && <TreePlacementPanel onClose={() => setShowTrees(false)} />}

        {/* North indicator */}
        <div className="absolute bottom-4 left-16 z-10 flex items-center gap-1 bg-card/80 backdrop-blur rounded-lg px-2 py-1.5 border border-border">
          <TbCompass size={16} className="text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground">N</span>
        </div>

        {/* Properties panel */}
        {rightTool === "properties" && selectedId && (() => {
          const sel = blocks.find((b) => b.id === selectedId);
          if (!sel) return null;
          return (
            <div className="absolute top-0 right-14 z-20 w-56 h-full bg-card border-l border-border p-4 space-y-4 overflow-y-auto">
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Properties</h3>
              <div>
                <p className="text-xs text-muted-foreground">ID</p>
                <p className="text-sm font-mono text-foreground">{sel.id}</p>
              </div>
              {(["Width", "Height", "Depth"] as const).map((label, i) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-mono text-foreground">{sel.dimensions[i]}m</p>
                </div>
              ))}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Floor Area</p>
                <p className="text-sm font-mono text-primary">{(sel.dimensions[0] * sel.dimensions[2]).toFixed(0)} m²</p>
                <p className="text-xs text-muted-foreground mt-2">Volume</p>
                <p className="text-sm font-mono text-primary">{(sel.dimensions[0] * sel.dimensions[1] * sel.dimensions[2]).toFixed(0)} m³</p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
