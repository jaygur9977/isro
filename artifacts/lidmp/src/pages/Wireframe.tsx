import { useState } from "react";
import { Layout, Monitor, Smartphone, ChevronLeft, ChevronRight, Layers, ZoomIn } from "lucide-react";

const screens = [
  {
    id: "loading",
    label: "01 · Boot Sequence",
    desc: "Animated sensor initialization with sequential progress bars and crater selection grid",
    color: "#0ea5e9",
    notes: ["7-sensor parallel scan animation", "Crater grid with ice confidence scoring", "Launch button unlocks after selection", "Phase transitions: scan → select → launch"],
    preview: (
      <div className="w-full h-full bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 gap-3">
        <div className="font-orbitron text-2xl font-black text-transparent bg-clip-text" style={{ backgroundImage:"linear-gradient(135deg,#10b981,#0ea5e9)" }}>LIDMP</div>
        <div className="text-[8px] font-mono text-slate-400 tracking-widest">LUNAR ICE DISCOVERY & MISSION PLANNING</div>
        <div className="w-full max-w-xs rounded-xl p-3 space-y-2" style={{ background:"#f8fafc", border:"1px solid rgba(0,0,0,.06)" }}>
          <div className="text-[7px] font-mono text-slate-500 font-bold tracking-widest mb-2">INITIALIZING SENSOR ARRAY</div>
          {[["DFSAR CPR","#0ea5e9",100],["DFSAR DOP","#0ea5e9",100],["OHRC Camera","#8b5cf6",100],["LOLA Altimeter","#10b981",72],["Diviner Thermal","#f59e0b",0]].map(([name,color,pct])=>(
            <div key={name as string} className="space-y-0.5">
              <div className="flex justify-between text-[7px] font-mono"><span className="text-slate-600">{name as string}</span><span style={{ color:color as string }}>{pct as number}%</span></div>
              <div className="h-1 rounded-full bg-slate-100"><div className="h-1 rounded-full" style={{ width:`${pct}%`, background:color as string }}/></div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "dashboard",
    label: "02 · Mission Dashboard",
    desc: "Central mission control: metrics strip, flip sensor cards, AI agent panels with methodology backs",
    color: "#10b981",
    notes: ["5-column metric strip at top", "4+3 flip card grid for sensors", "2×2 agent panel grid (flip for methodology)", "Sidebar collapsible to icons-only"],
    preview: (
      <div className="w-full h-full bg-white rounded-xl overflow-hidden flex" style={{ fontSize:"0" }}>
        {/* Sidebar */}
        <div className="w-9 h-full flex flex-col gap-0.5 p-1" style={{ background:"#f8fafc", borderRight:"1px solid rgba(0,0,0,.06)" }}>
          {["#10b981","#0ea5e9","#8b5cf6","#f59e0b","#10b981","#6366f1"].map((c,i)=>(
            <div key={i} className="w-6 h-6 rounded-lg mx-auto" style={{ background:`${c}12`, border:`1px solid ${c}25`, marginBottom:"2px" }}/>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 p-2 space-y-1.5">
          {/* Metrics */}
          <div className="grid grid-cols-5 gap-1">
            {["#10b981","#0ea5e9","#0ea5e9","#f59e0b","#10b981"].map((c,i)=>(
              <div key={i} className="rounded-lg p-1.5" style={{ background:`${c}08`, border:`1px solid ${c}15` }}>
                <div className="w-full h-1 rounded bg-slate-100 mb-1"/>
                <div className="text-[7px] font-orbitron font-black" style={{ color:c }}>—</div>
              </div>
            ))}
          </div>
          {/* Sensor grid */}
          <div className="grid grid-cols-4 gap-1">
            {["#0ea5e9","#0ea5e9","#8b5cf6","#10b981"].map((c,i)=>(
              <div key={i} className="rounded-lg p-2 aspect-[4/3] flex flex-col" style={{ background:"white", border:`1px solid ${c}15` }}>
                <div className="w-8 h-1 rounded bg-slate-100 mb-1"/>
                <div className="font-orbitron text-[9px] font-black" style={{ color:c }}>2.14</div>
                <div className="w-full flex-1 rounded bg-slate-50 mt-1 flex items-end"><div className="h-0.5 rounded w-4/5" style={{ background:c }}/></div>
              </div>
            ))}
          </div>
          {/* Agent grid */}
          <div className="grid grid-cols-2 gap-1">
            {[["#0ea5e9","ICE DETECTION"],["#10b981","LANDING SITE"],["#8b5cf6","ROVER PATH"],["#f59e0b","RISK ASSESS."]].map(([c,label])=>(
              <div key={label} className="rounded-lg p-2" style={{ background:"white", border:`1px solid ${c as string}12` }}>
                <div className="text-[7px] font-orbitron font-bold mb-1" style={{ color:c as string }}>{label}</div>
                <div className="space-y-0.5">
                  {[80,65,90].map((w,i)=><div key={i} className="h-0.5 rounded" style={{ width:`${w}%`, background:`${c}30` }}/>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ice",
    label: "03 · Ice Detection",
    desc: "Dual-band CPR/DOP analysis with depth profile, confidence chart, and geological evidence cards",
    color: "#0ea5e9",
    notes: ["CPR/DOP dual metric cards", "Depth profile bar visualization", "Evidence confidence radial chart", "Instrument readings with thresholds"],
    preview: (
      <div className="w-full h-full bg-white rounded-xl overflow-hidden p-3 space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg p-2" style={{ background:"#f0f9ff", border:"1px solid #bae6fd" }}>
            <div className="text-[7px] font-mono text-sky-600 font-bold">CPR VALUE</div>
            <div className="font-orbitron text-lg font-black text-sky-600">2.14</div>
            <div className="h-0.5 rounded bg-sky-100 mt-1"><div className="h-0.5 rounded bg-sky-400" style={{ width:"82%" }}/></div>
          </div>
          <div className="flex-1 rounded-lg p-2" style={{ background:"#f5f3ff", border:"1px solid #ddd6fe" }}>
            <div className="text-[7px] font-mono text-violet-600 font-bold">DOP VALUE</div>
            <div className="font-orbitron text-lg font-black text-violet-600">0.07</div>
            <div className="h-0.5 rounded bg-violet-100 mt-1"><div className="h-0.5 rounded bg-violet-400" style={{ width:"14%" }}/></div>
          </div>
        </div>
        <div className="rounded-lg p-2" style={{ background:"#f8fafc", border:"1px solid rgba(0,0,0,.06)" }}>
          <div className="text-[7px] font-mono text-slate-500 font-bold mb-1.5">DEPTH PROFILE</div>
          <div className="flex items-end gap-0.5 h-12">
            {[25,45,80,95,88,60,40,30].map((h,i)=>(
              <div key={i} className="flex-1 rounded-t" style={{ height:`${h}%`, background:`rgba(14,165,233,${0.2+h/150})` }}/>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[["93%","#10b981","ICE CONF"],["1–3m","#0ea5e9","DEPTH"],["47km²","#8b5cf6","AREA"]].map(([v,c,l])=>(
            <div key={l} className="rounded-lg p-1.5 text-center" style={{ background:`${c}08`, border:`1px solid ${c}15` }}>
              <div className="font-orbitron text-xs font-black" style={{ color:c as string }}>{v}</div>
              <div className="text-[6px] font-mono text-slate-400">{l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "risk",
    label: "04 · Risk Assessment",
    desc: "Six-factor Monte Carlo risk flip cards with model, formula, and process detail on the back",
    color: "#f59e0b",
    notes: ["Overall mission safety donut chart", "6 risk factor flip cards (2×3 grid)", "Front: progress bar + severity badge", "Back: model + formula + data sources"],
    preview: (
      <div className="w-full h-full bg-white rounded-xl overflow-hidden p-3 space-y-2">
        {/* Overall */}
        <div className="flex gap-3 items-center p-2 rounded-lg" style={{ background:"#f0fdf4", border:"1px solid #a7f3d0" }}>
          <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background:"conic-gradient(#10b981 0% 77%, #f0fdf4 77% 100%)", position:"relative" }}>
            <div className="absolute inset-1.5 rounded-full bg-white flex items-center justify-center">
              <span className="font-orbitron text-[8px] font-black text-emerald-600">77</span>
            </div>
          </div>
          <div>
            <div className="font-orbitron text-xs font-black text-emerald-700">MISSION GO</div>
            <div className="text-[7px] font-mono text-slate-500">Monte Carlo · 10,000 runs · MIL-STD-882E</div>
          </div>
        </div>
        {/* Risk grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {[["Terrain Safety","#10b981",13,"low"],["Solar Power","#f59e0b",24,"medium"],["Thermal","#10b981",9,"low"],["Communication","#f59e0b",18,"medium"],["Dust Accum.","#f59e0b",32,"medium"],["Cosmic Rad.","#10b981",27,"low"]].map(([name,c,score])=>(
            <div key={name as string} className="rounded-lg p-2" style={{ background:"white", border:`1px solid ${c as string}20` }}>
              <div className="flex justify-between mb-1">
                <span className="text-[7px] font-orbitron font-bold" style={{ color:c as string }}>{name as string}</span>
                <span className="text-[7px] font-mono font-black" style={{ color:c as string }}>{score as number}%</span>
              </div>
              <div className="h-1 rounded-full bg-slate-100"><div className="h-1 rounded-full" style={{ width:`${score}%`, background:c as string }}/></div>
              <div className="text-[6px] font-mono text-slate-400 mt-0.5">← flip for model</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "ai",
    label: "05 · AI Optimizer",
    desc: "Groq LLaMA 3.3 70B mission planning assistant with preset queries and markdown-formatted responses",
    color: "#8b5cf6",
    notes: ["Groq API with LLaMA 3.3 70B model", "Preset question chips for quick access", "Chat bubbles with user/AI distinction", "Animated typing indicator"],
    preview: (
      <div className="w-full h-full bg-white rounded-xl overflow-hidden p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
            <span className="text-[9px]">🤖</span>
          </div>
          <div>
            <div className="font-orbitron text-[9px] font-black text-slate-800">AI LAUNCH OPTIMIZER</div>
            <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500"/><span className="text-[7px] font-mono text-emerald-600">ONLINE · Llama 3.3 70B</span></div>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {["Launch window?","Ice analysis","Rover path"].map(p=>(
            <span key={p} className="px-1.5 py-0.5 rounded-full text-[7px] font-mono" style={{ background:"#f5f3ff", color:"#5b21b6", border:"1px solid #ddd6fe" }}>{p}</span>
          ))}
        </div>
        <div className="flex-1 rounded-lg p-2 space-y-1.5 overflow-hidden" style={{ background:"#f8fafc", border:"1px solid rgba(0,0,0,.06)" }}>
          <div className="flex gap-1.5">
            <div className="w-5 h-5 rounded-lg flex-shrink-0" style={{ background:"linear-gradient(135deg,#ede9fe,#fce7f3)" }}><div className="text-[7px] text-center pt-0.5 font-bold text-violet-600">AI</div></div>
            <div className="rounded-lg p-1.5 text-[7px] font-mono text-slate-600 leading-relaxed" style={{ background:"#faf5ff", border:"1px solid rgba(139,92,246,.15)", maxWidth:"80%" }}>LIDMP-AI online. Ready for mission planning…</div>
          </div>
          <div className="flex gap-1.5 flex-row-reverse">
            <div className="w-5 h-5 rounded-lg flex-shrink-0" style={{ background:"linear-gradient(135deg,#dbeafe,#d1fae5)" }}><div className="text-[7px] text-center pt-0.5 font-bold text-blue-600">U</div></div>
            <div className="rounded-lg p-1.5 text-[7px] font-mono text-slate-600 leading-relaxed" style={{ background:"#f0f9ff", border:"1px solid rgba(14,165,233,.15)", maxWidth:"80%" }}>Optimal launch window 2026?</div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="flex-1 rounded-lg px-2 py-1 text-[7px] font-mono text-slate-400" style={{ background:"#f8fafc", border:"1px solid rgba(0,0,0,.08)" }}>Ask about launch windows…</div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#8b5cf6,#0ea5e9)" }}>→</div>
        </div>
      </div>
    ),
  },
];

export default function Wireframe() {
  const [active, setActive] = useState(0);
  const screen = screens[active];

  return (
    <div className="h-full overflow-y-auto" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      <div className="p-5 space-y-5 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-orbitron text-lg font-black text-slate-800">UI WIREFRAMES</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">LIDMP · Screen Blueprints · {screens.length} Key Interfaces</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setActive(p=>Math.max(0,p-1))} disabled={active===0}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ background:"white", border:"1px solid rgba(0,0,0,.08)", color: active===0?"#cbd5e1":"#475569", cursor:active===0?"not-allowed":"pointer" }}>
              <ChevronLeft size={14}/>
            </button>
            <span className="font-orbitron text-[10px] font-bold text-slate-600">{active+1} / {screens.length}</span>
            <button onClick={()=>setActive(p=>Math.min(screens.length-1,p+1))} disabled={active===screens.length-1}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ background:"white", border:"1px solid rgba(0,0,0,.08)", color:active===screens.length-1?"#cbd5e1":"#475569", cursor:active===screens.length-1?"not-allowed":"pointer" }}>
              <ChevronRight size={14}/>
            </button>
          </div>
        </div>

        {/* Screen thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {screens.map((s,i)=>(
            <button key={s.id} onClick={()=>setActive(i)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[8px] font-mono font-semibold transition-all"
              style={{
                background: active===i ? s.color : "white",
                color: active===i ? "white" : "#64748b",
                border: `1px solid ${active===i ? s.color : "rgba(0,0,0,.07)"}`,
                boxShadow: active===i ? `0 2px 8px ${s.color}30` : "none",
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Main view */}
        <div className="grid grid-cols-5 gap-4">
          {/* Preview */}
          <div className="col-span-3">
            <div className="rounded-2xl overflow-hidden" style={{ background:"#f1f5f9", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 4px 24px rgba(0,0,0,.07)" }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-200" style={{ background:"white" }}>
                <div className="w-2 h-2 rounded-full bg-rose-400"/>
                <div className="w-2 h-2 rounded-full bg-amber-400"/>
                <div className="w-2 h-2 rounded-full bg-emerald-400"/>
                <div className="flex-1 mx-3 py-0.5 px-2 rounded text-[7px] font-mono text-slate-400" style={{ background:"#f8fafc", border:"1px solid rgba(0,0,0,.06)" }}>
                  lidmp.replit.app/{screen.id === "dashboard" ? "" : screen.id}
                </div>
                <Monitor size={11} className="text-slate-400"/>
              </div>
              {/* Screen content */}
              <div className="p-3" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff)" }}>
                <div style={{ height:"340px" }}>
                  {screen.preview}
                </div>
              </div>
            </div>

            {/* Device toggles */}
            <div className="flex gap-2 mt-3 justify-center">
              {[{ icon:<Monitor size={12}/>, label:"Desktop" }, { icon:<Smartphone size={12}/>, label:"Tablet" }, { icon:<Layout size={12}/>, label:"Mobile" }].map((d,i)=>(
                <button key={d.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-mono transition-all"
                  style={{ background: i===0?"white":"transparent", border:`1px solid ${i===0?"rgba(0,0,0,.1)":"transparent"}`, color:i===0?"#334155":"#94a3b8" }}>
                  {d.icon}{d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Annotations */}
          <div className="col-span-2 space-y-4">
            {/* Title */}
            <div className="rounded-2xl p-4" style={{ background:"white", border:`1px solid ${screen.color}18`, boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:`${screen.color}12` }}>
                  <ZoomIn size={14} style={{ color:screen.color }}/>
                </div>
                <div>
                  <div className="font-orbitron text-[10px] font-black text-slate-800">{screen.label}</div>
                  <div className="text-[8px] font-mono text-slate-500 mt-0.5">{screen.desc}</div>
                </div>
              </div>
            </div>

            {/* Design notes */}
            <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div className="flex items-center gap-1.5 mb-3">
                <Layers size={12} style={{ color:screen.color }}/>
                <span className="font-orbitron text-[9px] font-black text-slate-700">DESIGN NOTES</span>
              </div>
              <div className="space-y-2">
                {screen.notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background:`${screen.color}12`, color:screen.color }}>
                      <span className="font-orbitron text-[7px] font-black">{i+1}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-600 leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Component map */}
            <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 2px 12px rgba(0,0,0,.04)" }}>
              <div className="font-orbitron text-[9px] font-black text-slate-700 mb-3">SCREEN MAP</div>
              <div className="flex flex-col gap-1.5">
                {screens.map((s,i)=>(
                  <button key={s.id} onClick={()=>setActive(i)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left transition-all"
                    style={{ background: active===i ? `${s.color}08` : "#f8fafc", border:`1px solid ${active===i ? s.color+"25" : "rgba(0,0,0,.04)"}` }}>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color, opacity: active===i ? 1 : 0.35 }}/>
                    <span className="text-[8px] font-mono" style={{ color: active===i ? s.color : "#64748b", fontWeight: active===i ? "600" : "400" }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
