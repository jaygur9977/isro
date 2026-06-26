import { useState, useEffect } from "react";
import { Signal, Wifi, Battery, Clock, Satellite } from "lucide-react";
import type { LunarCrater } from "../data/sensorData";

interface HeaderProps {
  crater?: LunarCrater | null;
}

export default function Header({ crater }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [missionTime, setMissionTime] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => { setTime(new Date()); setMissionTime((t) => t + 1); }, 1000);
    return () => clearInterval(iv);
  }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `T+${h}:${m}:${ss}`;
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-2.5 border-b"
      style={{
        background: "white",
        borderColor: "rgba(0,0,0,.07)",
        boxShadow: "0 1px 6px rgba(0,0,0,.05)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-soft" />
          <span className="font-orbitron text-xs font-bold text-emerald-700 tracking-widest">MISSION: ACTIVE</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="text-xs font-mono text-slate-500">
          <span className="text-slate-700 font-semibold">CHANDRAYAAN-4</span>
          <span className="mx-1 text-slate-300">·</span>
          {crater ? (
            <span className="text-emerald-600 font-semibold">{crater.name} PSR</span>
          ) : (
            "SOUTH POLE SURVEY"
          )}
        </div>
      </div>

      {/* Center */}
      <div className="text-center">
        <div
          className="font-orbitron text-base font-black tracking-wider"
          style={{ background:"linear-gradient(135deg,#10b981,#0ea5e9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}
        >
          LIDMP
        </div>
        <div className="text-[9px] font-mono text-slate-400 tracking-widest">
          LUNAR ICE DISCOVERY & MISSION PLANNING PLATFORM
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
          <Clock size={12} className="text-sky-500" />
          <span>{time.toUTCString().slice(17, 25)} UTC</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-600">
          <Clock size={12} />
          <span>{fmt(missionTime)}</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <Signal size={14} className="text-emerald-500" />
          <Wifi size={14} className="text-sky-500" />
          <Battery size={14} className="text-emerald-500" />
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold"
          style={{ background:"linear-gradient(135deg,#d1fae5,#dbeafe)", color:"#065f46", border:"1px solid #a7f3d0" }}
        >
          <Satellite size={10} />
          ISRO
        </div>
      </div>
    </header>
  );
}
