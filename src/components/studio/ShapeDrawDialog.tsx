import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TbScribble, TbSquare, TbCircle, TbOvalVertical } from "react-icons/tb";

const shapes = [
  { icon: TbScribble, label: "Freeform", desc: "Draw a custom shape freely", id: "freeform" },
  { icon: TbSquare, label: "Rectangle", desc: "Draw a rectangular footprint", id: "rectangle" },
  { icon: TbCircle, label: "Circle", desc: "Draw a circular footprint", id: "circle" },
  { icon: TbOvalVertical, label: "Organic", desc: "Draw an organic curved shape", id: "organic" },
];

interface Props {
  open: boolean;
  onSelect: (shape: string) => void;
  onClose: () => void;
}

export default function ShapeDrawDialog({ open, onSelect, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Shape</DialogTitle>
          <DialogDescription>Select a drawing shape for the building footprint</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          {shapes.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <s.icon size={28} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{s.label}</span>
              <span className="text-[10px] text-muted-foreground text-center">{s.desc}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
