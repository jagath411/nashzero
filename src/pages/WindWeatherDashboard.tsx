import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import { TbWind, TbTemperature, TbSun, TbCloudRain } from "react-icons/tb";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from "recharts";

// Wind rose data - direction and speed frequency
const windRoseData = [
  { direction: "N", speed0_2: 5, speed2_5: 8, speed5_10: 12, speed10_15: 3, speed15: 1 },
  { direction: "NNE", speed0_2: 4, speed2_5: 10, speed5_10: 15, speed10_15: 5, speed15: 2 },
  { direction: "NE", speed0_2: 3, speed2_5: 12, speed5_10: 18, speed10_15: 7, speed15: 3 },
  { direction: "ENE", speed0_2: 2, speed2_5: 15, speed5_10: 20, speed10_15: 10, speed15: 4 },
  { direction: "E", speed0_2: 1, speed2_5: 18, speed5_10: 25, speed10_15: 12, speed15: 5 },
  { direction: "ESE", speed0_2: 2, speed2_5: 16, speed5_10: 22, speed10_15: 11, speed15: 4 },
  { direction: "SE", speed0_2: 3, speed2_5: 14, speed5_10: 19, speed10_15: 9, speed15: 3 },
  { direction: "SSE", speed0_2: 4, speed2_5: 11, speed5_10: 16, speed10_15: 6, speed15: 2 },
  { direction: "S", speed0_2: 6, speed2_5: 9, speed2_5_10: 13, speed10_15: 4, speed15: 1 },
  { direction: "SSW", speed0_2: 7, speed2_5: 8, speed5_10: 11, speed10_15: 3, speed15: 1 },
  { direction: "SW", speed0_2: 8, speed2_5: 7, speed5_10: 9, speed10_15: 2, speed15: 0 },
  { direction: "WSW", speed0_2: 9, speed2_5: 6, speed5_10: 7, speed10_15: 1, speed15: 0 },
  { direction: "W", speed0_2: 10, speed2_5: 5, speed5_10: 6, speed10_15: 1, speed15: 0 },
  { direction: "WNW", speed0_2: 11, speed2_5: 4, speed5_10: 5, speed10_15: 0, speed15: 0 },
  { direction: "NW", speed0_2: 12, speed2_5: 3, speed5_10: 4, speed10_15: 0, speed15: 0 },
  { direction: "NNW", speed0_2: 13, speed2_5: 2, speed5_10: 3, speed10_15: 0, speed15: 0 },
];

// Temperature profile data
const temperatureProfile = Array.from({ length: 24 }, (_, h) => {
  const baseTemp = 25 + 5 * Math.sin((h - 6) * Math.PI / 12);
  const variation = (Math.random() - 0.5) * 2;
  return {
    hour: `${h}:00`,
    temperature: +(baseTemp + variation).toFixed(1),
    humidity: 60 + Math.sin(h * Math.PI / 12) * 20 + (Math.random() - 0.5) * 5,
    windSpeed: 2 + Math.sin(h * Math.PI / 8) * 3 + Math.random() * 2
  };
});

// Monthly weather patterns
const monthlyWeather = [
  { month: "Jan", avgTemp: 18.5, avgHumidity: 65, avgWindSpeed: 3.2, rainfall: 25 },
  { month: "Feb", avgTemp: 19.8, avgHumidity: 63, avgWindSpeed: 3.5, rainfall: 18 },
  { month: "Mar", avgTemp: 22.1, avgHumidity: 60, avgWindSpeed: 3.8, rainfall: 15 },
  { month: "Apr", avgTemp: 25.3, avgHumidity: 58, avgWindSpeed: 4.1, rainfall: 8 },
  { month: "May", avgTemp: 28.7, avgHumidity: 55, avgWindSpeed: 4.3, rainfall: 3 },
  { month: "Jun", avgTemp: 31.2, avgHumidity: 52, avgWindSpeed: 4.5, rainfall: 1 },
  { month: "Jul", avgTemp: 32.8, avgHumidity: 50, avgWindSpeed: 4.2, rainfall: 0 },
  { month: "Aug", avgTemp: 32.5, avgHumidity: 51, avgWindSpeed: 4.0, rainfall: 1 },
  { month: "Sep", avgTemp: 30.9, avgHumidity: 53, avgWindSpeed: 3.8, rainfall: 2 },
  { month: "Oct", avgTemp: 27.6, avgHumidity: 57, avgWindSpeed: 3.6, rainfall: 8 },
  { month: "Nov", avgTemp: 23.4, avgHumidity: 61, avgWindSpeed: 3.3, rainfall: 15 },
  { month: "Dec", avgTemp: 19.7, avgHumidity: 64, avgWindSpeed: 3.1, rainfall: 22 },
];

// Sun path data for weather analysis
const sunPathData = Array.from({ length: 12 }, (_, month) => {
  const date = new Date(2024, month, 15);
  const sunTimes = [
    { time: "6:00", elevation: month < 3 || month > 8 ? 15 : month < 6 ? 25 : 35 },
    { time: "9:00", elevation: month < 3 || month > 8 ? 35 : month < 6 ? 55 : 65 },
    { time: "12:00", elevation: month < 3 || month > 8 ? 45 : month < 6 ? 75 : 85 },
    { time: "15:00", elevation: month < 3 || month > 8 ? 35 : month < 6 ? 55 : 65 },
    { time: "18:00", elevation: month < 3 || month > 8 ? 15 : month < 6 ? 25 : 35 },
  ];
  return {
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month],
    ...Object.fromEntries(sunTimes.map((t, i) => [`time${i}`, t.elevation]))
  };
});

export default function WindWeatherDashboard() {
  return (
    <div>
      <PageHeader title="Wind & Weather Analysis" subtitle="Meteorological data and environmental conditions for building performance" />
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Avg Wind Speed" value={3.8} unit="m/s" icon={<TbWind />} variant="default" />
          <MetricCard label="Avg Temperature" value={25.6} unit="°C" icon={<TbTemperature />} variant="heat" />
          <MetricCard label="Peak Sun Hours" value={8.2} unit="hrs/day" icon={<TbSun />} variant="solar" />
          <MetricCard label="Annual Rainfall" value={118} unit="mm" icon={<TbCloudRain />} variant="water" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Wind Rose Chart */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Wind Rose</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Wind speed frequency by direction (m/s)</p>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={windRoseData}>
                <PolarGrid stroke="hsl(220 14% 18%)" />
                <PolarAngleAxis dataKey="direction" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fill: "hsl(215 12% 52%)", fontSize: 9 }} domain={[0, 25]} />
                <Radar name="0-2 m/s" dataKey="speed0_2" stroke="hsl(199 89% 48%)" fill="hsl(199 89% 48% / 0.1)" strokeWidth={1} />
                <Radar name="2-5 m/s" dataKey="speed2_5" stroke="hsl(45 93% 58%)" fill="hsl(45 93% 58% / 0.1)" strokeWidth={1} />
                <Radar name="5-10 m/s" dataKey="speed5_10" stroke="hsl(36 100% 55%)" fill="hsl(36 100% 55% / 0.1)" strokeWidth={1} />
                <Radar name="10-15 m/s" dataKey="speed10_15" stroke="hsl(0 85% 60%)" fill="hsl(0 85% 60% / 0.1)" strokeWidth={1} />
                <Radar name="15+ m/s" dataKey="speed15" stroke="hsl(280 60% 55%)" fill="hsl(280 60% 55% / 0.1)" strokeWidth={1} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {[
                { label: "0-2 m/s", color: "bg-nzbd-water" },
                { label: "2-5 m/s", color: "bg-nzbd-solar" },
                { label: "5-10 m/s", color: "bg-nzbd-energy" },
                { label: "10-15 m/s", color: "bg-red-500" },
                { label: "15+ m/s", color: "bg-purple-500" }
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Temperature Profile */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Daily Temperature Profile</h3>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Temperature, humidity, and wind speed variation</p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={temperatureProfile}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} interval={2} />
                <YAxis yAxisId="temp" orientation="left" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} domain={[15, 35]} />
                <YAxis yAxisId="humidity" orientation="right" tick={{ fill: "hsl(215 12% 52%)", fontSize: 10 }} domain={[40, 80]} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 11 }} />
                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="hsl(0 85% 60%)" strokeWidth={2} dot={false} name="Temperature (°C)" />
                <Line yAxisId="humidity" type="monotone" dataKey="humidity" stroke="hsl(199 89% 48%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Humidity (%)" />
                <Line yAxisId="temp" type="monotone" dataKey="windSpeed" stroke="hsl(45 93% 58%)" strokeWidth={1.5} strokeDasharray="2 2" dot={false} name="Wind Speed (m/s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Weather Patterns */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Monthly Weather Patterns</h3>
          <p className="text-xs text-muted-foreground mb-4 font-mono">Average conditions and precipitation throughout the year</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyWeather}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} />
              <YAxis yAxisId="temp" orientation="left" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} domain={[15, 35]} />
              <YAxis yAxisId="rain" orientation="right" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} domain={[0, 30]} />
              <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
              <Area yAxisId="temp" type="monotone" dataKey="avgTemp" stackId="1" stroke="hsl(0 85% 60%)" fill="hsl(0 85% 60% / 0.3)" name="Avg Temperature (°C)" />
              <Area yAxisId="rain" type="monotone" dataKey="rainfall" stackId="2" stroke="hsl(199 89% 48%)" fill="hsl(199 89% 48% / 0.2)" name="Rainfall (mm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sun Path Analysis */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Sun Path Analysis</h3>
          <p className="text-xs text-muted-foreground mb-4 font-mono">Solar elevation angles throughout the year</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={sunPathData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215 12% 52%)", fontSize: 11 }} domain={[0, 90]} />
              <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="time0" stroke="hsl(45 93% 58%)" strokeWidth={1.5} dot={false} name="6:00 AM" />
              <Line type="monotone" dataKey="time1" stroke="hsl(36 100% 55%)" strokeWidth={1.5} dot={false} name="9:00 AM" />
              <Line type="monotone" dataKey="time2" stroke="hsl(25 95% 53%)" strokeWidth={2} dot={false} name="12:00 PM" />
              <Line type="monotone" dataKey="time3" stroke="hsl(36 100% 55%)" strokeWidth={1.5} dot={false} name="3:00 PM" />
              <Line type="monotone" dataKey="time4" stroke="hsl(45 93% 58%)" strokeWidth={1.5} dot={false} name="6:00 PM" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}