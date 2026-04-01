import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import { TbBolt, TbSun, TbDroplet, TbWind, TbFlame, TbLeaf } from "react-icons/tb";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const monthlyEnergy = [
  { month: "Jan", consumption: 420, generation: 180 },
  { month: "Feb", consumption: 380, generation: 220 },
  { month: "Mar", consumption: 350, generation: 310 },
  { month: "Apr", consumption: 300, generation: 380 },
  { month: "May", consumption: 280, generation: 450 },
  { month: "Jun", consumption: 260, generation: 520 },
  { month: "Jul", consumption: 290, generation: 540 },
  { month: "Aug", consumption: 310, generation: 490 },
  { month: "Sep", consumption: 330, generation: 400 },
  { month: "Oct", consumption: 360, generation: 290 },
  { month: "Nov", consumption: 400, generation: 200 },
  { month: "Dec", consumption: 430, generation: 170 },
];

const zoneBreakdown = [
  { zone: "HVAC", value: 42 },
  { zone: "Lighting", value: 18 },
  { zone: "Equipment", value: 24 },
  { zone: "DHW", value: 10 },
  { zone: "Other", value: 6 },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Net Zero Dashboard" subtitle="Building performance overview — Demo Project" />
      <div className="p-6 space-y-6">
        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard label="EUI" value={82} unit="kWh/m²" icon={<TbBolt />} variant="energy" trend={{ value: -12, label: "vs baseline" }} />
          <MetricCard label="Solar Gen" value={4.2} unit="MWh/yr" icon={<TbSun />} variant="solar" trend={{ value: 18, label: "capacity" }} />
          <MetricCard label="Water Saved" value={34} unit="kL/yr" icon={<TbDroplet />} variant="water" />
          <MetricCard label="Wind Load" value={1.2} unit="kPa" icon={<TbWind />} variant="wind" />
          <MetricCard label="UHI Δ" value={2.4} unit="°C" icon={<TbFlame />} variant="heat" />
          <MetricCard label="LEED Pts" value={78} unit="/110" icon={<TbLeaf />} variant="green" trend={{ value: 8, label: "gained" }} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Energy Balance</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Monthly consumption vs. on-site generation</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyEnergy}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} unit=" kWh" />
                <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="consumption" stroke="hsl(0 85% 60%)" fill="hsl(0 85% 60% / 0.15)" strokeWidth={2} name="Consumption" />
                <Area type="monotone" dataKey="generation" stroke="hsl(162 72% 45%)" fill="hsl(162 72% 45% / 0.15)" strokeWidth={2} name="Generation" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Load Breakdown</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">End-use energy distribution (%)</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={zoneBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} unit="%" />
                <YAxis type="category" dataKey="zone" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} width={70} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(199 89% 48%)" radius={[0, 4, 4, 0]} name="Share" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Daylight Factor", value: "3.2%", status: "Pass", color: "text-nzbd-green" },
            { label: "Shadow Impact", value: "< 4hrs", status: "Compliant", color: "text-nzbd-green" },
            { label: "Rainwater Reuse", value: "68%", status: "Target Met", color: "text-nzbd-water" },
            { label: "Net Zero Target", value: "92%", status: "On Track", color: "text-nzbd-energy" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-mono">{s.label}</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{s.value}</p>
              </div>
              <span className={`text-xs font-mono font-semibold ${s.color}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
