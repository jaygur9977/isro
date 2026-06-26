import { useState } from "react";
import { sensorReadings, landingSites, missionMetrics, riskFactors, type LunarCrater } from "../data/sensorData";
import FlipCard from "../components/FlipCard";
import { Activity, Target, Navigation, AlertTriangle, Satellite } from "lucide-react";

interface DashboardProps { crater: LunarCrater; }

function SensorFlipCard({ s }: { s: typeof sensorReadings[number] }) {
  return (
    <FlipCard
      height="190px"
      front={
        <div className="w-full h-full p-4 flex flex-col" style={{ background:"white", border:`1px solid ${s.color}15`, borderRadius:"1rem", boxShadow:`0 1px 6px ${s.color}06` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="sensor-badge" style={{ background:`${s.color}10`, color:s.color, border:`1px solid ${s.color}20`, fontSize:"8px" }}>{s.name}</span>
            <span className="text-[8px] font-mono text-slate-400 select-none">flip →</span>
          </div>
          <div className="font-orbitron text-3xl font-black mt-1 leading-none" style={{ color:s.color }}>{s.value}</div>
          <div className="text-[9px] font-mono text-slate-500 mt-1">{s.unit}</div>
          <div className="text-[9px] font-mono text-slate-600 mt-2 flex-1 leading-snug">{s.instrument}</div>
          <div className="mt-auto">
            <div className="flex justify-between text-[8px] font-mono mb-1">
              <span className="text-slate-500">CONFIDENCE</span>
              <span className="font-semibold" style={{ color:s.color }}>{s.confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full transition-all" style={{ width:`${s.confidence}%`, background:s.color }}/>
            </div>
          </div>
        </div>
      }
      back={
        <div className="w-full h-full p-4 flex flex-col overflow-hidden" style={{ background:`${s.color}06`, border:`1px solid ${s.color}20`, borderRadius:"1rem" }}>
          <div className="text-[8px] font-orbitron font-bold tracking-widest mb-2" style={{ color:s.color }}>PROOF OF CONCEPT</div>
          <div className="text-[9px] font-mono text-slate-600 leading-relaxed flex-1 overflow-hidden">{s.proof.method}</div>
          <div className="mt-2 pt-2 border-t" style={{ borderColor:`${s.color}15` }}>
            <div className="text-[8px] font-mono text-slate-500">
              <span className="font-semibold text-slate-600">Threshold: </span>{s.proof.threshold.slice(0,70)}
            </div>
          </div>
        </div>
      }
    />
  );
}

export default function Dashboard({ crater }: DashboardProps) {
  const primarySite = landingSites.find((s) => s.status === "primary")!;
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const agents = [
    {
      id:"ice", icon:<Satellite size={14} className="text-sky-500"/>,
      title:"ICE DETECTION AGENT", subtitle:"CPR/DOP Multi-Band Analysis",
      badge:"93% CONF.", badgeStyle:"pill-sky", color:"#0ea5e9",
      front:(
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl" style={{ background:"#f0f9ff" }}>
              <div className="text-[8px] font-mono text-slate-400">CPR (L+S BAND)</div>
              <div className="font-orbitron text-xl font-black text-sky-600">2.14</div>
              <div className="text-[8px] font-mono text-slate-400">Threshold &gt;1.8 ✓</div>
            </div>
            <div className="p-2 rounded-xl" style={{ background:"#f0f9ff" }}>
              <div className="text-[8px] font-mono text-slate-400">DOP VALUE</div>
              <div className="font-orbitron text-xl font-black text-sky-600">0.07</div>
              <div className="text-[8px] font-mono text-slate-400">Threshold &lt;0.3 ✓</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[9px] font-mono mb-1"><span className="text-slate-400">CONFIDENCE</span><span className="text-sky-600 font-bold">93%</span></div>
            <div className="h-2 rounded-full bg-sky-50"><div className="h-2 rounded-full" style={{ width:"93%", background:"linear-gradient(90deg,#0ea5e9,#10b981)" }}/></div>
          </div>
        </div>
      ),
      back:(
        <div className="space-y-2 text-[9px] font-mono">
          <div className="font-orbitron text-[10px] font-bold text-sky-600">HOW ICE WAS DETECTED</div>
          <div className="text-slate-600 leading-relaxed">DFSAR L+S dual-band radar measured circular polarization ratio (CPR = 2.14), exceeding the 1.8 ice threshold from MINI-RF data (Spudis et al. 2013). Double-bounce scattering is the physical signature of subsurface water ice.</div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {["Silicate regolith → CPR 0.5 ✗","Rough terrain → CPR 1.2 ✗","Surface frost → CPR 1.7 ✗","Buried ice → CPR 2.1+ ✓"].map(a=>(
              <div key={a} className="p-1 rounded text-[8px]" style={{ background:a.includes("✓")?"#d1fae5":"#fff1f2", color:a.includes("✓")?"#065f46":"#881337" }}>{a}</div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id:"landing", icon:<Target size={14} className="text-emerald-500"/>,
      title:"LANDING SITE AGENT", subtitle:"Multi-Criteria Safety Scoring",
      badge:"LS-01 PRIMARY", badgeStyle:"pill-green", color:"#10b981",
      front:(
        <div className="space-y-2">
          <div className="text-[9px] font-mono text-slate-700 font-semibold">{primarySite.name}</div>
          <div className="text-[8px] font-mono text-emerald-600">{primarySite.lat}°S, {primarySite.lon}°E · {primarySite.elevation}m</div>
          {[{l:"Safety Score",v:`${primarySite.safetyScore}%`,c:"#10b981"},{l:"Ice Confidence",v:`${primarySite.iceConfidence}%`,c:"#0ea5e9"},{l:"Slope",v:`${primarySite.slope}°`,c:"#f59e0b"}].map(r=>(
            <div key={r.l} className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-slate-400 w-24">{r.l}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full" style={{ width:r.l==="Slope"?`${r.v.replace("°","")+"0"}%`:r.v, background:r.c }}/></div>
              <span className="text-[8px] font-mono font-bold w-8 text-right" style={{ color:r.c }}>{r.v}</span>
            </div>
          ))}
        </div>
      ),
      back:(
        <div className="space-y-2 text-[9px] font-mono">
          <div className="font-orbitron text-[10px] font-bold text-emerald-600">SCORING METHODOLOGY</div>
          <div className="text-slate-600 leading-relaxed">Weighted multi-criteria: Safety 40% · Ice confidence 35% · Illumination 15% · Comms 10%. LOLA DEM slope analysis at 5m/px. Shackleton selected over 3 alternates.</div>
          <div className="text-slate-500">{primarySite.proof.method}</div>
        </div>
      ),
    },
    {
      id:"rover", icon:<Navigation size={14} className="text-violet-500"/>,
      title:"ROVER PATH AGENT", subtitle:"A* + Solar Constraint Planning",
      badge:"5.8 km", badgeStyle:"pill-violet", color:"#8b5cf6",
      front:(
        <div className="space-y-2">
          {[{l:"TOTAL DISTANCE",v:"5.8 km",c:"#8b5cf6"},{l:"SOLAR HOURS",v:"15.6 h",c:"#f59e0b"},{l:"WAYPOINTS",v:"6",c:"#0ea5e9"}].map(m=>(
            <div key={m.l} className="flex items-center justify-between p-1.5 rounded-lg" style={{ background:`${m.c}08` }}>
              <span className="text-[8px] font-mono text-slate-400">{m.l}</span>
              <span className="font-orbitron text-sm font-black" style={{ color:m.c }}>{m.v}</span>
            </div>
          ))}
          <div className="flex gap-1 pt-1">
            {["START","WP-1","WP-2","WP-3","WP-4","END"].map((w,i)=>(
              <div key={w} className="flex-1 flex items-center">
                <div className="w-3 h-3 rounded-full border flex-shrink-0" style={{ borderColor:["#10b981","#0ea5e9","#0ea5e9","#f59e0b","#0ea5e9","#ef4444"][i], background:`${["#10b981","#0ea5e9","#0ea5e9","#f59e0b","#0ea5e9","#ef4444"][i]}20` }}/>
                {i<5&&<div className="flex-1 h-px bg-slate-200"/>}
              </div>
            ))}
          </div>
        </div>
      ),
      back:(
        <div className="space-y-2 text-[9px] font-mono">
          <div className="font-orbitron text-[10px] font-bold text-violet-600">PATH PLANNING METHOD</div>
          <div className="text-slate-600 leading-relaxed">A* algorithm on LOLA DEM + LROC NAC 0.5m imagery. Solar illumination constraint: rover stays within 18.3% sunlit corridor. Energy budget: 450 Wh/km. Science stops at two ice-rich DFSAR anomaly sites.</div>
        </div>
      ),
    },
    {
      id:"risk", icon:<AlertTriangle size={14} className="text-amber-500"/>,
      title:"RISK ASSESSMENT AGENT", subtitle:"Monte Carlo 10,000 Simulation",
      badge:"MISSION GO", badgeStyle:"pill-green", color:"#f59e0b",
      front:(
        <div className="space-y-1.5">
          {riskFactors.slice(0,4).map(r=>{
            const c=r.severity==="low"?"#10b981":r.severity==="medium"?"#f59e0b":"#ef4444";
            return (
              <div key={r.name} className="flex items-center gap-2">
                <span className="text-[8px] font-mono text-slate-500 w-24 truncate">{r.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full" style={{ width:`${r.score}%`, background:c }}/></div>
                <span className="text-[8px] font-mono font-bold w-6 text-right" style={{ color:c }}>{r.score}</span>
              </div>
            );
          })}
          <div className="flex gap-2 pt-1">
            <span className="pill pill-green text-[7px]">3 LOW</span>
            <span className="pill pill-amber text-[7px]">3 MEDIUM</span>
          </div>
        </div>
      ),
      back:(
        <div className="space-y-2 text-[9px] font-mono">
          <div className="font-orbitron text-[10px] font-bold text-amber-600">RISK METHODOLOGY</div>
          <div className="text-slate-600 leading-relaxed">Monte Carlo simulation (10,000 runs) on 6 risk categories. Beta distributions for hardware reliability from historical ISRO data. Fault tree analysis covers comms, thermal, and GNC subsystems. Overall mission risk: 23%.</div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-5" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>

      {/* Mission metrics */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label:"CRATER",       value:crater.name,                  color:"#10b981", bg:"#f0fdf4" },
          { label:"ICE VOL",      value:"2.4×10⁸ m³",                color:"#0ea5e9", bg:"#f0f9ff" },
          { label:"ICE CONF.",    value:`${crater.iceConfidence}%`,   color:"#0ea5e9", bg:"#f0f9ff" },
          { label:"LAUNCH",       value:missionMetrics.launchWindow,  color:"#f59e0b", bg:"#fffbeb" },
          { label:"MISSION GO",   value:"CLEARED",                    color:"#10b981", bg:"#f0fdf4" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl p-3 text-center transition-all hover:scale-[1.02]"
            style={{ background:"white", border:`1px solid ${m.color}15`, boxShadow:`0 2px 12px ${m.color}08` }}>
            <div className="text-[8px] font-mono text-slate-400 tracking-widest mb-1">{m.label}</div>
            <div className="font-orbitron text-sm font-black leading-tight" style={{ color:m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Sensor cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} className="text-sky-500"/>
          <span className="font-orbitron text-[11px] font-bold text-slate-700 tracking-widest">SENSOR ARRAY · 7 INSTRUMENTS</span>
          <span className="text-[8px] font-mono text-slate-400 ml-auto">flip each card for proof of concept</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {sensorReadings.slice(0, 4).map((s) => <SensorFlipCard key={s.id} s={s}/>)}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {sensorReadings.slice(4).map((s) => <SensorFlipCard key={s.id} s={s}/>)}
        </div>
      </div>

      {/* Agent panels */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-orbitron text-[11px] font-bold text-slate-700 tracking-widest">AI AGENT PANELS</span>
          <span className="text-[8px] font-mono text-slate-400 ml-auto">click to expand · flip for methodology</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {agents.map((ag) => (
            <FlipCard key={ag.id} height="220px"
              front={
                <div className="w-full h-full p-4 flex flex-col cursor-pointer"
                  style={{ background:"white", border:`1px solid ${ag.color}12`, borderRadius:"1rem", boxShadow:`0 1px 6px rgba(0,0,0,.05)` }}
                  onClick={() => setExpandedAgent(expandedAgent === ag.id ? null : ag.id)}>
                  <div className="flex items-center gap-2 mb-3">
                    {ag.icon}
                    <div className="flex-1 min-w-0">
                      <div className="font-orbitron text-[10px] font-bold text-slate-800 leading-tight">{ag.title}</div>
                      <div className="text-[8px] font-mono text-slate-500 mt-0.5">{ag.subtitle}</div>
                    </div>
                    <span className={`pill ${ag.badgeStyle} text-[7px] flex-shrink-0`}>{ag.badge}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">{ag.front}</div>
                </div>
              }
              back={
                <div className="w-full h-full p-4 flex flex-col" style={{ background:`${ag.color}06`, border:`1px solid ${ag.color}20`, borderRadius:"1rem" }}>
                  {ag.back}
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
