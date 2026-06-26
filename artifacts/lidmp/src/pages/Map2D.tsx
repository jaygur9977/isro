import { useEffect, useRef, useState } from "react";
import { landingSites, roverWaypoints, type LunarCrater } from "../data/sensorData";
import { Layers, Target, Navigation, Thermometer, Eye, EyeOff } from "lucide-react";

interface Map2DProps { crater: LunarCrater; }

const MOON_TEXTURE = "https://raw.githubusercontent.com/mrdoob/three.js/r128/examples/textures/planets/moon_1024.jpg";

export default function Map2D({ crater }: Map2DProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<HTMLImageElement | null>(null);

  const [layers, setLayers] = useState({ ice: true, thermal: true, illumination: true, sites: true, path: true });
  const [texLoaded, setTexLoaded] = useState(false);

  const toggleLayer = (key: keyof typeof layers) => setLayers((p) => ({ ...p, [key]: !p[key] }));

  const draw = (canvas: HTMLCanvasElement, moonImg: HTMLImageElement | null) => {
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    // Real moon texture as background
    if (moonImg && texLoaded) {
      ctx.drawImage(moonImg, 0, 0, W, H);
      // Tint to bring out the south-pole region
      ctx.fillStyle = "rgba(10,20,40,0.45)";
      ctx.fillRect(0, 0, W, H);
    } else {
      const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/2);
      bg.addColorStop(0, "#2a2a2a");
      bg.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // PSR / Illumination overlay
    if (layers.illumination) {
      const psrRegions = [
        { x:0.5, y:0.5, rx:0.24, ry:0.19 },
        { x:0.3, y:0.35, rx:0.11, ry:0.08 },
        { x:0.7, y:0.65, rx:0.13, ry:0.09 },
        { x:0.2, y:0.7, rx:0.07, ry:0.05 },
        { x:0.8, y:0.3, rx:0.08, ry:0.06 },
      ];
      psrRegions.forEach(({ x, y, rx, ry }) => {
        const grad = ctx.createRadialGradient(x*W, y*H, 0, x*W, y*H, rx*W);
        grad.addColorStop(0, "rgba(6,20,50,0.75)");
        grad.addColorStop(1, "rgba(6,20,50,0)");
        ctx.beginPath();
        ctx.ellipse(x*W, y*H, rx*W, ry*H, 0, 0, Math.PI*2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(148,163,184,0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3,4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.font = "bold 9px JetBrains Mono, monospace";
      ctx.fillText("PSR", 0.5*W - 10, 0.5*H + 4);
    }

    // Ice deposits
    if (layers.ice) {
      [
        { x:0.5, y:0.5, r:0.17 },
        { x:0.3, y:0.35, r:0.08 },
        { x:0.7, y:0.62, r:0.09 },
      ].forEach(({ x, y, r }) => {
        const g = ctx.createRadialGradient(x*W, y*H, 0, x*W, y*H, r*W);
        g.addColorStop(0, "rgba(56,189,248,0.50)");
        g.addColorStop(0.5, "rgba(56,189,248,0.18)");
        g.addColorStop(1, "rgba(56,189,248,0)");
        ctx.beginPath(); ctx.arc(x*W, y*H, r*W, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
      });
    }

    // Thermal spots
    if (layers.thermal) {
      [
        { x:0.15, y:0.2, r:0.06, c:"255,100,50" },
        { x:0.85, y:0.8, r:0.05, c:"255,80,30" },
        { x:0.6,  y:0.15, r:0.04, c:"255,120,60" },
      ].forEach(({ x, y, r, c }) => {
        const g = ctx.createRadialGradient(x*W, y*H, 0, x*W, y*H, r*W);
        g.addColorStop(0, `rgba(${c},0.30)`);
        g.addColorStop(1, `rgba(${c},0)`);
        ctx.beginPath(); ctx.arc(x*W, y*H, r*W, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
      });
    }

    // Craters
    [
      {x:0.22,y:0.25,r:40},{x:0.75,y:0.70,r:55},{x:0.55,y:0.80,r:35},
      {x:0.35,y:0.60,r:30},{x:0.65,y:0.40,r:45},{x:0.15,y:0.55,r:25},
      {x:0.85,y:0.45,r:38},{x:0.42,y:0.18,r:28},
    ].forEach(({ x, y, r }) => {
      ctx.beginPath(); ctx.arc(x*W, y*H, r, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.lineWidth = 1; ctx.stroke();
    });

    // Crater name label
    ctx.fillStyle = "rgba(16,185,129,0.9)";
    ctx.font = "bold 10px Orbitron, sans-serif";
    ctx.fillText(crater.name, 0.5*W - 30, 0.5*H - 14);
    ctx.fillStyle = "rgba(148,163,184,0.7)";
    ctx.font = "8px JetBrains Mono, monospace";
    ctx.fillText(`${crater.lat}°S · ${crater.lon}°E`, 0.5*W - 36, 0.5*H - 4);

    // Rover path
    if (layers.path) {
      const sx = 0.5*W, sy = 0.5*H;
      const pts: [number,number][] = [[sx,sy],[sx+30,sy-20],[sx+65,sy-10],[sx+95,sy+15],[sx+130,sy+5],[sx+165,sy+25]];
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      pts.slice(1).forEach(([px,py]) => ctx.lineTo(px,py));
      ctx.strokeStyle="rgba(139,92,246,0.8)"; ctx.lineWidth=2; ctx.setLineDash([5,3]); ctx.stroke(); ctx.setLineDash([]);
      const wc = ["#10b981","#0ea5e9","#f59e0b","#0ea5e9","#f59e0b","#ef4444"];
      pts.forEach(([px,py],i) => {
        ctx.beginPath(); ctx.arc(px,py,5,0,Math.PI*2);
        ctx.fillStyle = wc[i]; ctx.fill();
        ctx.strokeStyle="rgba(255,255,255,0.5)"; ctx.lineWidth=1; ctx.stroke();
      });
    }

    // Landing sites
    if (layers.sites) {
      const sitePos = [
        { x:0.5, y:0.5, color:"#10b981", label:"LS-01 PRIMARY" },
        { x:0.32,y:0.38,color:"#f59e0b", label:"LS-02" },
        { x:0.67,y:0.63,color:"#f59e0b", label:"LS-03" },
        { x:0.18,y:0.72,color:"#ef4444", label:"LS-04" },
      ];
      sitePos.forEach(({ x, y, color, label }) => {
        const cx=x*W, cy=y*H;
        ctx.strokeStyle=color; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(cx-14,cy); ctx.lineTo(cx+14,cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx,cy-14); ctx.lineTo(cx,cy+14); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2);
        ctx.fillStyle=`${color}30`; ctx.fill(); ctx.stroke();
        ctx.fillStyle=color; ctx.font="bold 8px JetBrains Mono, monospace";
        ctx.fillText(label, cx+14, cy+4);
      });
    }

    // Scale + border
    ctx.strokeStyle="rgba(16,185,129,0.6)"; ctx.lineWidth=1; ctx.strokeRect(1,1,W-2,H-2);
    ctx.fillStyle="rgba(16,185,129,0.7)"; ctx.fillRect(W-92,H-26,60,2);
    ctx.fillStyle="rgba(148,163,184,0.8)"; ctx.font="8px JetBrains Mono,monospace"; ctx.fillText("50 km",W-92,H-12);

    // Title
    ctx.fillStyle="rgba(255,255,255,0.85)"; ctx.font="bold 11px Orbitron, sans-serif";
    ctx.fillText("LUNAR SOUTH POLE", 12, 28);
    ctx.fillStyle="rgba(148,163,184,0.7)"; ctx.font="8px JetBrains Mono, monospace";
    ctx.fillText("89°S–90°S · CHANDRAYAAN-4 TARGET ZONE", 12, 42);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const container = mapRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = container.clientWidth || 700;
    canvas.height = container.clientHeight || 500;
    canvas.style.width = "100%"; canvas.style.height = "100%";
    canvas.style.borderRadius = "0.875rem";
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = MOON_TEXTURE;
    img.onload = () => { textureRef.current = img; setTexLoaded(true); draw(canvas, img); };
    img.onerror = () => { draw(canvas, null); };

    draw(canvas, null);

    return () => { container.removeChild(canvas); };
  }, []);

  useEffect(() => {
    if (canvasRef.current) draw(canvasRef.current, textureRef.current);
  }, [layers, texLoaded, crater]);

  return (
    <div className="h-full flex flex-col p-4 gap-4" style={{ background: "linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-orbitron text-base font-black text-slate-800">2D LUNAR MAP VIEWER</div>
          <div className="text-xs font-mono text-slate-400">Real Moon Texture · {crater.name} PSR Region · Interactive Layers</div>
        </div>
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-emerald-500" />
          <span className="text-xs font-mono text-slate-500">LAYER CONTROLS</span>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Map canvas */}
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,.08)", boxShadow: "0 4px 20px rgba(0,0,0,.10)", minHeight: "400px" }}>
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Layer sidebar */}
        <div className="w-48 space-y-3 flex-shrink-0">
          {/* Layers */}
          <div className="rounded-2xl p-3" style={{ background: "white", border: "1px solid rgba(0,0,0,.07)" }}>
            <div className="text-[9px] font-mono text-emerald-600 font-bold tracking-widest mb-2">ACTIVE LAYERS</div>
            {[
              { key:"ice",         label:"Ice Deposits",  icon:<span className="text-sky-400">■</span>,  color:"#0ea5e9" },
              { key:"thermal",     label:"Thermal Map",   icon:<Thermometer size={10} />,                 color:"#ef4444" },
              { key:"illumination",label:"PSR Zones",     icon:<span className="text-slate-400">●</span>, color:"#64748b" },
              { key:"sites",       label:"Landing Sites", icon:<Target size={10} />,                      color:"#10b981" },
              { key:"path",        label:"Rover Path",    icon:<Navigation size={10} />,                  color:"#8b5cf6" },
            ].map(({ key, label, icon, color }) => {
              const on = layers[key as keyof typeof layers];
              return (
                <button key={key} onClick={() => toggleLayer(key as keyof typeof layers)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg mb-1 transition-all text-left"
                  style={{ background: on ? `${color}10` : "#f8fafc", border: `1px solid ${on ? color+"30" : "transparent"}` }}
                >
                  <span style={{ color }}>{icon}</span>
                  <span className="text-[9px] font-mono text-slate-500 flex-1">{label}</span>
                  {on ? <Eye size={10} className="text-slate-400" /> : <EyeOff size={10} className="text-slate-300" />}
                </button>
              );
            })}
          </div>

          {/* Site legend */}
          <div className="rounded-2xl p-3" style={{ background: "white", border: "1px solid rgba(0,0,0,.07)" }}>
            <div className="text-[9px] font-mono text-emerald-600 font-bold tracking-widest mb-2">SITE LEGEND</div>
            {[["#10b981","Primary"],["#f59e0b","Backup"],["#ef4444","Rejected"]].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                <span className="text-[9px] font-mono text-slate-500">{l}</span>
              </div>
            ))}
          </div>

          {/* Target crater info */}
          <div className="rounded-2xl p-3" style={{ background: "white", border: "1px solid rgba(16,185,129,.2)" }}>
            <div className="text-[9px] font-mono text-emerald-600 font-bold tracking-widest mb-2">TARGET CRATER</div>
            <div className="space-y-1 text-[9px] font-mono">
              <div className="text-slate-700 font-semibold">{crater.name}</div>
              <div className="text-slate-400">LAT: {crater.lat}°S</div>
              <div className="text-slate-400">LON: {crater.lon}°E</div>
              <div className="text-slate-400">Ø: {crater.diameterKm} km</div>
              <div className="text-slate-400">PSR: {crater.psrArea}%</div>
              <div className="text-emerald-600 font-semibold mt-1">ICE: {crater.iceConfidence}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
