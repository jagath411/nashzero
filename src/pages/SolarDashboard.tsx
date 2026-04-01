import { useMemo } from "react";
import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import { TbSun, TbSunOff } from "react-icons/tb";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis
} from "recharts";
import SunCalc from "suncalc";

const LAT = 25.276987;
const LNG = 55.296249;

function generateSunPath(month: number) {
  const date = new Date(2024, month, 21);
  const points = [];
  for (let h = 5; h <= 19; h += 0.5) {
    const d = new Date(date);
    d.setHours(Math.floor(h), (h % 1) * 60);
    const pos = SunCalc.getPosition(d, LAT, LNG);
    const altitude = (pos.altitude * 180) / Math.PI;
    const azimuth = ((pos.azimuth * 180) / Math.PI + 180) % 360;
    if (altitude > 0) {
      points.push({ time: `${Math.floor(h)}:${(h % 1) * 60 || "00"}`, altitude: +altitude.toFixed(1), azimuth: +azimuth.toFixed(1) });
    }
  }
  return points;
}

const monthlyRadiation = [
  { month: "Jan", direct: 4.2, diffuse: 1.8, total: 6.0 },
  { month: "Feb", direct: 4.8, diffuse: 1.9, total: 6.7 },
  { month: "Mar", direct: 5.6, diffuse: 2.1, total: 7.7 },
  { month: "Apr", direct: 6.2, diffuse: 2.3, total: 8.5 },
  { month: "May", direct: 7.1, diffuse: 2.5, total: 9.6 },
  { month: "Jun", direct: 7.8, diffuse: 2.4, total: 10.2 },
  { month: "Jul", direct: 7.5, diffuse: 2.6, total: 10.1 },
  { month: "Aug", direct: 7.0, diffuse: 2.5, total: 9.5 },
  { month: "Sep", direct: 6.4, diffuse: 2.2, total: 8.6 },
  { month: "Oct", direct: 5.5, diffuse: 2.0, total: 7.5 },
  { month: "Nov", direct: 4.6, diffuse: 1.8, total: 6.4 },
  { month: "Dec", direct: 4.0, diffuse: 1.7, total: 5.7 },
];

const facadeExposure = [
  { face: "North", hours: 2.1 },
  { face: "NE", hours: 3.8 },
  { face: "East", hours: 5.6 },
  { face: "SE", hours: 6.2 },
  { face: "South", hours: 7.1 },
  { face: "SW", hours: 6.8 },
  { face: "West", hours: 5.2 },
  { face: "NW", hours: 3.2 },
];

export default function SolarDashboard() {
  const summerPath = useMemo(() => generateSunPath(5), []);
  const winterPath = useMemo(() => generateSunPath(11), []);
  const equinoxPath = useMemo(() => generateSunPath(2), []);

  return (
    <div>
      <PageHeader title="Solar & Shadow Analysis" subtitle={`Site: ${LAT.toFixed(2)}°N, ${LNG.toFixed(2)}°E · Dubai, UAE`} />
      <div className="p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Peak Sun Hours" value={6.8} unit="hrs/day" icon={<TbSun />} variant="solar" />
          <MetricCard label="Annual GHI" value={2150} unit="kWh/m²" icon={<TbSun />} variant="solar" />
          <MetricCard label="Shadow Hours" value={3.2} unit="hrs (avg)" icon={<TbSunOff />} variant="default" />
          <MetricCard label="Facade Exposure" value={82} unit="%" icon={<TbSun />} variant="energy" trend={{ value: 5, label: "optimized" }} />
        </div>

        {/* Sun Path Chart */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Sun Path Diagram</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Altitude vs Azimuth — Solstices & Equinox</p>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="azimuth" type="number" domain={[60, 300]} name="Azimuth" unit="°" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} />
                <YAxis dataKey="altitude" type="number" domain={[0, 90]} name="Altitude" unit="°" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} />
                <ZAxis range={[20, 20]} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 11 }} />
                <Scatter name="Summer Solstice" data={summerPath} fill="hsl(45 93% 58%)" line={{ strokeWidth: 2 }} />
                <Scatter name="Equinox" data={equinoxPath} fill="hsl(36 100% 55%)" line={{ strokeWidth: 2 }} />
                <Scatter name="Winter Solstice" data={winterPath} fill="hsl(199 89% 48%)" line={{ strokeWidth: 2 }} />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 justify-center">
              {[{ label: "Summer", color: "bg-nzbd-energy" }, { label: "Equinox", color: "bg-nzbd-solar" }, { label: "Winter", color: "bg-nzbd-water" }].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Facade Radar */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Facade Sun Exposure</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Average daily sun hours by orientation</p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={facadeExposure}>
                <PolarGrid stroke="hsl(220 14% 18%)" />
                <PolarAngleAxis dataKey="face" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} domain={[0, 8]} />
                <Radar name="Sun Hours" dataKey="hours" stroke="hsl(36 100% 55%)" fill="hsl(36 100% 55% / 0.2)" strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Radiation */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Monthly Solar Radiation</h3>
          <p className="text-xs text-muted-foreground mb-4 font-mono">Direct, diffuse, and total horizontal irradiance (kWh/m²/day)</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyRadiation}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="total" stroke="hsl(45 93% 58%)" strokeWidth={2.5} dot={false} name="Total GHI" />
              <Line type="monotone" dataKey="direct" stroke="hsl(36 100% 55%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Direct" />
              <Line type="monotone" dataKey="diffuse" stroke="hsl(199 89% 48%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Diffuse" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
