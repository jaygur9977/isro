import { useState } from "react";
import { Bot, Navigation, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { roverWaypoints } from "../../data/sensorData";

export default function RoverPathAgent() {
  const [expanded, setExpanded] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  const typeColors: Record<string, string> = {
    start: "#10b981",
    waypoint: "#0ea5e9",
    science: "#f59e0b",
    end: "#ef4444",
  };

  const runOptimize = () => {
    setOptimizing(true);
    setTimeout(() => { setOptimizing(false); setOptimized(true); }, 2000);
  };

  const totalDist = roverWaypoints[roverWaypoints.length - 1].distanceKm;
  const totalSolar = roverWaypoints[roverWaypoints.length - 1].solarHours;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }} data-testid="agent-rover-path">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        style={{ borderBottom: expanded ? "1px solid rgba(0,0,0,.05)" : "none" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:"#f0fdf4", border:"1px solid #a7f3d0" }}>
            <Bot size={15} className="text-emerald-500" />
          </div>
          <div>
            <div className="font-orbitron text-[10px] font-bold text-slate-800">ROVER PATH AGENT</div>
            <div className="text-[8px] font-mono text-slate-500">Traverse Planning + Solar Constraints</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`pill text-[7px] ${optimized ? "pill-green" : "pill-sky"}`}>{optimized ? "OPTIMIZED" : "PLANNED"}</span>
          {expanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 pt-3">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "TOTAL DIST.", value: `${totalDist} km`, color: "#10b981", bg: "#f0fdf4" },
              { label: "SOLAR HOURS", value: `${totalSolar}h`,  color: "#f59e0b", bg: "#fffbeb" },
              { label: "WAYPOINTS",   value: `${roverWaypoints.length}`, color: "#0ea5e9", bg: "#f0f9ff" },
            ].map((m) => (
              <div key={m.label} className="p-2 rounded-lg text-center" style={{ background: m.bg, border:`1px solid ${m.color}20` }}>
                <div className="text-[7px] font-mono font-bold mb-0.5" style={{ color: m.color }}>{m.label}</div>
                <div className="font-orbitron text-sm font-black" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Waypoint list */}
          <div className="space-y-1">
            <div className="text-[8px] font-mono text-slate-500 tracking-widest font-bold">TRAVERSE WAYPOINTS</div>
            {roverWaypoints.map((wp) => (
              <div key={wp.id} className="flex items-center gap-2 text-[8px] font-mono" data-testid={`waypoint-${wp.id}`}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColors[wp.type] }} />
                <div className="flex-1 text-slate-600 truncate">{wp.label}</div>
                <div className="text-slate-500">{wp.distanceKm}km</div>
                <div className="text-amber-600 font-medium">{wp.solarHours}h</div>
                <span className="pill text-[7px]" style={{ background:`${typeColors[wp.type]}10`, color:typeColors[wp.type], border:`1px solid ${typeColors[wp.type]}25` }}>
                  {wp.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Solar window */}
          <div className="p-2.5 rounded-lg" style={{ background:"#fffbeb", border:"1px solid rgba(245,158,11,.2)" }}>
            <div className="text-[8px] font-mono text-amber-600 font-bold mb-1.5">SOLAR WINDOW ANALYSIS</div>
            <div className="flex gap-0.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height:"16px", background: i >= 2 && i <= 16 ? "rgba(245,158,11,0.55)" : "rgba(148,163,184,0.2)" }} />
              ))}
            </div>
            <div className="flex justify-between text-[7px] font-mono text-slate-500 mt-1">
              <span>00:00</span>
              <span className="text-amber-600 font-semibold">SOLAR WINDOW</span>
              <span>24:00</span>
            </div>
          </div>

          <button
            onClick={runOptimize}
            disabled={optimizing}
            data-testid="btn-optimize-path"
            className="w-full py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all"
            style={{
              background: optimizing ? "#f0fdf4" : "linear-gradient(135deg,#10b981,#0ea5e9)",
              border: optimizing ? "1px solid #a7f3d0" : "none",
              color: optimizing ? "#10b981" : "white",
              opacity: optimizing ? 0.7 : 1,
            }}
          >
            {optimizing ? (
              <span className="flex items-center justify-center gap-2"><Navigation size={10} className="animate-spin"/>OPTIMIZING...</span>
            ) : (
              <span className="flex items-center justify-center gap-1.5"><Zap size={10}/>{optimized ? "RE-OPTIMIZE PATH" : "OPTIMIZE TRAVERSE"}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
