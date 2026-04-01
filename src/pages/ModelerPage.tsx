import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Environment, PerspectiveCamera } from "@react-three/drei";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { TbPlus, TbTrash, TbArrowsMove, TbDimensions } from "react-icons/tb";
import * as THREE from "three";

interface BuildingBlock {
  id: string;
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
}

function Building({ block, selected, onClick }: { block: BuildingBlock; selected: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  return (
    <mesh
      ref={meshRef}
      position={[block.position[0], block.position[1] + block.dimensions[1] / 2, block.position[2]]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <boxGeometry args={block.dimensions} />
      <meshStandardMaterial
        color={selected ? "#22d3ee" : block.color}
        transparent
        opacity={selected ? 0.85 : 0.7}
        roughness={0.3}
        metalness={0.1}
      />
      {selected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...block.dimensions)]} />
          <lineBasicMaterial color="#22d3ee" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#1a1f2e" transparent opacity={0.5} />
    </mesh>
  );
}

function Scene({ blocks, selectedId, onSelect }: { blocks: BuildingBlock[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={50} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 10, -5]} intensity={0.3} />
      <Environment preset="city" />
      
      <Grid
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#334155"
        fadeDistance={50}
        position={[0, 0, 0]}
      />
      
      <GroundPlane />
      
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
  { id: "tower-1", position: [0, 0, 0], dimensions: [8, 24, 8], color: "#34d399" },
  { id: "podium", position: [0, 0, 10], dimensions: [16, 6, 10], color: "#60a5fa" },
  { id: "tower-2", position: [12, 0, 0], dimensions: [6, 18, 6], color: "#a78bfa" },
];

export default function ModelerPage() {
  const [blocks, setBlocks] = useState<BuildingBlock[]>(defaultBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = blocks.find((b) => b.id === selectedId);

  const addBlock = useCallback(() => {
    const id = `block-${Date.now()}`;
    setBlocks((prev) => [
      ...prev,
      { id, position: [Math.random() * 10 - 5, 0, Math.random() * 10 - 5], dimensions: [6, 10, 6], color: "#fbbf24" },
    ]);
    setSelectedId(id);
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setBlocks((prev) => prev.filter((b) => b.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const updateDimension = (axis: 0 | 1 | 2, delta: number) => {
    if (!selectedId) return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== selectedId) return b;
        const dims = [...b.dimensions] as [number, number, number];
        dims[axis] = Math.max(1, dims[axis] + delta);
        return { ...b, dimensions: dims };
      })
    );
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="3D Building Modeler"
        subtitle="Interactive massing and geometry workspace"
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={addBlock} className="gap-1.5">
              <TbPlus size={14} /> Add Block
            </Button>
            <Button size="sm" variant="destructive" onClick={deleteSelected} disabled={!selectedId} className="gap-1.5">
              <TbTrash size={14} /> Delete
            </Button>
          </div>
        }
      />
      <div className="flex-1 flex">
        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas shadows className="!bg-background">
            <Scene blocks={blocks} selectedId={selectedId} onSelect={setSelectedId} />
          </Canvas>
          {/* Overlay info */}
          <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2">
            <p className="text-[10px] font-mono text-muted-foreground">
              {blocks.length} objects · Click to select · Scroll to zoom
            </p>
          </div>
        </div>

        {/* Properties panel */}
        <div className="w-64 border-l border-border bg-card p-4 space-y-4 overflow-y-auto">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Properties</h3>
          {selected ? (
            <div className="space-y-4 animate-slide-in">
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID</p>
                <p className="text-sm font-mono text-foreground">{selected.id}</p>
              </div>
              {(["Width", "Height", "Depth"] as const).map((label, i) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => updateDimension(i as 0 | 1 | 2, -1)}>−</Button>
                    <span className="text-sm font-mono text-foreground flex-1 text-center">{selected.dimensions[i]}m</span>
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => updateDimension(i as 0 | 1 | 2, 1)}>+</Button>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border space-y-1">
                <p className="text-xs text-muted-foreground">Floor Area</p>
                <p className="text-sm font-mono text-primary">{(selected.dimensions[0] * selected.dimensions[2]).toFixed(0)} m²</p>
                <p className="text-xs text-muted-foreground mt-2">Volume</p>
                <p className="text-sm font-mono text-primary">{(selected.dimensions[0] * selected.dimensions[1] * selected.dimensions[2]).toFixed(0)} m³</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <TbArrowsMove className="mx-auto text-muted-foreground mb-2" size={24} />
              <p className="text-xs text-muted-foreground">Select a block to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
