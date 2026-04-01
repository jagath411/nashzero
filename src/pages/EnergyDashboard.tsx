import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import { TbBolt, TbTemperature, TbSnowflake, TbSun } from "react-icons/tb";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const hourlyLoad = Array.from({ length: 24 }, (_, h) => {
  const cooling = h >= 8 && h <= 18 ? 120 + Math.sin((h - 8) * 0.3) * 60 + Math.random() * 20 : 30 + Math.random() * 10;
  const heating = h >= 0 && h <= 6 ? 40 + Math.random() * 15 : 5 + Math.random() * 5;
  const lighting = h >= 7 && h <= 20 ? 25 + Math.random() * 10 : 8;
  const equipment = h >= 8 && h <= 18 ? 45 + Math.random() * 10 : 15;
  return { hour: `${h}:00`, cooling: +cooling.toFixed(0), heating: +heating.toFixed(0), lighting: +lighting.toFixed(0), equipment: +equipment.toFixed(0) };
});

const monthlyEUI = [
  { month: "Jan", baseline: 95, optimized: 72 },
  { month: "Feb", baseline: 88, optimized: 66 },
  { month: "Mar", baseline: 102, optimized: 74 },
  { month: "Apr", baseline: 118, optimized: 82 },
  { month: "May", baseline: 145, optimized: 98 },
  { month: "Jun", baseline: 168, optimized: 108 },
  { month: "Jul", baseline: 178, optimized: 112 },
  { month: "Aug", baseline: 172, optimized: 110 },
  { month: "Sep", baseline: 152, optimized: 100 },
  { month: "Oct", baseline: 125, optimized: 88 },
  { month: "Nov", baseline: 98, optimized: 70 },
  { month: "Dec", baseline: 92, optimized: 68 },
];

const endUse = [
  { name: "Cooling", value: 42, color: "hsl(199 89% 48%)" },
  { name: "Lighting", value: 18, color: "hsl(45 93% 58%)" },
  { name: "Equipment", value: 22, color: "hsl(162 72% 45%)" },
  { name: "Heating", value: 8, color: "hsl(0 85% 60%)" },
  { name: "DHW", value: 6, color: "hsl(172 66% 50%)" },
  { name: "Fans/Pumps", value: 4, color: "hsl(280 60% 55%)" },
];

export default function EnergyDashboard() {
  return (
    <div>
      <PageHeader title="Energy Dashboard" subtitle="Net zero energy performance metrics and HVAC analysis" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Annual EUI" value={82} unit="kWh/m²" icon={<TbBolt />} variant="energy" trend={{ value: -28, label: "vs ASHRAE" }} />
          <MetricCard label="Peak Cooling" value={185} unit="kW" icon={<TbSnowflake />} variant="water" />
          <MetricCard label="Peak Heating" value={42} unit="kW" icon={<TbTemperature />} variant="heat" />
          <MetricCard label="PV Offset" value={64} unit="%" icon={<TbSun />} variant="solar" trend={{ value: 12, label: "improved" }} />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Hourly Load */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Hourly Load Profile</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Typical design day breakdown (kW)</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={hourlyLoad}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} axisLine={false} interval={2} />
                <YAxis tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="cooling" stackId="1" stroke="hsl(199 89% 48%)" fill="hsl(199 89% 48% / 0.3)" name="Cooling" />
                <Area type="monotone" dataKey="equipment" stackId="1" stroke="hsl(162 72% 45%)" fill="hsl(162 72% 45% / 0.3)" name="Equipment" />
                <Area type="monotone" dataKey="lighting" stackId="1" stroke="hsl(45 93% 58%)" fill="hsl(45 93% 58% / 0.3)" name="Lighting" />
                <Area type="monotone" dataKey="heating" stackId="1" stroke="hsl(0 85% 60%)" fill="hsl(0 85% 60% / 0.3)" name="Heating" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* End Use Pie */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">End-Use Split</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Annual energy by category</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={endUse} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                  {endUse.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly EUI Comparison */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Monthly EUI Comparison</h3>
          <p className="text-xs text-muted-foreground mb-4 font-mono">Baseline vs optimized design (kWh/m²)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyEUI}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="baseline" fill="hsl(0 85% 60% / 0.4)" radius={[4, 4, 0, 0]} name="Baseline" />
              <Bar dataKey="optimized" fill="hsl(162 72% 45%)" radius={[4, 4, 0, 0]} name="Optimized" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
