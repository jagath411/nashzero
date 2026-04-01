import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  TbCube3dSphere, TbSun, TbBolt, TbMap2, TbDroplet,
  TbWind, TbFlame, TbLeaf, TbHome, TbChartBar,
  TbBuildingSkyscraper, TbLayout, TbBox
} from "react-icons/tb";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const location = useLocation();
  const { id } = useParams();
  const base = `/project/${id}`;

  const navGroups = [
    {
      label: "Project",
      items: [
        { to: `${base}/context`, icon: TbHome, label: "Context" },
        { to: `${base}/massing`, icon: TbBox, label: "Nash Massing" },
        { to: `${base}/studio`, icon: TbCube3dSphere, label: "3D Studio" },
        { to: `${base}/map`, icon: TbMap2, label: "Site Map" },
      ],
    },
    {
      label: "Analysis",
      items: [
        { to: `${base}/dashboard`, icon: TbLayout, label: "Dashboard" },
        { to: `${base}/solar`, icon: TbSun, label: "Solar & Shadow" },
        { to: `${base}/energy`, icon: TbBolt, label: "Energy" },
        { to: `${base}/daylight`, icon: TbChartBar, label: "Daylight" },
        { to: `${base}/wind`, icon: TbWind, label: "Wind & Weather" },
        { to: `${base}/uhi`, icon: TbFlame, label: "Urban Heat Island" },
        { to: `${base}/hydrology`, icon: TbDroplet, label: "Hydrology" },
        { to: `${base}/sustainability`, icon: TbLeaf, label: "Sustainability" },
      ],
    },
  ];

  return (
    <aside className="w-56 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <TbBuildingSkyscraper className="text-primary-foreground" size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">NashZero</h1>
            <p className="text-[10px] text-muted-foreground font-mono">Net Zero Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 px-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon size={16} className={isActive ? "text-primary" : ""} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
