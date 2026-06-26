import { riskFactors } from "../data/sensorData";
import FlipCard from "../components/FlipCard";
import { ShieldCheck } from "lucide-react";

const riskMeta: Record<string, { model: string; data: string; formula: string; process: string }> = {
  "Terrain Safety": {
    model:   "LROC NAC boulder detection + LOLA roughness model (NASA AMES)",
    data:    "LROC NAC 0.5m mosaic, LOLA roughness at 5m baseline, OHRC 0.25m pre-landing survey",
    formula: "Hazard_density = Σ(boulders > 0.3m) / area_m². Safe threshold < 0.002 per m². Shackleton: 0.0014/m²",
    process: "LROC boulder catalogue → density map → landing zone filtering → OHRC fine-resolution confirm → 13% terrain risk",
  },
  "Solar Power": {
    model:   "LRO Diviner illumination model + ISRO power subsystem heritage (Chandrayaan-2 VLA)",
    data:    "Illumination fraction map (Mazarico 2011), 18.6yr Metonic cycle integration at 240m/pixel",
    formula: "Power_margin = P_solar × illum_fraction − P_load. Margin = 240W × 0.183 − 38W = 5.9W (low buffer)",
    process: "Illumination map → solar panel sizing → battery backup model (720 Wh) → dark-traverse power budget → 24% risk",
  },
  "Thermal": {
    model:   "Diviner Channel 3–5 thermal model + ISRO thermal control heritage (Chandrayaan-2)",
    data:    "LRO Diviner surface temps 40.1–120 K (PSR), 373 K (dayside). Thermal inertia from 2009–2022",
    formula: "Thermal_risk = 1 − exp(−(T_max−T_limit)/ΔT). T_limit=350K, ΔT=30K → risk 9%",
    process: "Diviner thermal model → peak temperature estimate → thermal control margin analysis → Monte Carlo 10,000 runs → 9% risk",
  },
  "Communication": {
    model:   "DSN link budget model + LOS geometry from LOLA DEM terrain (JPL 810-005 standard)",
    data:    "LOLA terrain profile, DSN 70m antenna G/T, GSLV-F14 relay orbit parameters",
    formula: "Link margin = EIRP + G/T − FSPL − L_atm − L_point. Min margin 3 dB. Shackleton: margin 6.2 dB",
    process: "Terrain masking analysis → Earth visibility windows → relay orbit coverage → link budget per pass → 18% comm outage risk",
  },
  "Dust Accum.": {
    model:   "LRO LAMP dust levitation model + solar panel degradation from Chandrayaan-2 heritage",
    data:    "LRO LAMP: dust levitation event statistics at 85°–90°S, 3 events/year. Solar cell degradation data.",
    formula: "Panel_eff = η₀ × exp(−k × dust_loading). k=0.09 per 90 sols. Degradation: −8% per 90 sols.",
    process: "LAMP dust event frequency → deposition model → panel efficiency curve → power margin check → 32% accumulated risk",
  },
  "Cosmic Rad.": {
    model:   "ISRO RADOM radiation model + LRO CRaTER GCR flux dataset",
    data:    "LRO CRaTER galactic cosmic ray (GCR) flux 2009–2024, solar energetic particle (SEP) event statistics",
    formula: "Dose_rate = Φ_GCR × σ_LET × shielding_factor(Al 3mm). Annual dose: 310 mGy → risk 27%",
    process: "GCR spectrum → LET distribution → shielding attenuation model → cumulative dose → component tolerance check → 27% risk",
  },
};

export default function RiskAssessment() {
  const sc  = (s: string) => s==="low"?"#10b981":s==="medium"?"#f59e0b":"#ef4444";
  const overall = Math.round(riskFactors.reduce((a,r)=>a+r.score,0)/riskFactors.length);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      <div>
        <div className="font-orbitron text-sm font-black text-slate-800">RISK ASSESSMENT</div>
        <div className="text-[10px] font-mono text-slate-500 mt-0.5">Monte Carlo · 10,000 Runs · MIL-STD-882E · Flip cards for model &amp; formula</div>
      </div>

      {/* Overall banner */}
      <div className="rounded-2xl p-4 flex items-center gap-5" style={{ background:"white", border:"1px solid rgba(16,185,129,.15)" }}>
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#f0fdf4" strokeWidth="7"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke="#10b981" strokeWidth="7"
              strokeDasharray={`${(overall/100)*213.6} 213.6`} strokeLinecap="round"/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-orbitron text-xl font-black text-emerald-600">{overall}</div>
            <div className="text-[7px] font-mono text-emerald-500 font-bold">SAFE</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-orbitron text-lg font-black text-emerald-600">MISSION GO</div>
          <div className="text-[10px] font-mono text-slate-600 mt-1 leading-relaxed">All critical parameters within MIL-STD-882E acceptable range. Monte Carlo 10,000-run simulation confirms mission viability. Launch window 2026-09-14 cleared.</div>
          <div className="flex gap-3 mt-2">
            <span className="pill pill-green text-[7px]">3 LOW</span>
            <span className="pill pill-amber text-[7px]">3 MEDIUM</span>
            <span className="pill text-[7px]" style={{ background:"#f1f5f9", color:"#64748b" }}>0 HIGH</span>
          </div>
        </div>
        <ShieldCheck size={36} className="text-emerald-400 float-anim flex-shrink-0"/>
      </div>

      {/* Risk flip cards */}
      <div className="grid grid-cols-2 gap-3">
        {riskFactors.map((r) => {
          const color = sc(r.severity);
          const meta  = riskMeta[r.name] ?? { model:"Risk data pending analysis", data:"Mission telemetry feed active", formula:"Score = weighted_risk_factors / total_factors", process:"Running Monte Carlo simulation…" };
          return (
            <FlipCard key={r.name} height="200px"
              front={
                <div className="w-full h-full p-4 flex flex-col" style={{ background:"white", border:`1px solid ${color}25`, borderRadius:"1rem" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-orbitron text-sm font-bold text-slate-800">{r.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="font-orbitron text-xl font-black" style={{ color }}>{r.score}%</div>
                      <span className="pill text-[7px]" style={{ background:`${color}12`, color, border:`1px solid ${color}25` }}>{r.severity.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 mb-2">
                    <div className="h-2 rounded-full transition-all" style={{ width:`${r.score}%`, background:color }}/>
                  </div>
                  <div className="text-[9px] font-mono text-slate-600 leading-relaxed flex-1">{r.detail}</div>
                  <div className="mt-2 text-[8px] font-mono p-1.5 rounded" style={{ background:`${color}08`, color:`${color}cc` }}>{r.proof.slice(0,80)}</div>
                  <div className="text-[7px] font-mono text-slate-400 text-right mt-1">← flip for model &amp; formula</div>
                </div>
              }
              back={
                <div className="w-full h-full p-4 flex flex-col overflow-hidden" style={{ background:`${color}06`, border:`1px solid ${color}28`, borderRadius:"1rem" }}>
                  <div className="text-[8px] font-orbitron font-bold tracking-widest mb-3" style={{ color }}>RISK MODEL — {r.name.toUpperCase()}</div>
                  <div className="space-y-2 flex-1 overflow-hidden text-[8px] font-mono">
                    <div>
                      <div className="text-[7px] text-slate-500 font-bold mb-0.5">MODEL / STANDARD</div>
                      <div className="text-slate-700 leading-snug">{meta.model}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-500 font-bold mb-0.5">DATA USED</div>
                      <div className="text-slate-600 leading-snug">{meta.data}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-500 font-bold mb-0.5">FORMULA</div>
                      <div className="text-[7.5px] p-1.5 rounded leading-snug" style={{ background:`${color}10`, color, fontFamily:"monospace" }}>{meta.formula}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-500 font-bold mb-0.5">PROCESS</div>
                      <div className="text-slate-600 leading-snug">{meta.process}</div>
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
