import { useState, useEffect, useRef } from "react";
import { Server, Database, Cpu, Satellite, Globe, Zap, ArrowRight, Shield, Activity, BarChart3, Bot } from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  layer: "sensor" | "processing" | "ai" | "output";
}

const nodes: Node[] = [
  // Sensor layer
  { id:"dfsar",   x:60,  y:80,  label:"DFSAR",         sublabel:"SAR Radar",        icon:<Satellite size={14}/>, color:"#0ea5e9", bg:"#f0f9ff", border:"#bae6fd", layer:"sensor" },
  { id:"ohrc",    x:60,  y:185, label:"OHRC Camera",   sublabel:"0.25m/px",         icon:<Globe size={14}/>,    color:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe", layer:"sensor" },
  { id:"lola",    x:60,  y:290, label:"LOLA DEM",      sublabel:"Altimeter",        icon:<Activity size={14}/>, color:"#10b981", bg:"#f0fdf4", border:"#a7f3d0", layer:"sensor" },
  { id:"diviner", x:60,  y:395, label:"Diviner",       sublabel:"Thermal Map",      icon:<Zap size={14}/>,      color:"#f59e0b", bg:"#fffbeb", border:"#fde68a", layer:"sensor" },
  { id:"lroc",    x:60,  y:500, label:"LROC NAC",      sublabel:"0.5m Imagery",     icon:<Globe size={14}/>,    color:"#6366f1", bg:"#f0f0ff", border:"#c7d2fe", layer:"sensor" },

  // Processing layer
  { id:"ice_proc",    x:290, y:80,  label:"Ice Detection",   sublabel:"CPR/DOP Engine",   icon:<Satellite size={14}/>, color:"#0ea5e9", bg:"#f0f9ff", border:"#bae6fd", layer:"processing" },
  { id:"landing_proc",x:290, y:215, label:"Site Scoring",    sublabel:"Multi-Criteria",   icon:<Bot size={14}/>,       color:"#10b981", bg:"#f0fdf4", border:"#a7f3d0", layer:"processing" },
  { id:"rover_proc",  x:290, y:350, label:"Path Planning",   sublabel:"A* + Solar",       icon:<BarChart3 size={14}/>, color:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe", layer:"processing" },
  { id:"risk_proc",   x:290, y:480, label:"Risk Engine",     sublabel:"Monte Carlo",      icon:<Shield size={14}/>,    color:"#f59e0b", bg:"#fffbeb", border:"#fde68a", layer:"processing" },

  // AI layer
  { id:"groq_ai", x:520, y:200, label:"Groq LLaMA 3.3",  sublabel:"70B Optimizer",   icon:<Cpu size={14}/>,     color:"#a855f7", bg:"#faf5ff", border:"#e9d5ff", layer:"ai" },
  { id:"monte",   x:520, y:380, label:"Monte Carlo",      sublabel:"10k Simulations", icon:<Activity size={14}/>,color:"#f43f5e", bg:"#fff1f2", border:"#fda4af", layer:"ai" },

  // Output layer
  { id:"db",       x:740, y:120, label:"Mission DB",      sublabel:"PostgreSQL",       icon:<Database size={14}/>, color:"#10b981", bg:"#f0fdf4", border:"#a7f3d0", layer:"output" },
  { id:"dashboard",x:740, y:280, label:"Dashboard",       sublabel:"React + Vite",     icon:<Globe size={14}/>,    color:"#0ea5e9", bg:"#f0f9ff", border:"#bae6fd", layer:"output" },
  { id:"report",   x:740, y:440, label:"PDF Reports",     sublabel:"Auto-Generated",   icon:<BarChart3 size={14}/>,color:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe", layer:"output" },
];

const edges = [
  { from:"dfsar",   to:"ice_proc",    animated:true },
  { from:"ohrc",    to:"ice_proc",    animated:false },
  { from:"lola",    to:"landing_proc",animated:true },
  { from:"lola",    to:"rover_proc",  animated:false },
  { from:"diviner", to:"risk_proc",   animated:true },
  { from:"lroc",    to:"landing_proc",animated:false },
  { from:"ice_proc",    to:"groq_ai", animated:true },
  { from:"landing_proc",to:"groq_ai", animated:false },
  { from:"rover_proc",  to:"monte",   animated:true },
  { from:"risk_proc",   to:"monte",   animated:false },
  { from:"groq_ai", to:"db",       animated:true },
  { from:"groq_ai", to:"dashboard",animated:true },
  { from:"monte",   to:"dashboard",animated:false },
  { from:"monte",   to:"report",   animated:true },
  { from:"db",      to:"dashboard",animated:false },
];

const NODE_W = 130;
const NODE_H = 58;

const layers = [
  { label:"SENSOR ARRAY",       color:"#0ea5e9", x:60,  pct: 5 },
  { label:"PROCESSING AGENTS",  color:"#10b981", x:290, pct: 31 },
  { label:"AI INTELLIGENCE",    color:"#a855f7", x:520, pct: 57 },
  { label:"OUTPUTS",            color:"#6366f1", x:740, pct: 80 },
];

const stats = [
  { label:"Processing Latency", value:"<120ms",     color:"#10b981" },
  { label:"Monte Carlo Runs",   value:"10,000",     color:"#f59e0b" },
  { label:"AI Model Size",      value:"70B params", color:"#a855f7" },
  { label:"Data Instruments",   value:"5 sensors",  color:"#0ea5e9" },
  { label:"Mission Duration",   value:"180 sols",   color:"#f43f5e" },
  { label:"Ice Confidence",     value:"93%",        color:"#10b981" },
];

const techStack = [
  { label:"Frontend",    stack:"React 18 + Vite 6", color:"#0ea5e9" },
  { label:"Language",    stack:"TypeScript 5.9",    color:"#3178c6" },
  { label:"Styling",     stack:"Tailwind CSS v4",   color:"#06b6d4" },
  { label:"AI API",      stack:"Groq LLaMA 3.3 70B",color:"#a855f7" },
  { label:"3D Engine",   stack:"Three.js + R3F",    color:"#f59e0b" },
  { label:"Data",        stack:"Static JSON + REST", color:"#10b981" },
  { label:"Query",       stack:"TanStack Query v5",  color:"#ef4444" },
  { label:"Animation",   stack:"CSS + Framer",       color:"#6366f1" },
];

function getCenter(n: Node) {
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
}

export default function Architecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 30);
    return () => clearInterval(t);
  }, []);

  const offset = (tick * 0.8) % 40;

  return (
    <div className="h-full overflow-y-auto" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      <div className="p-5 space-y-5 max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-orbitron text-lg font-black text-slate-800">SYSTEM ARCHITECTURE</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">LIDMP · Chandrayaan-4 · End-to-End Data Pipeline</div>
          </div>
          <div className="flex gap-2">
            {layers.map(l => (
              <div key={l.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background:"white", border:`1px solid ${l.color}20` }}>
                <div className="w-2 h-2 rounded-full" style={{ background:l.color }} />
                <span className="text-[8px] font-mono font-semibold" style={{ color:l.color }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Diagram */}
        <div ref={canvasRef} className="rounded-2xl overflow-hidden relative" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
          {/* Layer bands */}
          <div className="absolute inset-0 pointer-events-none">
            {layers.map(l => (
              <div key={l.label} className="absolute top-0 bottom-0" style={{ left:`${l.pct}%`, width:"22%", background:`${l.color}03`, borderRight:`1px dashed ${l.color}15` }} />
            ))}
          </div>

          <svg width="100%" viewBox="0 0 920 600" style={{ display:"block" }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,1 L8,5 L0,9 Z" fill="#94a3b8" />
              </marker>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,1 L8,5 L0,9 Z" fill="#0ea5e9" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((e, i) => {
              const fromNode = nodes.find(n => n.id === e.from)!;
              const toNode   = nodes.find(n => n.id === e.to)!;
              if (!fromNode || !toNode) return null;
              const from = getCenter(fromNode);
              const to   = getCenter(toNode);
              const mx   = (from.x + to.x) / 2;
              const d    = `M${from.x + NODE_W/2 - 4},${from.y} C${mx},${from.y} ${mx},${to.y} ${to.x - NODE_W/2 + 4},${to.y}`;
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={e.animated ? "#0ea5e9" : "#cbd5e1"} strokeWidth={e.animated ? 1.5 : 1}
                    strokeDasharray={e.animated ? "6 4" : "none"}
                    strokeDashoffset={e.animated ? -offset : 0}
                    markerEnd={e.animated ? "url(#arrow-blue)" : "url(#arrow)"}
                    opacity={e.animated ? 0.7 : 0.4}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(n => {
              const active = activeNode === n.id;
              return (
                <g key={n.id} onClick={() => setActiveNode(active ? null : n.id)} style={{ cursor:"pointer" }}>
                  <rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={10} ry={10}
                    fill={n.bg} stroke={active ? n.color : n.border}
                    strokeWidth={active ? 2 : 1}
                    style={{ filter: active ? `drop-shadow(0 4px 12px ${n.color}40)` : "none", transition:"all .15s" }}
                  />
                  <foreignObject x={n.x} y={n.y} width={NODE_W} height={NODE_H}>
                    <div className="w-full h-full flex items-center gap-2 px-3">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:`${n.color}15`, color:n.color }}>
                        {n.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-orbitron text-[9px] font-bold truncate" style={{ color:n.color }}>{n.label}</div>
                        <div className="text-[8px] font-mono text-slate-500 truncate">{n.sublabel}</div>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Layer labels */}
            {layers.map(l => (
              <text key={l.label} x={l.x + NODE_W/2} y={572} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill={l.color} opacity={0.8}>
                {l.label}
              </text>
            ))}
          </svg>
        </div>

        {/* Bottom row: stats + tech stack */}
        <div className="grid grid-cols-2 gap-4">
          {/* Stats */}
          <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
            <div className="font-orbitron text-[10px] font-black text-slate-700 tracking-widest mb-3">SYSTEM METRICS</div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map(s => (
                <div key={s.label} className="p-2.5 rounded-xl text-center" style={{ background:`${s.color}06`, border:`1px solid ${s.color}15` }}>
                  <div className="font-orbitron text-sm font-black" style={{ color:s.color }}>{s.value}</div>
                  <div className="text-[8px] font-mono text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
            <div className="font-orbitron text-[10px] font-black text-slate-700 tracking-widest mb-3">TECH STACK</div>
            <div className="grid grid-cols-2 gap-2">
              {techStack.map(t => (
                <div key={t.label} className="flex items-center gap-2 p-2 rounded-lg" style={{ background:"#f8fafc", border:"1px solid rgba(0,0,0,.05)" }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:t.color }} />
                  <div>
                    <div className="text-[7px] font-mono text-slate-400 font-bold">{t.label}</div>
                    <div className="text-[8px] font-mono text-slate-700 font-semibold">{t.stack}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data flow timeline */}
        <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
          <div className="font-orbitron text-[10px] font-black text-slate-700 tracking-widest mb-4">DATA PIPELINE · END-TO-END FLOW</div>
          <div className="flex items-center gap-0">
            {[
              { label:"Raw Sensor", sub:"DFSAR/LOLA/OHRC", color:"#0ea5e9", icon:<Satellite size={12}/> },
              { label:"Preprocessing", sub:"Calibration + Noise", color:"#6366f1", icon:<Activity size={12}/> },
              { label:"AI Inference", sub:"LLaMA 3.3 70B", color:"#a855f7", icon:<Cpu size={12}/> },
              { label:"Simulation", sub:"Monte Carlo 10k", color:"#f59e0b", icon:<Zap size={12}/> },
              { label:"Decision", sub:"GO / ABORT / HOLD", color:"#10b981", icon:<Shield size={12}/> },
              { label:"Report", sub:"PDF + Dashboard", color:"#8b5cf6", icon:<BarChart3 size={12}/> },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex-1 p-3 rounded-xl text-center" style={{ background:`${step.color}06`, border:`1px solid ${step.color}18` }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ background:`${step.color}15`, color:step.color }}>
                    {step.icon}
                  </div>
                  <div className="font-orbitron text-[8px] font-black" style={{ color:step.color }}>{step.label}</div>
                  <div className="text-[7px] font-mono text-slate-500 mt-0.5">{step.sub}</div>
                </div>
                {i < arr.length - 1 && <ArrowRight size={14} className="text-slate-300 flex-shrink-0 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
