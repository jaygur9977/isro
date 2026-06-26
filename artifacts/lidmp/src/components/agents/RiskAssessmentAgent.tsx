import { useState } from "react";
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { riskFactors } from "../../data/sensorData";

export default function RiskAssessmentAgent() {
  const [expanded, setExpanded] = useState(true);
  const [monitoring, setMonitoring] = useState(true);

  const severityColor = (severity: string) => {
    if (severity === "low") return "#10b981";
    if (severity === "medium") return "#f59e0b";
    return "#ef4444";
  };

  const overallRisk = Math.round(riskFactors.reduce((acc, r) => acc + r.score, 0) / riskFactors.length);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }} data-testid="agent-risk-assessment">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        style={{ borderBottom: expanded ? "1px solid rgba(0,0,0,.05)" : "none" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:"#fffbeb", border:"1px solid #fde68a" }}>
            <AlertTriangle size={15} className="text-amber-500" />
          </div>
          <div>
            <div className="font-orbitron text-[10px] font-bold text-slate-800">RISK ASSESSMENT AGENT</div>
            <div className="text-[8px] font-mono text-slate-500">Real-Time Mission Risk Monitoring</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill pill-sky text-[7px] flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-sky-400 pulse-soft" />
            LIVE
          </span>
          {expanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 pt-3">
          {/* Overall score */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#f0fdf4" strokeWidth="6" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#10b981" strokeWidth="6"
                  strokeDasharray={`${(overallRisk / 100) * 163} 163`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-orbitron text-sm font-black text-emerald-600">{overallRisk}</div>
                <div className="text-[7px] font-mono text-emerald-500 font-bold">SAFE</div>
              </div>
            </div>
            <div>
              <div className="text-[8px] font-mono text-slate-500 mb-1">OVERALL MISSION SAFETY</div>
              <div className="font-orbitron text-base font-black text-emerald-600">{overallRisk}% NOMINAL</div>
              <div className="text-[8px] font-mono text-slate-600 mt-1 flex items-center gap-1">
                <ShieldCheck size={10} className="text-emerald-500" />
                3 LOW · 3 MEDIUM · 0 HIGH RISKS
              </div>
            </div>
          </div>

          {/* Risk factors */}
          <div className="space-y-2">
            {riskFactors.map((r) => (
              <div key={r.name} data-testid={`risk-${r.name.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: severityColor(r.severity) }} />
                    <span className="text-[8px] font-mono text-slate-600">{r.name}</span>
                  </div>
                  <span className="text-[8px] font-mono font-bold" style={{ color: severityColor(r.severity) }}>{r.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full transition-all" style={{ width:`${r.score}%`, background: severityColor(r.severity) }} />
                </div>
                <div className="text-[7px] font-mono text-slate-500 mt-0.5">{r.detail}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setMonitoring(!monitoring)}
            data-testid="btn-toggle-monitoring"
            className="w-full py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all"
            style={{
              background: monitoring ? "#fffbeb" : "#f8fafc",
              border: `1px solid ${monitoring ? "#fde68a" : "rgba(0,0,0,.06)"}`,
              color: monitoring ? "#92400e" : "#64748b",
            }}
          >
            <span className="flex items-center justify-center gap-1.5">
              <RefreshCw size={10} className={monitoring ? "animate-spin" : ""} />
              {monitoring ? "MONITORING ACTIVE — CLICK TO PAUSE" : "START MONITORING"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
