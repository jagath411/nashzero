import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TbTree, TbX } from "react-icons/tb";

const presets = [
  { label: "Small", height: 4, crown: 3 },
  { label: "Medium", height: 8, crown: 5 },
  { label: "Large", height: 14, crown: 8 },
];

interface Props {
  onClose: () => void;
}

export default function TreePlacementPanel({ onClose }: Props) {
  const [height, setHeight] = useState(8);
  const [crown, setCrown] = useState(5);

  return (
    <Card className="absolute bottom-16 left-16 z-20 w-64 p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TbTree className="text-[hsl(var(--nzbd-green))]" size={18} />
          <h3 className="text-sm font-semibold text-foreground">Tree Placement</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <TbX size={14} />
        </Button>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">Tree Height (m)</Label>
          <Input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} className="h-8" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Crown Diameter (m)</Label>
          <Input type="number" value={crown} onChange={(e) => setCrown(+e.target.value)} className="h-8" />
        </div>
      </div>
      <div className="flex gap-2">
        {presets.map((p) => (
          <Button key={p.label} variant="outline" size="sm" className="flex-1 text-xs" onClick={() => { setHeight(p.height); setCrown(p.crown); }}>
            {p.label}
          </Button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground text-center">Click on the canvas to place. Press ESC to exit.</p>
    </Card>
  );
}
