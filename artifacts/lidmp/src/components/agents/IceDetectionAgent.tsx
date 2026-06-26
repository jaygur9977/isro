import { useState, useEffect } from "react";
import { Snowflake, Activity, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { sensorReadings } from "../../data/sensorData";

export default function IceDetectionAgent() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  const dfsar = sensorReadings.find((s) => s.id === "dfsar")!;
  const dop = sensorReadings.find((s) => s.id === "dfsar-dop")!;

  const runAnalysis = () => {
    setRunning(true);
    setProgress(0);
    setResult(null);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setRunning(false);
          setResult("ICE CONFIRMED — Subsurface deposits at 1–3m depth over 47km². Volume estimate: 2.4×10⁸ m³");
          return 100;
        }
        return p + 2;
      });
    }, 60);
  };

  useEffect(() => {
    const t = setTimeout(runAnalysis, 800);
    return () => clearTimeout(t);
  }, []);

  const stages = [
    { label: "CPR Analysis", done: progress >= 25 },
    { label: "DOP Classification", done: progress >= 50 },
    { label: "PSR Correlation", done: progress >= 75 },
    { label: "Volume Estimation", done: progress >= 100 },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }} data-testid="agent-ice-detection">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        style={{ borderBottom: expanded ? "1px solid rgba(0,0,0,.05)" : "none" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:"#e0f2fe", border:"1px solid #bae6fd" }}>
            <Snowflake size={15} className="text-sky-500" />
          </div>
          <div>
            <div className="font-orbitron text-[10px] font-bold text-slate-800">ICE DETECTION AGENT</div>
            <div className="text-[8px] font-mono text-slate-500">CPR/DOP Multi-Band Analysis</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill text-[7px]" style={{
            background: result ? "#d1fae5" : running ? "#e0f2fe" : "#f1f5f9",
            color: result ? "#065f46" : running ? "#0369a1" : "#64748b",
            border: `1px solid ${result ? "#a7f3d0" : running ? "#bae6fd" : "#e2e8f0"}`,
          }}>
            {result ? "COMPLETE" : running ? "RUNNING" : "STANDBY"}
          </span>
          {expanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 pt-3">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-[8px] font-mono text-slate-500 mb-1">
              <span>ANALYSIS PROGRESS</span>
              <span className="text-sky-600 font-semibold">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #0ea5e9, #8b5cf6)" }}
              />
            </div>
          </div>

          {/* Stages */}
          <div className="grid grid-cols-2 gap-1.5">
            {stages.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-[8px] font-mono">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.done ? "bg-emerald-500" : "bg-slate-200"}`} />
                <span className={s.done ? "text-slate-700" : "text-slate-400"}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Key readings */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg" style={{ background:"#f0f9ff", border:"1px solid #bae6fd" }}>
              <div className="text-[7px] font-mono text-sky-600 font-bold mb-0.5">CPR (L+S BAND)</div>
              <div className="font-orbitron text-sm font-black text-sky-700">{dfsar.value}</div>
              <div className="text-[7px] font-mono text-slate-500">Threshold: &gt;1.8 ✓</div>
            </div>
            <div className="p-2 rounded-lg" style={{ background:"#f5f3ff", border:"1px solid #ddd6fe" }}>
              <div className="text-[7px] font-mono text-violet-600 font-bold mb-0.5">DOP VALUE</div>
              <div className="font-orbitron text-sm font-black text-violet-700">{dop.value}</div>
              <div className="text-[7px] font-mono text-slate-500">Threshold: &lt;0.3 ✓</div>
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-slate-500">CONFIDENCE</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: "93%" }} />
            </div>
            <span className="font-orbitron text-xs font-black text-emerald-600">93%</span>
          </div>

          {/* Result */}
          {result && (
            <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background:"#f0fdf4", border:"1px solid #a7f3d0" }}>
              <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-[8px] font-mono text-emerald-700">{result}</span>
            </div>
          )}

          <button
            onClick={runAnalysis}
            disabled={running}
            data-testid="btn-run-ice-analysis"
            className="w-full py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all"
            style={{
              background: running ? "#f0f9ff" : "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
              border: running ? "1px solid #bae6fd" : "none",
              color: running ? "#0369a1" : "white",
              opacity: running ? 0.7 : 1,
            }}
          >
            {running ? (
              <span className="flex items-center justify-center gap-2">
                <Activity size={10} className="animate-spin" />
                ANALYZING...
              </span>
            ) : (
              "RE-RUN ANALYSIS"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
