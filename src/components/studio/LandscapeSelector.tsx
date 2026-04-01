import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TbRoad, TbDroplet, TbPlant, TbX } from "react-icons/tb";

const types = [
  { icon: TbRoad, label: "Roads & Pathways", desc: "Add streets, walkways, and paved surfaces", id: "roads" },
  { icon: TbDroplet, label: "Water Bodies & Ponds", desc: "Place lakes, ponds, and water features", id: "water" },
  { icon: TbPlant, label: "Grass & Green Areas", desc: "Add lawns, parks, and vegetation zones", id: "grass" },
];

interface Props {
  onSelect: (type: string) => void;
  onClose: () => void;
}

export default function LandscapeSelector({ onSelect, onClose }: Props) {
  return (
    <Card className="absolute bottom-16 left-16 z-20 w-72 p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Landscape Type</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <TbX size={14} />
        </Button>
      </div>
      {types.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
        >
          <t.icon className="text-primary shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-foreground">{t.label}</p>
            <p className="text-[10px] text-muted-foreground">{t.desc}</p>
          </div>
        </button>
      ))}
    </Card>
  );
}
