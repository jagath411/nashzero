import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TbTemperature, TbDroplet, TbWind, TbSun, TbCloud,
  TbArrowRight, TbMapPin, TbChartBar
} from "react-icons/tb";

// Mock inference data
const weatherData = {
  temperature: { min: 18, max: 36, avg: 28, label: "Temperature", unit: "°C", color: "hsl(var(--nzbd-heat))" },
  humidity: { min: 40, max: 85, avg: 65, label: "Humidity", unit: "%", color: "hsl(var(--nzbd-water))" },
  precipitation: { min: 0, max: 220, avg: 80, label: "Precipitation", unit: "mm", color: "hsl(var(--nzbd-water))" },
};

const comfortHours = { comfortable: 62, hot: 22, cold: 16 };

function ThermometerBar({ min, max, avg, label, unit, color }: typeof weatherData.temperature) {
  const range = max - min;
  const avgPos = ((avg - min) / range) * 100;
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <div className="relative h-32 w-6 mx-auto rounded-full bg-muted overflow-hidden">
        <div className="absolute bottom-0 w-full rounded-full" style={{ height: `${avgPos}%`, background: color }} />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-foreground">{avg}{unit}</p>
        <p className="text-[10px] text-muted-foreground">{min}–{max}{unit}</p>
      </div>
    </div>
  );
}

export default function ProjectContextPage() {
  const { id } = useParams();
  const { project } = useProject();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <TbMapPin size={14} />
            <span>{project?.location || "Site Location"}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{project?.name || "Project"}</h1>
          <p className="text-sm text-muted-foreground mt-1">Site analysis & environmental context</p>
        </div>
        <Button onClick={() => navigate(`/project/${id}/massing`)} className="gap-2">
          Nash Massing <TbArrowRight size={16} />
        </Button>
      </div>

      {/* Comfort range bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Nash Comfort Hours</h3>
          <span className="text-xs text-muted-foreground">Annual comfort distribution</span>
        </div>
        <div className="flex h-8 rounded-lg overflow-hidden">
          <div className="flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${comfortHours.cold}%`, background: "hsl(var(--nzbd-water))" }}>
            Cold {comfortHours.cold}%
          </div>
          <div className="flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${comfortHours.comfortable}%`, background: "hsl(var(--nzbd-green))" }}>
            Comfortable {comfortHours.comfortable}%
          </div>
          <div className="flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${comfortHours.hot}%`, background: "hsl(var(--nzbd-heat))" }}>
            Hot {comfortHours.hot}%
          </div>
        </div>
      </Card>

      {/* Data grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weather Card */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TbTemperature className="text-[hsl(var(--nzbd-heat))]" size={18} />
            <h3 className="text-sm font-semibold text-foreground">Weather Overview</h3>
          </div>
          <div className="flex justify-around">
            {Object.values(weatherData).map((d) => (
              <ThermometerBar key={d.label} {...d} />
            ))}
          </div>
        </Card>

        {/* Wind Card */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TbWind className="text-[hsl(var(--nzbd-wind))]" size={18} />
            <h3 className="text-sm font-semibold text-foreground">Wind Flow</h3>
          </div>
          <div className="flex items-center justify-center h-40">
            <div className="relative w-32 h-32">
              {/* Compass */}
              <div className="absolute inset-0 rounded-full border-2 border-border" />
              {["N", "E", "S", "W"].map((dir, i) => (
                <span key={dir} className="absolute text-[10px] font-mono text-muted-foreground" style={{
                  top: i === 0 ? "-14px" : i === 2 ? "auto" : "50%",
                  bottom: i === 2 ? "-14px" : "auto",
                  left: i === 3 ? "-10px" : i === 1 ? "auto" : "50%",
                  right: i === 1 ? "-10px" : "auto",
                  transform: (i === 0 || i === 2) ? "translateX(-50%)" : "translateY(-50%)",
                }}>{dir}</span>
              ))}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
              {/* Wind arrow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 origin-bottom h-12 w-0.5 bg-primary -translate-y-full rotate-[225deg]" />
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">Prevailing: SW at 12 km/h</p>
        </Card>

        {/* Shadow Card */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TbSun className="text-[hsl(var(--nzbd-solar))]" size={18} />
            <h3 className="text-sm font-semibold text-foreground">Shadow Analysis</h3>
          </div>
          <div className="h-40 flex items-center justify-center">
            <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TbSun size={32} className="mx-auto text-[hsl(var(--nzbd-solar))] mb-2" />
                <p className="text-xs text-muted-foreground">6.2 hrs avg sunlight</p>
                <p className="text-xs text-muted-foreground">Peak: 12:30 PM</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs">More Info</Button>
        </Card>
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Site Area", value: project?.site?.area ? `${(project.site.area).toFixed(0)} m²` : "—", icon: TbMapPin },
          { label: "Solar Potential", value: "4.8 kWh/m²/day", icon: TbSun },
          { label: "Rainfall", value: "980 mm/yr", icon: TbDroplet },
          { label: "Cloud Cover", value: "45% avg", icon: TbCloud },
        ].map((m) => (
          <Card key={m.label} className="p-4 flex items-center gap-3">
            <m.icon className="text-primary shrink-0" size={20} />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{m.label}</p>
              <p className="text-sm font-semibold text-foreground">{m.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
