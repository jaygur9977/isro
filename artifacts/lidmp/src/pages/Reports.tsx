import { useState } from "react";
import { Download, FileText, Table, CheckCircle, FlaskConical } from "lucide-react";
import { missionMetrics, landingSites, riskFactors, sensorReadings } from "../data/sensorData";

// Simulation run log — stores last AI analysis params (in-memory for session)
const SIM_LOG_KEY = "lidmp_sim_log";

interface SimLog { date: string; params: Record<string, string>; result: string; }

export default function Reports() {
  const [exported, setExported] = useState<string | null>(null);

  const simLogs: SimLog[] = (() => {
    try { return JSON.parse(localStorage.getItem(SIM_LOG_KEY) ?? "[]"); } catch { return []; }
  })();

  const exportCSV = () => {
    const rows = [
      ["LIDMP Mission Report — Chandrayaan-4 South Pole Survey"],
      ["Generated", new Date().toISOString()], [""],
      ["SENSOR DATA — PROOF"],
      ["Instrument", "Value", "Unit", "Confidence", "Status", "Proof Method", "Threshold"],
      ...sensorReadings.map((s) => [s.instrument, s.value, s.unit, `${s.confidence}%`, s.status, `"${s.proof.method}"`, `"${s.proof.threshold}"`]),
      [""],
      ["LANDING SITES — PROOF"],
      ["ID", "Name", "Safety", "Ice Conf.", "Slope", "Status", "Coordinates", "Data Source"],
      ...landingSites.map((s) => [s.id, s.name, `${s.safetyScore}%`, `${s.iceConfidence}%`, `${s.slope}°`, s.status, `"${s.proof.coordinates}"`, `"${s.proof.source}"`]),
      [""],
      ["RISK FACTORS — PROOF"],
      ["Category", "Score", "Severity", "Detail", "Proof"],
      ...riskFactors.map((r) => [r.name, `${r.score}%`, r.severity, `"${r.detail}"`, `"${r.proof}"`]),
      [""],
      ["MISSION METRICS"], ...Object.entries(missionMetrics).map(([k, v]) => [k, v]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "LIDMP_Mission_Report.csv"; a.click();
    setExported("csv"); setTimeout(() => setExported(null), 3000);
  };

  const exportJSON = () => {
    const data = {
      mission: "Chandrayaan-4 South Pole Survey",
      generated: new Date().toISOString(),
      sensors: sensorReadings.map((s) => ({ ...s })),
      landingSites,
      riskFactors,
      metrics: missionMetrics,
      simulationLogs: simLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "LIDMP_Mission_Data.json"; a.click();
    setExported("json"); setTimeout(() => setExported(null), 3000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4" style={{ background: "linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      <div>
        <div className="font-orbitron text-base font-black text-slate-800">MISSION REPORTS</div>
        <div className="text-xs font-mono text-slate-400">Full Proof · Sensor Source · Simulation Log · CSV / JSON Export</div>
      </div>

      {/* Export buttons */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id:"csv",  label:"EXPORT CSV",  sub:"Sensor · Site · Risk · Proof data", icon:<Table size={18}/>,    color:"#10b981", bg:"#f0fdf4", fn:exportCSV },
          { id:"json", label:"EXPORT JSON", sub:"Full mission dataset + sim logs",   icon:<FileText size={18}/>, color:"#8b5cf6", bg:"#f5f3ff", fn:exportJSON },
        ].map((b) => (
          <button key={b.id} onClick={b.fn} className="flex items-center gap-3 p-4 rounded-2xl transition-all text-left"
            style={{ background:"white", border:`1px solid ${b.color}20`, boxShadow:`0 2px 12px ${b.color}08` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: b.bg }}>
              {exported === b.id ? <CheckCircle size={18} style={{ color: b.color }}/> : <span style={{ color: b.color }}>{b.icon}</span>}
            </div>
            <div>
              <div className="font-orbitron text-xs font-bold" style={{ color: b.color }}>{b.label}</div>
              <div className="text-[9px] font-mono text-slate-400 mt-0.5">{b.sub}</div>
            </div>
            <Download size={14} style={{ color: b.color }} className="ml-auto"/>
          </button>
        ))}
      </div>

      {/* Sensor proof table */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)" }}>
        <div className="px-4 py-2.5 flex items-center gap-2" style={{ background:"#f0f9ff", borderBottom:"1px solid rgba(14,165,233,.1)" }}>
          <FlaskConical size={12} className="text-sky-500" />
          <span className="text-[9px] font-mono font-bold text-sky-600 tracking-widest">SENSOR DATA — HOW EACH READING WAS OBTAINED</span>
        </div>
        {sensorReadings.map((s, i) => (
          <div key={s.id} className="px-4 py-3 border-t" style={{ borderColor:"rgba(0,0,0,.05)", background: i%2===0?"#fafafa":"white" }}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <span className="sensor-badge" style={{ background:`${s.color}15`, color:s.color, border:`1px solid ${s.color}25` }}>{s.name}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-orbitron text-xs font-black" style={{ color: s.color }}>{s.value} {s.unit}</span>
                  <span className="text-[8px] font-mono text-slate-400">{s.instrument}</span>
                  <span className="text-[8px] font-mono font-bold" style={{ color: s.status==="nominal"?"#10b981":"#f59e0b" }}>{s.confidence}% CONF</span>
                </div>
                <div className="text-[9px] font-mono text-slate-600 mb-1 leading-relaxed">{s.proof.method}</div>
                <div className="text-[8px] font-mono text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-500">Threshold: </span>{s.proof.threshold}
                </div>
                <div className="mt-1 text-[8px] font-mono leading-relaxed" style={{ color:`${s.color}99` }}>
                  <span className="font-semibold" style={{ color:s.color }}>Raw: </span>{s.proof.rawData}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Landing site proof */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)" }}>
        <div className="px-4 py-2.5" style={{ background:"#f0fdf4", borderBottom:"1px solid rgba(16,185,129,.1)" }}>
          <span className="text-[9px] font-mono font-bold text-emerald-600 tracking-widest">LANDING SITES — SCORING METHODOLOGY & EXACT COORDINATES</span>
        </div>
        {landingSites.map((s, i) => {
          const sc = s.status==="primary"?"#10b981":s.status==="backup"?"#f59e0b":"#ef4444";
          return (
            <div key={s.id} className="px-4 py-3 border-t" style={{ borderColor:"rgba(0,0,0,.05)", background:i%2===0?"#fafafa":"white" }}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-orbitron text-xs font-bold" style={{ color:sc }}>{s.id}</span>
                <span className="text-xs font-mono text-slate-700">{s.name}</span>
                <span className="pill" style={{ background:`${sc}15`, color:sc, border:`1px solid ${sc}25`, fontSize:"8px" }}>{s.status.toUpperCase()}</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 mb-1"><span className="font-semibold text-slate-600">Coordinates: </span>{s.proof.coordinates}</div>
              <div className="text-[9px] font-mono text-slate-500 mb-1"><span className="font-semibold text-slate-600">Method: </span>{s.proof.method}</div>
              <div className="text-[9px] font-mono text-slate-500 mb-1"><span className="font-semibold text-slate-600">Data source: </span>{s.proof.source}</div>
              <div className="text-[8px] font-mono p-1.5 rounded mt-1" style={{ background:`${sc}08`, color:sc }}>{s.proof.alternatives}</div>
            </div>
          );
        })}
      </div>

      {/* Risk proof */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)" }}>
        <div className="px-4 py-2.5" style={{ background:"#fff1f2", borderBottom:"1px solid rgba(244,63,94,.1)" }}>
          <span className="text-[9px] font-mono font-bold text-rose-600 tracking-widest">RISK ASSESSMENT — PROOF & DATA SOURCES</span>
        </div>
        {riskFactors.map((r, i) => {
          const sc = r.severity==="low"?"#10b981":r.severity==="medium"?"#f59e0b":"#ef4444";
          return (
            <div key={r.name} className="px-4 py-3 border-t" style={{ borderColor:"rgba(0,0,0,.05)", background:i%2===0?"#fafafa":"white" }}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-orbitron text-xs font-bold" style={{ color:sc }}>{r.name}</span>
                <span className="font-orbitron text-sm font-black" style={{ color:sc }}>{r.score}%</span>
                <span className="pill" style={{ background:`${sc}15`, color:sc, border:`1px solid ${sc}25`, fontSize:"8px" }}>{r.severity.toUpperCase()}</span>
              </div>
              <div className="text-[9px] font-mono text-slate-600 mb-1">{r.detail}</div>
              <div className="text-[8px] font-mono text-slate-500 p-1.5 rounded" style={{ background:"#f8fafc" }}>
                <span className="font-semibold text-slate-600">Proof: </span>{r.proof}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission metrics */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)" }}>
        <div className="px-4 py-2.5" style={{ background:"#f5f3ff", borderBottom:"1px solid rgba(139,92,246,.1)" }}>
          <span className="text-[9px] font-mono font-bold text-violet-600 tracking-widest">MISSION PARAMETER SUMMARY</span>
        </div>
        {Object.entries(missionMetrics).map(([k, v], i) => (
          <div key={k} className="flex items-center justify-between px-4 py-2 text-xs font-mono border-t"
            style={{ borderColor:"rgba(0,0,0,.05)", background:i%2===0?"#fafafa":"white" }}>
            <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</span>
            <span className="text-slate-800 font-semibold">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
