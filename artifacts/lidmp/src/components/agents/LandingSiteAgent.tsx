import { useState } from "react";
import { Rocket, ChevronDown, ChevronUp } from "lucide-react";
import { landingSites } from "../../data/sensorData";

export default function LandingSiteAgent() {
  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState("LS-01");

  const statusColors: Record<string, string> = {
    primary: "#10b981",
    backup: "#f59e0b",
    rejected: "#ef4444",
  };

  const site = landingSites.find((s) => s.id === selected)!;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }} data-testid="agent-landing-site">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        style={{ borderBottom: expanded ? "1px solid rgba(0,0,0,.05)" : "none" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:"#f5f3ff", border:"1px solid #ddd6fe" }}>
            <Rocket size={15} className="text-violet-500" />
          </div>
          <div>
            <div className="font-orbitron text-[10px] font-bold text-slate-800">LANDING SITE AGENT</div>
            <div className="text-[8px] font-mono text-slate-500">Multi-Criteria Safety Scoring</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill pill-green text-[7px]">COMPLETE</span>
          {expanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 pt-3">
          {/* Site list */}
          <div className="space-y-1.5">
            {landingSites.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                data-testid={`site-${s.id}`}
                className="w-full flex items-center gap-2 p-2 rounded-lg transition-all text-left"
                style={{
                  background: selected === s.id ? `${statusColors[s.status]}08` : "#fafafa",
                  border: `1px solid ${selected === s.id ? statusColors[s.status]+"30" : "rgba(0,0,0,.06)"}`,
                }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColors[s.status] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-mono text-slate-700 truncate font-medium">{s.name}</div>
                  <div className="text-[7px] font-mono text-slate-400">{s.id}</div>
                </div>
                <div className="font-orbitron text-xs font-black flex-shrink-0" style={{ color: statusColors[s.status] }}>
                  {s.safetyScore}%
                </div>
              </button>
            ))}
          </div>

          {/* Selected site detail */}
          {site && (
            <div className="p-2.5 rounded-lg space-y-2" style={{ background:"#f8fafc", border:"1px solid rgba(0,0,0,.06)" }}>
              <div className="text-[9px] font-mono text-slate-700 font-semibold">{site.name}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "SLOPE", value: `${site.slope}°` },
                  { label: "ILLUMINATION", value: `${site.illumination}%` },
                  { label: "THERMAL VAR.", value: `${site.thermalVariance}K` },
                  { label: "ELEVATION", value: `${site.elevation}m` },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="text-[7px] font-mono text-slate-400 font-bold">{d.label}</div>
                    <div className="text-[10px] font-mono text-slate-700 font-bold">{d.value}</div>
                  </div>
                ))}
              </div>
              <div className="text-[8px] font-mono text-slate-600 leading-relaxed">{site.reason}</div>
            </div>
          )}

          {/* Criteria bars */}
          <div className="space-y-1.5">
            <div className="text-[8px] font-mono text-slate-500 tracking-widest font-bold">SCORING CRITERIA</div>
            {[
              { label: "Slope Safety", value: 94, color: "#10b981" },
              { label: "Ice Proximity", value: 93, color: "#0ea5e9" },
              { label: "Solar Access", value: 78, color: "#f59e0b" },
              { label: "Terrain Flat.", value: 88, color: "#8b5cf6" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <div className="text-[8px] font-mono text-slate-500 w-20 flex-shrink-0">{c.label}</div>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${c.value}%`, background: c.color }} />
                </div>
                <div className="text-[8px] font-mono w-8 text-right flex-shrink-0 font-semibold" style={{ color: c.color }}>{c.value}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
