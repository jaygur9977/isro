import { useEffect, useState } from "react";
import { lunarCraters, type LunarCrater } from "../data/sensorData";
import { CheckCircle, Satellite, ChevronRight } from "lucide-react";

const SENSORS = [
  { id: "dfsar",     name: "DFSAR CPR",       value: "2.14",   unit: "L+S Band",    color: "#0ea5e9", delay: 0 },
  { id: "dfsar-dop", name: "DFSAR DOP",        value: "0.07",   unit: "Polarization",color: "#0ea5e9", delay: 400 },
  { id: "ohrc",      name: "OHRC Camera",      value: "0.25",   unit: "m/px",        color: "#8b5cf6", delay: 800 },
  { id: "lola",      name: "LOLA Altimeter",   value: "5.0",    unit: "m/px DEM",    color: "#10b981", delay: 1200 },
  { id: "illum",     name: "Illumination Map", value: "18.3%",  unit: "% sunlit",    color: "#f59e0b", delay: 1600 },
  { id: "diviner",   name: "Diviner Thermal",  value: "42.7 K", unit: "PSR temp",    color: "#f43f5e", delay: 2000 },
  { id: "lroc",      name: "LROC NAC",         value: "0.5",    unit: "m proxy",     color: "#6366f1", delay: 2400 },
];

type Phase = "scanning" | "selecting" | "launching";
interface LoadingScreenProps { onReady: (crater: LunarCrater) => void; }

export default function LoadingScreen({ onReady }: LoadingScreenProps) {
  const [phase, setPhase]       = useState<Phase>("scanning");
  const [loaded, setLoaded]     = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    if (phase !== "scanning") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    SENSORS.forEach((s) => {
      const t = setTimeout(() => {
        let p = 0;
        const tick = setInterval(() => {
          p = Math.min(p + Math.random() * 18 + 5, 100);
          setProgress((prev) => ({ ...prev, [s.id]: Math.round(p) }));
          if (p >= 100) { clearInterval(tick); setLoaded((prev) => [...prev, s.id]); }
        }, 60);
      }, s.delay);
      timers.push(t);
    });
    const done = setTimeout(() => setPhase("selecting"), 3800);
    timers.push(done);
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const handleLaunch = () => {
    if (!selected || launching) return;
    setLaunching(true); setPhase("launching");
    setTimeout(() => {
      const crater = lunarCraters.find((c) => c.id === selected)!;
      onReady(crater);
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg,#f0f7f3 0%,#e8f4ff 40%,#fdf0f4 100%)" }}
    >
      {/* Header */}
      <div className="mb-6 text-center flex-shrink-0">
        <div className="font-orbitron text-4xl font-black tracking-wider mb-2" style={{
          background: "linear-gradient(135deg,#10b981,#0ea5e9)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          LIDMP
        </div>
        <div className="text-sm font-mono text-slate-500 tracking-widest">LUNAR ICE DISCOVERY & MISSION PLANNING PLATFORM</div>
        <div className="text-xs font-mono text-slate-400 mt-1">ISRO · BHARATIYA ANTARIKSH HACKATHON 2026</div>
      </div>

      {/* ── PHASE 1: Sensor scanning ── */}
      {(phase === "scanning" || (phase === "selecting" && loaded.length < SENSORS.length)) && (
        <div className="w-full max-w-lg rounded-2xl p-6 flex-shrink-0"
          style={{ background: "white", boxShadow: "0 8px 32px rgba(0,0,0,.10)", border: "1px solid rgba(0,0,0,.07)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Satellite size={16} className="text-emerald-500" />
            <span className="font-orbitron text-xs font-bold text-slate-700 tracking-widest">INITIALIZING SENSOR ARRAY</span>
          </div>
          <div className="space-y-3">
            {SENSORS.map((s) => {
              const done = loaded.includes(s.id);
              const pct  = progress[s.id] ?? 0;
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all" style={{ background: done ? s.color : "#e2e8f0" }} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-mono font-semibold text-slate-700">{s.name}</span>
                      <span className="text-xs font-mono text-slate-400">{done ? `✓ ${s.value} ${s.unit}` : `${pct}%`}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-1.5 rounded-full transition-all duration-100" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                  {done && <CheckCircle size={14} style={{ color: s.color, flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
          {loaded.length === SENSORS.length && (
            <div className="mt-4 text-center fade-up">
              <div className="text-xs font-mono text-emerald-600 font-bold tracking-widest">ALL SENSORS NOMINAL — SCAN COMPLETE</div>
            </div>
          )}
        </div>
      )}

      {/* ── PHASE 2: Crater selection ── */}
      {phase === "selecting" && (
        <div className="w-full max-w-3xl fade-up flex flex-col" style={{ maxHeight: "82vh" }}>
          <div className="text-center mb-4 flex-shrink-0">
            <div className="font-orbitron text-sm font-bold text-slate-700 tracking-widest mb-1">SELECT TARGET CRATER</div>
            <div className="text-xs font-mono text-slate-400">Choose a Permanently Shadowed Region — scroll to see all</div>
          </div>

          {/* ── Scrollable crater grid ── */}
          <div
            className="grid grid-cols-3 gap-3 mb-4 overflow-y-auto"
            style={{ maxHeight: "52vh", paddingRight: "6px" }}
          >
            {lunarCraters.map((c) => (
              <button
                key={c.id}
                className={`crater-card text-left p-4 ${selected === c.id ? "selected" : ""}`}
                style={{ background: "white" }}
                onClick={() => setSelected(c.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-orbitron text-sm font-bold text-slate-800">{c.name}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{c.lat}°S · {c.lon}°E</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-orbitron text-lg font-black" style={{
                      background: c.iceConfidence >= 90
                        ? "linear-gradient(135deg,#10b981,#0ea5e9)"
                        : c.iceConfidence >= 80
                        ? "linear-gradient(135deg,#0ea5e9,#8b5cf6)"
                        : "linear-gradient(135deg,#f59e0b,#f43f5e)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {c.iceConfidence}%
                    </div>
                    <div className="text-[8px] font-mono text-slate-400">ICE CONF.</div>
                  </div>
                </div>
                <div className="space-y-1 mb-2">
                  {[
                    { l: "Diameter", v: `${c.diameterKm} km` },
                    { l: "Depth",    v: `${c.depthM.toLocaleString()} m` },
                    { l: "PSR Area", v: `${c.psrArea}%` },
                    { l: "Min Temp", v: `${c.minTempK} K` },
                  ].map((row) => (
                    <div key={row.l} className="flex justify-between">
                      <span className="text-[9px] font-mono text-slate-400">{row.l}</span>
                      <span className="text-[9px] font-mono font-semibold text-slate-600">{row.v}</span>
                    </div>
                  ))}
                </div>
                <div className={`pill text-[8px] ${c.psrType === "doubly-shadowed" ? "pill-green" : "pill-sky"}`}>
                  {c.psrType === "doubly-shadowed" ? "● Doubly Shadowed" : "● Permanently Shadowed"}
                </div>
                <div className="text-[8px] font-mono text-emerald-600 mt-1.5 leading-tight">{c.highlight}</div>
              </button>
            ))}
          </div>

          {/* Launch button — sticky below grid */}
          <div className="flex justify-center flex-shrink-0">
            <button
              onClick={handleLaunch}
              disabled={!selected}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-orbitron text-sm font-bold transition-all"
              style={{
                background: selected ? "linear-gradient(135deg,#10b981,#0ea5e9)" : "#e2e8f0",
                color: selected ? "white" : "#94a3b8",
                boxShadow: selected ? "0 4px 20px rgba(16,185,129,0.35)" : "none",
                cursor: selected ? "pointer" : "not-allowed",
              }}
            >
              <ChevronRight size={16} />
              {selected
                ? `LAUNCH MISSION — ${lunarCraters.find((c) => c.id === selected)?.name}`
                : "SELECT A CRATER TO CONTINUE"}
            </button>
          </div>
        </div>
      )}

      {/* ── PHASE 3: Launching ── */}
      {phase === "launching" && (
        <div className="text-center fade-up flex-shrink-0">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500"
              style={{ animation: "spin-slow 1s linear infinite" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Satellite size={28} className="text-emerald-500 float-anim" />
            </div>
          </div>
          <div className="font-orbitron text-lg font-bold text-slate-700 tracking-widest">LOADING MISSION DATA</div>
          <div className="text-xs font-mono text-slate-400 mt-2">
            Initializing {lunarCraters.find((c) => c.id === selected)?.name} target profile…
          </div>
        </div>
      )}
    </div>
  );
}
