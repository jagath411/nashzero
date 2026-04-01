import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TbSun, TbX } from "react-icons/tb";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  onClose: () => void;
}

export default function RadiationPanel({ onClose }: Props) {
  const [month, setMonth] = useState([5]);

  return (
    <Card className="absolute top-4 right-16 z-20 w-72 p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TbSun className="text-[hsl(var(--nzbd-solar))]" size={18} />
          <h3 className="text-sm font-semibold text-foreground">Radiation Analysis</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <TbX size={14} />
        </Button>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Month: {months[month[0]]}</label>
        <Slider value={month} onValueChange={setMonth} min={0} max={11} step={1} />
      </div>
      <Button className="w-full gap-2" size="sm">
        <TbSun size={14} /> Run Radiation Analysis
      </Button>
    </Card>
  );
}
