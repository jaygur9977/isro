import { useState } from "react";
import { Globe, Map, Bot, Rocket, BarChart3, AlertTriangle, Cpu, ChevronLeft, ChevronRight, Satellite, Activity, Layout, Network } from "lucide-react";

const navItems = [
  { id: "dashboard",    label: "Mission Dashboard", icon: <Activity size={17} />,      badge: "LIVE",    badgeStyle: "pill-green" },
  { id: "map2d",        label: "2D Lunar Map",       icon: <Map size={17} /> },
  { id: "sim3d",        label: "3D Simulator",        icon: <Globe size={17} /> },
  { id: "ice",          label: "Ice Detection",       icon: <Satellite size={17} />,    badge: "93%",     badgeStyle: "pill-sky" },
  { id: "landing",      label: "Landing Sites",       icon: <Rocket size={17} /> },
  { id: "rover",        label: "Rover Path",          icon: <Bot size={17} /> },
  { id: "risk",         label: "Risk Assessment",     icon: <AlertTriangle size={17} /> },
  { id: "ai",           label: "AI Optimizer",        icon: <Cpu size={17} />,          badge: "AI",      badgeStyle: "pill-violet" },
  { id: "reports",      label: "Reports",             icon: <BarChart3 size={17} /> },
  { id: null,           label: "DESIGN",              icon: null, divider: true },
  { id: "wireframe",    label: "Wireframes",          icon: <Layout size={17} />,       badge: "NEW",     badgeStyle: "pill-amber" },
  { id: "architecture", label: "Architecture",        icon: <Network size={17} />,      badge: "NEW",     badgeStyle: "pill-amber" },
] as const;

interface SidebarProps { active: string; onNav: (id: string) => void; }

export default function Sidebar({ active, onNav }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`relative flex flex-col h-full transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}
      style={{ background: "white", borderRight: "1px solid rgba(0,0,0,.07)", boxShadow: "2px 0 8px rgba(0,0,0,.04)" }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-slate-100">
        {!collapsed ? (
          <div>
            <div className="font-orbitron text-sm font-black tracking-widest"
              style={{ background:"linear-gradient(135deg,#10b981,#0ea5e9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              LIDMP
            </div>
            <div className="text-[9px] text-slate-400 tracking-wider mt-0.5 font-mono">ISRO MISSION CONTROL</div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:"linear-gradient(135deg,#d1fae5,#dbeafe)" }}>
              <Satellite size={14} className="text-emerald-600" />
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          if ("divider" in item && item.divider) {
            if (collapsed) return null;
            return (
              <div key="divider-design" className="px-3 pt-3 pb-1">
                <div className="text-[8px] font-mono font-bold text-slate-400 tracking-widest">— {item.label}</div>
              </div>
            );
          }
          if (!item.id) return null;
          const id = item.id as string;
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              data-testid={`nav-${id}`}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all ${isActive ? "active" : ""}`}
            >
              <span className={`flex-shrink-0 ${isActive ? "text-emerald-600" : "text-slate-400"}`}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span className={`flex-1 text-xs font-medium ${isActive ? "text-emerald-700 font-semibold" : "text-slate-600"}`}>
                    {item.label}
                  </span>
                  {"badge" in item && item.badge && (
                    <span className={`pill text-[8px] ${"badgeStyle" in item ? item.badgeStyle : "pill-slate"}`}>{item.badge}</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100">
          <div className="text-[9px] font-mono text-slate-400 text-center leading-relaxed">
            <div className="font-semibold text-emerald-600">BHARATIYA ANTARIKSH</div>
            <div className="text-slate-400">HACKATHON 2026</div>
            <div className="text-slate-400 mt-1">Problem #8 — Ice Detection</div>
          </div>
        </div>
      )}

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        data-testid="sidebar-toggle"
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-600 shadow-sm transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  );
}
