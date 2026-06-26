import { roverWaypoints } from "../data/sensorData";
import FlipCard from "../components/FlipCard";
import { MapPin } from "lucide-react";

const typeColors: Record<string,string> = { start:"#10b981", waypoint:"#0ea5e9", science:"#f59e0b", end:"#ef4444" };

const wpMeta: Record<string, { model: string; data: string; formula: string; process: string }> = {
  "W0": {
    model:   "Shackleton Rim Alpha — Mission baseline point (ISRO LOLA-defined)",
    data:    "LOLA DEM 5m + OHRC 0.25m surface imagery, confirmed safe by slope < 3°",
    formula: "Waypoint priority = Safety(0.5) + ScienceValue(0.3) + SolarAccess(0.2). W0: score 0.96",
    process: "Landing confirmation → terrain verification → mast camera deploy → DFSAR baseline calibration",
  },
  "W1": {
    model:   "Navigation waypoint — A* pathfinding on LOLA 5m DEM grid",
    data:    "OHRC 0.25m obstacle map, 3 boulders >0.4m identified and routed around",
    formula: "A* cost = dist_km + 2.5×slope_penalty + 1.8×boulder_penalty. W1 path cost: 0.81 (optimal)",
    process: "OHRC boulder detection → A* re-route → slope verification → traverse approval",
  },
  "W2": {
    model:   "MINI-RF CPR anomaly — Ice Anomaly Alpha-1 (highest CPR in corridor)",
    data:    "MINI-RF CPR mosaic (CPR=2.31) + DFSAR DOP < 0.06, patch size ~0.8 km²",
    formula: "Science priority = CPR_excess × DOP_score × area_factor. Alpha-1: 2.31 × 0.94 × 1.0 = 2.17",
    process: "DFSAR L+S scan → CPR grid → anomaly > 1.8 detected → core sample + subsurface drill deploy",
  },
  "W3": {
    model:   "LOLA DEM ridge traversal — elevated relay point for Earth comms",
    data:    "LOLA 5m DEM (+34m relative), LROC NAC obstacle map, solar illumination 82%",
    formula: "A* cost = dist_km + 2.5×slope_penalty + 1.8×shadow_penalty. Ridge cost: 3.2 (optimal of 6 paths)",
    process: "DEM gradient → A* on weighted graph → ridge crest selected → 82% illumination confirmed",
  },
  "W4": {
    model:   "LROC NAC albedo anomaly + Diviner cold trap at 41 K",
    data:    "LROC NAC albedo 0.15 anomaly index, Diviner T=41K, second independent DFSAR confirmation",
    formula: "Ice probability = CPR_weight × 0.4 + Albedo_weight × 0.35 + T_stability × 0.25. Score: 0.87",
    process: "LROC albedo map → anomaly detection → Diviner confirm → GPR subsurface scan → core sample",
  },
  "W5": {
    model:   "PSR-sunlit transition zone — scientifically valuable boundary point",
    data:    "Illumination model (Mazarico 2011), DFSAR CPR 1.4, Diviner gradient 41→95K over 200m",
    formula: "Science value = boundary_gradient × CPR × illumination_fraction. W5: 0.54 × 1.4 × 0.62 = 0.47",
    process: "Boundary mapping → seismometer array deploy → meteorology station install → long-term monitoring",
  },
};

export default function RoverPath() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      <div>
        <div className="font-orbitron text-sm font-black text-slate-800">ROVER TRAVERSE PLANNING</div>
        <div className="text-[10px] font-mono text-slate-400 mt-0.5">A* Pathfinding · Solar Constraints · Science Stops · Flip cards for model &amp; formula</div>
      </div>

      {/* Visual path */}
      <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)" }}>
        <div className="text-[8px] font-mono text-slate-400 font-bold tracking-widest mb-3">TRAVERSE PATH — 5.8 km TOTAL</div>
        <div className="flex items-center">
          {roverWaypoints.map((wp, i) => (
            <div key={wp.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor:typeColors[wp.type], background:`${typeColors[wp.type]}15` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background:typeColors[wp.type] }}/>
                </div>
                <div className="text-[6px] font-mono text-slate-500 w-12 text-center leading-tight">{wp.id}</div>
                <div className="text-[6px] font-mono text-slate-400">{wp.distanceKm}km</div>
              </div>
              {i < roverWaypoints.length-1 && (
                <div className="flex-1 h-px mb-6" style={{ background:"linear-gradient(90deg,rgba(16,185,129,.5),rgba(14,165,233,.3))" }}/>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {l:"TOTAL DISTANCE", v:"5.8 km",  c:"#10b981", bg:"#f0fdf4"},
          {l:"SOLAR HOURS",    v:"15.6 h",  c:"#f59e0b", bg:"#fffbeb"},
          {l:"WAYPOINTS",      v:"6",        c:"#0ea5e9", bg:"#f0f9ff"},
          {l:"SCIENCE STOPS",  v:"2",        c:"#8b5cf6", bg:"#f5f3ff"},
        ].map(m=>(
          <div key={m.l} className="rounded-2xl p-3 text-center" style={{ background:"white", border:`1px solid ${m.c}15` }}>
            <div className="text-[7px] font-mono tracking-widest mb-1" style={{ color:m.c }}>{m.l}</div>
            <div className="font-orbitron text-lg font-black" style={{ color:m.c }}>{m.v}</div>
          </div>
        ))}
      </div>

      {/* Waypoint flip cards */}
      <div className="grid grid-cols-2 gap-3">
        {roverWaypoints.map((wp) => {
          const meta = wpMeta[wp.id];
          const color = typeColors[wp.type];
          return (
            <FlipCard key={wp.id} height="240px"
              front={
                <div className="w-full h-full p-4 flex flex-col" style={{ background:"white", border:`2px solid ${color}18`, borderRadius:"1rem" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-orbitron text-sm font-black text-slate-800">{wp.id}</div>
                      <div className="text-[8px] font-mono text-slate-400 mt-0.5">{wp.label}</div>
                    </div>
                    <span className="pill text-[7px]" style={{ background:`${color}12`, color, border:`1px solid ${color}25` }}>{wp.type.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin size={9} style={{ color }}/>
                    <span className="text-[8px] font-mono font-semibold" style={{ color }}>{wp.lat}°S, {wp.lon}°E</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 leading-relaxed flex-1">{wp.proof.terrain}</div>
                  <div className="space-y-1.5 mt-2">
                    {[
                      {l:"Distance",  v:`${wp.distanceKm} km`},
                      {l:"Solar hrs", v:`${wp.solarHours} h`},
                      {l:"Science",   v:wp.proof.science},
                    ].map(r=>(
                      <div key={r.l} className="flex justify-between gap-2">
                        <span className="text-[7px] font-mono text-slate-400 flex-shrink-0">{r.l}</span>
                        <span className="text-[7px] font-mono font-semibold text-slate-600 text-right leading-tight">{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[7px] font-mono text-slate-300 text-right mt-1">← flip for model &amp; formula</div>
                </div>
              }
              back={
                <div className="w-full h-full p-4 flex flex-col overflow-hidden" style={{ background:`${color}06`, border:`2px solid ${color}28`, borderRadius:"1rem" }}>
                  <div className="text-[8px] font-orbitron font-bold tracking-widest mb-3" style={{ color }}>PLANNING MODEL — {wp.id}</div>
                  <div className="space-y-2 flex-1 overflow-hidden text-[8px] font-mono">
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">MODEL / RATIONALE</div>
                      <div className="text-slate-700 leading-snug">{meta.model}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">DATA USED</div>
                      <div className="text-slate-600 leading-snug">{meta.data}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">FORMULA / ALGORITHM</div>
                      <div className="text-[7.5px] p-1.5 rounded leading-snug" style={{ background:`${color}10`, color, fontFamily:"monospace" }}>{meta.formula}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold mb-0.5">PROCESS</div>
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
