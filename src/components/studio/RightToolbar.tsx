import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  TbSun, TbSearch, TbEye, TbBolt, TbUsers, TbLayoutSidebar
} from "react-icons/tb";

const tools = [
  { icon: TbSun, label: "Sun / Shadow", id: "shadow" },
  { icon: TbSearch, label: "Inspect", id: "inspect" },
  { icon: TbEye, label: "Visibility", id: "visibility" },
  { icon: TbBolt, label: "Energy Analysis", id: "energy" },
  { icon: TbUsers, label: "Collaborate", id: "collaborate" },
  { icon: TbLayoutSidebar, label: "Properties", id: "properties" },
];

interface Props {
  activeTool: string;
  onToolChange: (id: string) => void;
}

export default function RightToolbar({ activeTool, onToolChange }: Props) {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1 bg-card/90 backdrop-blur rounded-xl p-1.5 border border-border shadow-lg">
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
          <TooltipContent side="left">{t.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
