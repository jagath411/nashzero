import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  TbPointer, TbStack2, TbCopy, TbCut, TbArrowsMove,
  TbMountain, TbArrowBack, TbSettings, TbTrash,
  TbPencil, TbBulb
} from "react-icons/tb";

const tools = [
  { icon: TbPointer, label: "Select", id: "select" },
  { icon: TbStack2, label: "Layers", id: "layers" },
  { icon: TbCopy, label: "Copy", id: "copy" },
  { icon: TbCut, label: "Floor Splitter", id: "split" },
  { icon: TbArrowsMove, label: "Move / Rotate", id: "move" },
  { icon: TbMountain, label: "Terrain", id: "terrain" },
  { icon: TbArrowBack, label: "Undo", id: "undo" },
  { icon: TbSettings, label: "Settings", id: "settings" },
  { icon: TbTrash, label: "Delete", id: "delete" },
  { icon: TbPencil, label: "Draw / Edit", id: "draw" },
  { icon: TbBulb, label: "Tips", id: "tips" },
];

interface Props {
  activeTool: string;
  onToolChange: (id: string) => void;
}

export default function LeftToolbar({ activeTool, onToolChange }: Props) {
  return (
    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1 bg-card/90 backdrop-blur rounded-xl p-1.5 border border-border shadow-lg">
      {tools.map((t) => (
        <Tooltip key={t.id}>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={activeTool === t.id ? "default" : "ghost"}
              className="h-9 w-9 p-0"
              onClick={() => onToolChange(t.id)}
            >
              <t.icon size={17} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{t.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
