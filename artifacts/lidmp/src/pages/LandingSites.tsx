import { useState } from "react";
import { landingSites } from "../data/sensorData";
import FlipCard from "../components/FlipCard";
import { CheckCircle, AlertCircle, XCircle, MapPin } from "lucide-react";

const siteScience: Record<string, { model: string; data: string; formula: string; process: string }> = {
  "LS-01": {
    model:   "Chandrayaan-2 OHRC + LRO LOLA DEM v3 + MINI-RF CPR",
    data:    "LOLA 5m/px DEM, OHRC 0.25m images, MINI-RF CPR mosaic, Diviner illumination 2020–2024",
    formula: "Safety Score = 0.40×Slope_score + 0.35×Ice_conf + 0.15×Illum_score + 0.10×Comms_score (weighted MCE)",
    process: "LOLA slope < 8° mask → OHRC obstacle scan → CPR ice overlay → illumination fraction → weighted composite → score 94%",
  },
  "LS-02": {
    model:   "LRO LOLA + Chandrayaan-1 M³ spectral data",
    data:    "LOLA DEM 5m, M³ OH absorption band map, LROC WAC illumination model 2019–2023",
    formula: "Safety Score = 0.40×Slope + 0.35×Ice_conf + 0.15×Illum + 0.10×Comms. Ice from M³: OH absorption > 2.7μm",
    process: "Slope analysis → M³ spectral unmixing → OH band depth threshold → illumination ray-trace → score 78%",
  },
  "LS-03": {
    model:   "LRO LOLA + LROC NAC + Diviner Thermal",
    data:    "LOLA DEM, LROC NAC 0.5m, Diviner channel 3–5 brightness temperatures 2009–2022",
    formula: "Safety Score same MCE. Nobile scored lower due to slope > 14° in 60% of candidate area",
    process: "DEM slope → Diviner thermal stability (T < 110 K) → NAC boulder detection → MCE composite → score 71%",
  },
  "LS-04": {
    model:   "LRO LOLA + Chandrayaan-2 IIRS thermal",
    data:    "LOLA DEM, IIRS surface temperature map, LROC illumination model",
    formula: "Safety Score same MCE. Rejected: slope median 22°, illumination only 6.2%, DFSAR CPR below threshold",
    process: "All criteria below threshold: slope 22° (limit 10°) → MCE score 42% → REJECTED",
  },
};

export default function LandingSites() {
  const [selected, setSelected] = useState("LS-01");
  const site = landingSites.find((s) => s.id === selected)!;
  const sc = (s: string) => s==="primary"?"#10b981":s==="backup"?"#f59e0b":"#ef4444";
  const icon = (s: string) => s==="primary"?<CheckCircle size={13} style={{color:"#10b981"}}/>:s==="backup"?<AlertCircle size={13} style={{color:"#f59e0b"}}/>:<XCircle size={13} style={{color:"#ef4444"}}/>;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      <div>
        <div className="font-orbitron text-sm font-black text-slate-800">LANDING SITE ANALYSIS</div>
        <div className="text-[10px] font-mono text-slate-400 mt-0.5">Multi-Criteria Evaluation · 4 Candidates · Flip cards for model, data & formula</div>
      </div>

      {/* Site cards */}
      <div className="grid grid-cols-2 gap-3">
        {landingSites.map((s) => {
          const sci = siteScience[s.id];
          const color = sc(s.status);
          return (
            <FlipCard key={s.id} height="260px"
              front={
                <div className="w-full h-full p-4 flex flex-col cursor-pointer"
                  onClick={() => setSelected(s.id)}
                  style={{ background:selected===s.id?`${color}06`:"white", border:`2px solid ${selected===s.id?color+"40":"#e8ecf0"}`, borderRadius:"1rem", boxShadow:selected===s.id?`0 0 0 3px ${color}12`:"none" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">{icon(s.status)}<span className="font-orbitron text-sm font-black text-slate-800">{s.id}</span></div>
                      <div className="text-[9px] font-mono text-slate-500">{s.name}</div>
                    </div>
                    <div className="font-orbitron text-2xl font-black" style={{ color }}>{s.safetyScore}%</div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin size={9} style={{ color }}/>
                    <span className="text-[8px] font-mono font-semibold" style={{ color }}>{s.lat}°S, {s.lon}°E · {s.elevation}m</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {[{l:"Ice Conf.",v:`${s.iceConfidence}%`,n:s.iceConfidence,c:"#0ea5e9"},{l:"Slope",v:`${s.slope}°`,n:Math.min(100,s.slope*6),c:s.slope<5?"#10b981":"#f59e0b"},{l:"Illumination",v:`${s.illumination}%`,n:s.illumination,c:"#f59e0b"},{l:"Safety",v:`${s.safetyScore}%`,n:s.safetyScore,c:color}].map(r=>(
                      <div key={r.l} className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-slate-400 w-20">{r.l}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full" style={{ width:`${r.n}%`, background:r.c }}/></div>
                        <span className="text-[8px] font-mono font-bold" style={{ color:r.c }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <span className="pill mt-2 self-start text-[7px]" style={{ background:`${color}12`, color, border:`1px solid ${color}25` }}>
                    {s.status.toUpperCase()}
                  </span>
                  <div className="text-[7px] font-mono text-slate-300 text-right mt-1">← flip for model & formula</div>
                </div>
              }
              back={
                <div className="w-full h-full p-4 flex flex-col overflow-hidden" style={{ background:`${color}06`, border:`2px solid ${color}28`, borderRadius:"1rem" }}>
                  <div className="text-[8px] font-orbitron font-bold tracking-widest mb-3" style={{ color }}>SCORING MODEL & PROOF</div>
                  <div className="space-y-2 flex-1 overflow-hidden text-[8px] font-mono">
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">INSTRUMENTS / MODELS USED</div>
                      <div className="text-slate-700 leading-snug">{sci.model}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">DATASETS</div>
                      <div className="text-slate-600 leading-snug">{sci.data}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">SCORING FORMULA</div>
                      <div className="text-[7.5px] p-1.5 rounded leading-snug" style={{ background:`${color}10`, color, fontFamily:"monospace" }}>{sci.formula}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">PROCESSING STEPS</div>
                      <div className="text-slate-600 leading-snug">{sci.process}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">GPS COORDINATES</div>
                      <div className="text-slate-700 font-semibold">{s.proof.coordinates}</div>
                    </div>
                  </div>
                </div>
              }
            />
          );
        })}
      </div>

      {/* Detail panel for selected site */}
      <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)" }}>
        <div className="text-[9px] font-mono text-emerald-600 font-bold tracking-widest mb-2">SELECTED SITE DETAIL — {site.id}</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          {[["Name",site.name],["Coordinates",site.proof.coordinates],["Safety Score",`${site.safetyScore}%`],["Ice Confidence",`${site.iceConfidence}%`],["Slope",`${site.slope}°`],["Illumination",`${site.illumination}%`],["Status",site.status.toUpperCase()],["Source",site.proof.source.slice(0,40)]].map(([k,v])=>(
            <div key={k} className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-[8px] font-mono text-slate-400">{k}</span>
              <span className="text-[8px] font-mono font-semibold text-slate-700 text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
