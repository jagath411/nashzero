import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  variant?: "default" | "energy" | "solar" | "water" | "wind" | "heat" | "green";
  className?: string;
}

const variantColors: Record<string, string> = {
  default: "border-border",
  energy: "border-nzbd-energy/30",
  solar: "border-nzbd-solar/30",
  water: "border-nzbd-water/30",
  wind: "border-nzbd-wind/30",
  heat: "border-nzbd-heat/30",
  green: "border-nzbd-green/30",
};

const variantText: Record<string, string> = {
  default: "text-primary",
  energy: "text-nzbd-energy",
  solar: "text-nzbd-solar",
  water: "text-nzbd-water",
  wind: "text-nzbd-wind",
  heat: "text-nzbd-heat",
  green: "text-nzbd-green",
};

export default function MetricCard({ label, value, unit, icon, trend, variant = "default", className }: MetricCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 animate-slide-in", variantColors[variant], className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
        {icon && <span className={cn("text-lg", variantText[variant])}>{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("text-2xl font-bold tracking-tight", variantText[variant])}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground font-mono">{unit}</span>}
      </div>
      {trend && (
        <p className={cn("text-xs mt-1.5 font-mono", trend.value >= 0 ? "text-nzbd-green" : "text-nzbd-heat")}>
          {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}
