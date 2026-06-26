import { sensorReadings } from "../data/sensorData";
import FlipCard from "../components/FlipCard";
import { Droplets } from "lucide-react";

const sensorMeta: Record<string, { model: string; dataset: string; formula: string; process: string }> = {
  "dfsar-cpr": {
    model:   "DFSAR L+S Dual-Band SAR (Chandrayaan-2 derived)",
    dataset: "LRO MINI-RF CPR mosaic + ISRO DFSAR prototype data, Shackleton 2024",
    formula: "CPR = P_SL / P_OL  (same-sense / opposite-sense power). Ice threshold CPR > 1.8 (Spudis et al. 2013)",
    process: "Backscatter ratio computed per pixel at 75m resolution → anomaly grid → threshold classification → ice mask",
  },
  "dfsar-dop": {
    model:   "DFSAR Degree of Polarization (DOP) algorithm",
    dataset: "Chandrayaan-2 DFSAR calibrated quad-pol data, PSR zones 2022–2024",
    formula: "DOP = √(1 − 4|M|/(tr M)²) where M = polarimetric coherence matrix. DOP < 0.3 → volume scatterer (ice)",
    process: "Stokes matrix decomposition → Cloude-Pottier eigenanalysis → entropy H=0.92 confirms ice",
  },
  "ohrc": {
    model:   "OHRC Terrain Roughness + Shadow Index (Chandrayaan-2)",
    dataset: "OHRC 0.25 m/pixel images, 12 PSR craters, 2023 campaign",
    formula: "Roughness σ = std(DEM 3×3 kernel) / mean. Shadow fraction = dark pixels / total pixels per tile",
    process: "PSR boundary delineation → slope map from LOLA DEM → OHRC image overlay → safe zone extraction",
  },
  "lola": {
    model:   "LOLA Laser Altimetry DEM v3 (LRO)",
    dataset: "LRO LOLA gridded DEM, 5m/pixel, 85°–90°S, release 2023",
    formula: "Slope = arctan(√(∂z/∂x)² + (∂z/∂y)²). Safe landing: slope < 10°, roughness < 0.5m",
    process: "512×512 elevation tile → 3×3 gradient kernel → slope raster → site masking at 5m resolution",
  },
  "illumination": {
    model:   "Diviner Illumination Model (polar seasonal, 2009–2024)",
    dataset: "LRO Diviner PSR illumination fraction maps at 1km/pixel resolution",
    formula: "Illum% = Σ(sunlit_hours) / Σ(total_hours) × 100, integrated over 18.6yr lunar nodal cycle",
    process: "Ray-tracing simulation from LOLA terrain → solar incidence angles → 18.6yr integration → fraction map",
  },
  "diviner": {
    model:   "Diviner Channel 3–5 Bolometric Thermal Model (LRO)",
    dataset: "LRO Diviner global thermal map, 2009–2022, PSR coverage at 0.5km/px",
    formula: "T_brightness = f(TB_ch3, TB_ch4, TB_ch5) using Planck inversion. Ice stable at T < 110 K",
    process: "Multi-channel brightness temperature → surface emissivity correction → thermal inertia modeling → ice stability check",
  },
  "lroc": {
    model:   "LROC NAC + WAC Mosaic (NASA LRO)",
    dataset: "LROC NAC 0.5m proxy images, Shackleton & Haworth, 2020–2024 campaign",
    formula: "Ice reflectance proxy: R_ice = (DN_NAC − DN_background) / DN_background. Albedo anomaly > 0.15 → ice",
    process: "Flat-field correction → dark noise subtraction → albedo calibration → PSR anomaly detection → ice patch mapping",
  },
};

export default function IceDetection() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      <div>
        <div className="font-orbitron text-sm font-black text-slate-800">ICE DETECTION ANALYSIS</div>
        <div className="text-[10px] font-mono text-slate-400 mt-0.5">7-Sensor Fusion · DFSAR CPR/DOP · PSR Mapping · Flip cards for model & formula</div>
      </div>

      {/* Confidence banner */}
      <div className="rounded-2xl p-4 flex items-center gap-5" style={{ background:"white", border:"1px solid rgba(14,165,233,.15)", boxShadow:"0 2px 16px rgba(14,165,233,.06)" }}>
        <div className="text-center flex-shrink-0">
          <div className="font-orbitron text-5xl font-black" style={{ color:"#0ea5e9" }}>93%</div>
          <div className="text-[8px] font-mono text-sky-500 font-bold tracking-widest mt-0.5">ICE CONFIDENCE</div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-slate-800 mb-1">SUBSURFACE ICE CONFIRMED</div>
          <div className="text-[10px] font-mono text-slate-500 leading-relaxed">Multi-sensor fusion confirms high-purity water ice at 1–3 m depth across 47 km² of Shackleton Rim. CPR 2.14 exceeds ice threshold by 19%.</div>
          <div className="flex gap-4 mt-2">
            {[{l:"VOLUME",v:"2.4×10⁸ m³",c:"#0ea5e9"},{l:"DEPTH",v:"1–3 m",c:"#8b5cf6"},{l:"AREA",v:"47 km²",c:"#10b981"},{l:"PURITY",v:">85%",c:"#f59e0b"}].map(s=>(
              <div key={s.l} className="text-center">
                <div className="text-[7px] font-mono text-slate-400">{s.l}</div>
                <div className="font-orbitron text-xs font-black mt-0.5" style={{ color:s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <Droplets size={36} className="text-sky-400 float-anim flex-shrink-0"/>
      </div>

      {/* Sensor flip cards */}
      <div className="grid grid-cols-2 gap-3">
        {sensorReadings.map((s) => {
          const meta = sensorMeta[s.id] ?? { model:"—", dataset:"—", formula:"—", process:"—" };
          return (
            <FlipCard key={s.id} height="260px"
              front={
                <div className="w-full h-full p-4 flex flex-col" style={{ background:"white", border:`2px solid ${s.color}18`, borderRadius:"1rem" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="sensor-badge" style={{ background:`${s.color}12`, color:s.color, border:`1px solid ${s.color}25`, fontSize:"8px" }}>{s.name}</span>
                        {s.band && <span className="text-[7px] font-mono text-slate-400">[{s.band}]</span>}
                      </div>
                      <div className="text-[8px] font-mono text-slate-400">{s.instrument}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-orbitron text-2xl font-black leading-none" style={{ color:s.color }}>{s.value}</div>
                      <div className="text-[8px] font-mono text-slate-400 mt-0.5">{s.unit}</div>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 leading-relaxed flex-1">{s.description}</div>
                  <div className="mt-2">
                    <div className="flex justify-between text-[8px] font-mono mb-1">
                      <span className="text-slate-400">CONFIDENCE</span>
                      <span className="font-semibold" style={{ color:s.color }}>{s.confidence}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100">
                      <div className="h-1.5 rounded-full" style={{ width:`${s.confidence}%`, background:s.color }}/>
                    </div>
                  </div>
                  <div className="mt-2 text-[7px] font-mono text-slate-300 text-right">← flip for model & formula</div>
                </div>
              }
              back={
                <div className="w-full h-full p-4 flex flex-col overflow-hidden" style={{ background:`${s.color}06`, border:`2px solid ${s.color}28`, borderRadius:"1rem" }}>
                  <div className="text-[8px] font-orbitron font-bold tracking-widest mb-3" style={{ color:s.color }}>MODEL & PROOF</div>
                  <div className="space-y-2 flex-1 overflow-hidden text-[8px] font-mono">
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">MODEL / INSTRUMENT</div>
                      <div className="text-slate-700 leading-snug">{meta.model}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">DATASET USED</div>
                      <div className="text-slate-600 leading-snug">{meta.dataset}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">FORMULA</div>
                      <div className="text-[7.5px] leading-snug p-1.5 rounded" style={{ background:`${s.color}10`, color:s.color, fontFamily:"monospace" }}>{meta.formula}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">PROCESSING PIPELINE</div>
                      <div className="text-slate-600 leading-snug">{meta.process}</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t" style={{ borderColor:`${s.color}15` }}>
                    <div className="text-[7px] font-mono" style={{ color:`${s.color}aa` }}>
                      ALTERNATIVES RULED OUT: {s.proof.alternatives.slice(0,2).join(" · ").slice(0,80)}
                    </div>
                  </div>
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
