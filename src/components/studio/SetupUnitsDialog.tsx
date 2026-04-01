import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const units = [
  { value: "meters", label: "Meters (m)" },
  { value: "feet", label: "Feet (ft)" },
  { value: "centimeters", label: "Centimeters (cm)" },
  { value: "millimeters", label: "Millimeters (mm)" },
];

interface Props {
  open: boolean;
  onConfirm: (unit: string) => void;
}

export default function SetupUnitsDialog({ open, onConfirm }: Props) {
  const [selected, setSelected] = useState("meters");

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Setup Drawing Units</DialogTitle>
          <DialogDescription>Choose the measurement unit for your project. This affects all dimensions.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {units.map((u) => (
            <label key={u.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected === u.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`}>
              <input
                type="radio"
                name="unit"
                value={u.value}
                checked={selected === u.value}
                onChange={() => setSelected(u.value)}
                className="accent-[hsl(var(--primary))]"
              />
              <span className="text-sm text-foreground">{u.label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          ⚠️ Once confirmed, changing units mid-project may affect existing geometry dimensions.
        </p>
        <Button className="w-full" onClick={() => onConfirm(selected)}>Confirm Units</Button>
      </DialogContent>
    </Dialog>
  );
}
