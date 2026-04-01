import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TbShadow, TbX } from "react-icons/tb";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  onClose: () => void;
}

export default function ShadowControlPanel({ onClose }: Props) {
  const [month, setMonth] = useState([5]);
  const [day, setDay] = useState([15]);
  const [hour, setHour] = useState([12]);

  return (
    <Card className="absolute top-4 right-16 z-20 w-72 p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TbShadow className="text-muted-foreground" size={18} />
          <h3 className="text-sm font-semibold text-foreground">Shadow Control</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <TbX size={14} />
        </Button>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Month: {months[month[0]]}</label>
          <Slider value={month} onValueChange={setMonth} min={0} max={11} step={1} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Day: {day[0]}</label>
          <Slider value={day} onValueChange={setDay} min={1} max={31} step={1} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Time: {hour[0]}:00</label>
          <Slider value={hour} onValueChange={setHour} min={0} max={23} step={1} />
        </div>
      </div>
      <Button className="w-full" size="sm">Apply Shadow Settings</Button>
    </Card>
  );
}
