import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Cpu } from "lucide-react";

const EARTH_TEX = "https://raw.githubusercontent.com/mrdoob/three.js/r134/examples/textures/planets/earth_atmos_2048.jpg";
const MOON_TEX  = "https://raw.githubusercontent.com/mrdoob/three.js/r134/examples/textures/planets/moon_1024.jpg";
const GROQ_KEY  = import.meta.env.VITE_GROQ_API_KEY;

interface LogLine { color: string; text: string; }
type Phase = "park" | "tli" | "transit" | "loi" | "descent" | "landed";

const EARTH_POS = new THREE.Vector3(-10, 0, 0);
const MOON_POS  = new THREE.Vector3(10, 0, 0);

function getPos(t: number): THREE.Vector3 {
  if (t < 0.15) {
    const a = (t / 0.15) * 4 * Math.PI;
    return new THREE.Vector3(EARTH_POS.x + 4.2 * Math.cos(a), 2.6 * Math.sin(a) * 0.45, 2.6 * Math.sin(a) * 0.9);
  } else if (t < 0.72) {
    const u = (t - 0.15) / 0.57;
    const angle = Math.PI * (1 + u);
    const cx = (EARTH_POS.x + MOON_POS.x) / 2;
    return new THREE.Vector3(cx + 10.4 * Math.cos(angle), 7.2 * Math.sin(angle) * 0.30, 7.2 * Math.sin(angle) * 0.15);
  } else if (t < 0.88) {
    const u = (t - 0.72) / 0.16;
    const a = u * 2 * Math.PI;
    return new THREE.Vector3(MOON_POS.x + 2.6 * Math.cos(Math.PI + a), 1.8 * Math.sin(a) * 0.30, 1.8 * Math.sin(a) * 0.85);
  } else {
    const u = (t - 0.88) / 0.12;
    const from = new THREE.Vector3(MOON_POS.x - 2.6, 0, 0);
    const to   = new THREE.Vector3(MOON_POS.x, -1.22, 0);
    return from.clone().lerp(to, u);
  }
}

function tToPhase(t: number): Phase {
  if (t < 0.13) return "park";
  if (t < 0.20) return "tli";
  if (t < 0.72) return "transit";
  if (t < 0.88) return "loi";
  if (t < 0.99) return "descent";
  return "landed";
}

const PHASE_META: Record<Phase, { label: string; color: string; desc: string }> = {
  park:    { label: "PARKING ORBIT",    color: "#10b981", desc: "LEO 2 elliptical orbits · alt 185 km" },
  tli:     { label: "TLI BURN",         color: "#f59e0b", desc: "Trans-Lunar Injection Δv = 3.14 km/s" },
  transit: { label: "TRANSIT",          color: "#0ea5e9", desc: "4.6-day cruise · MCC corrections active" },
  loi:     { label: "LUNAR ORBIT",      color: "#8b5cf6", desc: "LOI burn · 100 km polar orbit insertion" },
  descent: { label: "POWERED DESCENT",  color: "#ef4444", desc: "Throttle-down · south pole approach" },
  landed:  { label: "TOUCHDOWN",        color: "#10b981", desc: "Shackleton Rim Alpha · NOMINAL" },
};

function genLines(t: number, ph: Phase): LogLine[] {
  if (ph === "park") {
    const orb = Math.min(2, Math.floor((t / 0.15) * 2) + 1);
    const ang  = (t / 0.15) * 4 * Math.PI;
    return [
      { color: "#6ee7b7", text: `[PARK] orbit ${orb}/2  alt ${(185 + 12 * Math.sin(ang)).toFixed(0)} km  vel ${(7.79 - 0.05 * Math.sin(ang)).toFixed(3)} km/s` },
      { color: "#94a3b8", text: `[GNC]  inc 28.5°  RAAN 73.2°  θ ${((ang * 180 / Math.PI) % 360).toFixed(1)}°  TLI-ready NO` },
    ];
  }
  if (ph === "tli") {
    const dv = (3.14 * Math.min(1, (t - 0.13) / 0.07)).toFixed(2);
    return [
      { color: "#fbbf24", text: `[TLI]  BURN active  Δv ${dv} km/s  F=80kN  Isp=450s` },
      { color: "#f87171", text: `[ENG]  propellant ${(500 - parseFloat(dv) * 40).toFixed(0)} kg  chamber 2200 K` },
    ];
  }
  if (ph === "transit") {
    const day  = ((t - 0.20) / 0.52 * 4.6).toFixed(2);
    const dist = Math.round((1 - (t - 0.20) / 0.52) * 384400);
    const vel  = (1.02 + (t - 0.20) * 0.9).toFixed(3);
    return [
      { color: "#7dd3fc", text: `[TRN]  day ${day}/4.6  dist_moon ${dist.toLocaleString()} km` },
      { color: "#94a3b8", text: `[NAV]  vel ${vel} km/s  MCC nominal  solar 5.6 W/m²` },
      { color: "#c4b5fd", text: `[THM]  panel ${(20 + t * 30).toFixed(1)}°C  bat 97%  sys GO` },
    ];
  }
  if (ph === "loi") {
    const u   = (t - 0.72) / 0.16;
    const alt = (100 + 38 * Math.sin(u * 2 * Math.PI)).toFixed(0);
    return [
      { color: "#c4b5fd", text: `[LOI]  alt ${alt} km  Δv2 ${(0.84 * Math.min(1, u / 0.3)).toFixed(3)} km/s` },
      { color: "#7dd3fc", text: `[POL]  inc 89.7°  south_pole_track ACTIVE` },
      { color: "#6ee7b7", text: `[SFC]  DFSAR nominal  OHRC imaging` },
    ];
  }
  if (ph === "descent") {
    const u   = (t - 0.88) / 0.12;
    const alt = Math.round((1 - u) * 15000);
    return [
      { color: "#fbbf24", text: `[PDI]  alt ${alt.toLocaleString()} m  v_vert ${-(150 + u * 280).toFixed(0)} m/s` },
      { color: "#f87171", text: `[ENG]  throttle ${(70 - u * 32).toFixed(0)}%  fuel ${(180 - u * 120).toFixed(0)} kg` },
      { color: "#6ee7b7", text: `[LDR]  terrain flat  slope ${(2.1 - u * 0.3).toFixed(2)}°  SAFE` },
    ];
  }
  return [
    { color: "#6ee7b7", text: "[TDN]  TOUCHDOWN NOMINAL — Shackleton Rim Alpha" },
    { color: "#7dd3fc", text: `[SYS]  uptime ${Math.floor(t * 1000)} s  all_systems GREEN` },
    { color: "#fbbf24", text: `[SFC]  temp ${(42.7 + Math.sin(Date.now() / 3000) * 0.4).toFixed(2)} K  seismometer ARMED` },
  ];
}

function formatAI(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function Simulator3D() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const sceneRef  = useRef<{
    renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera;
    animId: number; spacecraft: THREE.Group; thr: THREE.Mesh;
    t: number; playing: boolean; earthMesh: THREE.Mesh; moonMesh: THREE.Mesh; atmo: THREE.Mesh;
  } | null>(null);
  const phaseRef = useRef<Phase>("park");
  const tRef     = useRef(0);

  const [playing,   setPlaying]   = useState(true);
  const [phase,     setPhase]     = useState<Phase>("park");
  const [progress,  setProgress]  = useState(0);
  const [logs,      setLogs]      = useState<LogLine[]>([]);
  const [aiResult,  setAiResult]  = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [params, setParams] = useState({
    launchLat: "13.91", launchLon: "80.00",
    targetLat: "-89.90", targetLon: "0.00",
    launchDate: "2026-09-14", launchTime: "06:00",
  });

  /* ── Continuous terminal — never stops ─────────────────── */
  useEffect(() => {
    const iv = setInterval(() => {
      const newLines = genLines(tRef.current, phaseRef.current);
      setLogs((prev) => [...prev, ...newLines].slice(-14));
    }, 950);
    return () => clearInterval(iv);
  }, []);

  /* ── 3D scene ───────────────────────────────────────────── */
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const W = container.clientWidth  || 800;
    const H = container.clientHeight || 420;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;";

    const scene = new THREE.Scene();
    const sg = new THREE.BufferGeometry();
    const sp = new Float32Array(4000 * 3);
    for (let i = 0; i < sp.length; i++) sp[i] = (Math.random() - 0.5) * 600;
    sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, sizeAttenuation: true })));

    scene.add(new THREE.AmbientLight(0x223355, 0.5));
    const sun = new THREE.DirectionalLight(0xfff8e8, 4.0); sun.position.set(60, 15, 40); scene.add(sun);
    const fillLight = new THREE.DirectionalLight(0x334466, 0.3);
    fillLight.position.set(-30, -10, -20); scene.add(fillLight);

    const loader = new THREE.TextureLoader();
    const aniso  = renderer.capabilities.getMaxAnisotropy();

    // Earth
    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3, 96, 96),
      new THREE.MeshPhongMaterial({ color: 0x1a5fa8, emissive: 0x061828 })
    );
    earthMesh.position.copy(EARTH_POS); scene.add(earthMesh);
    loader.load(EARTH_TEX, (tex) => {
      tex.anisotropy = aniso; tex.minFilter = THREE.LinearMipmapLinearFilter;
      earthMesh.material = new THREE.MeshPhongMaterial({ map: tex, specular: new THREE.Color(0.25,0.35,0.55), shininess:35 });
    });
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(3.28, 48, 48),
      new THREE.MeshPhongMaterial({ color:0x55aaff, transparent:true, opacity:0.10, side:THREE.BackSide })
    );
    atmo.position.copy(EARTH_POS); scene.add(atmo);

    // Moon
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 96, 96),
      new THREE.MeshPhongMaterial({ color:0x888880, emissive:0x1a1a18, shininess:4 })
    );
    moonMesh.position.copy(MOON_POS); scene.add(moonMesh);
    loader.load(MOON_TEX, (tex) => {
      tex.anisotropy = aniso; tex.minFilter = THREE.LinearMipmapLinearFilter;
      moonMesh.material = new THREE.MeshPhongMaterial({ map:tex, specular:new THREE.Color(0.06,0.06,0.06), shininess:3 });
    });

    const poleMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshPhongMaterial({ color:0x10b981, emissive:0x052a1a })
    );
    poleMesh.position.set(MOON_POS.x, -1.25, 0); scene.add(poleMesh);

    // Spacecraft
    const sc = new THREE.Group();
    sc.add(new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.13,0.40,8), new THREE.MeshPhongMaterial({color:0xdddddd,specular:0x888888,shininess:90})));
    const panMat = new THREE.MeshPhongMaterial({color:0x1a4a8a,emissive:0x0a1a3a,specular:0x4488cc,shininess:110});
    const lp = new THREE.Mesh(new THREE.BoxGeometry(0.60,0.012,0.18),panMat); lp.position.x=-0.32;
    const rp = new THREE.Mesh(new THREE.BoxGeometry(0.60,0.012,0.18),panMat); rp.position.x= 0.32;
    sc.add(lp, rp);
    const thr = new THREE.Mesh(new THREE.ConeGeometry(0.065,0.14,8), new THREE.MeshPhongMaterial({color:0xff8800,emissive:0x441100,transparent:true,opacity:0.90}));
    thr.position.y = -0.26; sc.add(thr);
    sc.position.copy(getPos(0)); scene.add(sc);

    // Trajectory lines
    const drawLine = (t0:number,t1:number,steps:number,color:number,opacity:number) => {
      const pts:THREE.Vector3[]=[];
      for(let i=0;i<=steps;i++) pts.push(getPos(t0+(t1-t0)*i/steps));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color,transparent:true,opacity})));
    };
    drawLine(0,    0.15, 160, 0x10b981, 0.55);
    drawLine(0.15, 0.72, 120, 0x0ea5e9, 0.45);
    drawLine(0.72, 0.88, 120, 0x8b5cf6, 0.55);
    drawLine(0.88, 1.00,  40, 0xf59e0b, 0.65);

    const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 1000);
    camera.position.set(0, 8, 26); camera.lookAt(0,0,0);

    const onWheel = (e:WheelEvent) => { camera.position.z = Math.max(10, Math.min(50, camera.position.z+e.deltaY*0.04)); };
    container.addEventListener("wheel", onWheel, { passive:true });

    const ref = { renderer,scene,camera,animId:0,spacecraft:sc,thr,t:0,playing:true,earthMesh,moonMesh,atmo };
    sceneRef.current = ref;

    const animate = () => {
      ref.animId = requestAnimationFrame(animate);
      if (ref.playing && ref.t < 1) {
        ref.t = Math.min(ref.t + 0.0012, 1);
        ref.spacecraft.position.copy(getPos(ref.t));
        ref.spacecraft.lookAt(getPos(Math.min(ref.t+0.008,1)));
        const pct = Math.round(ref.t*100);
        setProgress(pct);
        const ph = tToPhase(ref.t);
        setPhase(ph); phaseRef.current = ph; tRef.current = ref.t;
        if (ref.t >= 1) ref.playing = false;
      }
      ref.earthMesh.rotation.y += 0.0025;
      ref.atmo.rotation.y      += 0.0025;
      ref.moonMesh.rotation.y  += 0.0008;
      poleMesh.scale.setScalar(1 + 0.12*Math.sin(Date.now()*0.005));
      ref.thr.visible = ref.playing && ref.t < 0.80;
      if (ref.thr.visible) (ref.thr.material as THREE.MeshPhongMaterial).opacity = 0.6+0.3*Math.sin(Date.now()*0.03);
      renderer.render(scene,camera);
    };
    animate();

    // Boot log
    setTimeout(() => setLogs([
      { color:"#6ee7b7", text:"[SYS]  LIDMP 3D Simulator initialized" },
      { color:"#7dd3fc", text:`[CFG]  launch ${params.launchLat}°N ${params.launchLon}°E` },
      { color:"#7dd3fc", text:`[CFG]  target ${params.targetLat}°S ${params.targetLon}°E` },
      { color:"#fbbf24", text:"[ORB]  lunar_dist 384,400 km  transit 4.6 d" },
      { color:"#c4b5fd", text:"[TRJ]  Hohmann Δv1=3.14  Δv2=0.84 km/s" },
      { color:"#6ee7b7", text:"[GO]   mission clock T+0 — SIMULATION START" },
    ]), 400);

    const onResize = () => {
      if (!container) return;
      const nw=container.clientWidth, nh=container.clientHeight;
      camera.aspect=nw/nh; camera.updateProjectionMatrix(); renderer.setSize(nw,nh);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      container.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(ref.animId); renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const togglePlay = () => {
    if (!sceneRef.current) return;
    sceneRef.current.playing = !sceneRef.current.playing;
    setPlaying(sceneRef.current.playing);
  };
  const reset = () => {
    if (!sceneRef.current) return;
    sceneRef.current.t=0; sceneRef.current.playing=true;
    setPlaying(true); setPhase("park"); setProgress(0); setAiResult("");
    phaseRef.current="park"; tRef.current=0;
    setLogs([{ color:"#6ee7b7", text:"[RESET] simulation restarted — T+0" }]);
  };

  const analyzeWithAI = async () => {
    setAiLoading(true); setAiResult("");
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${GROQ_KEY}`},
        body: JSON.stringify({
          model:"llama-3.3-70b-versatile",
          messages:[{ role:"user", content:
`You are an orbital mechanics expert at ISRO. Analyze this lunar mission. Reply in plain numbered list, no markdown, no bold, no asterisks, no headers. Use • for sub-points. Be concise.

Launch site: ${params.launchLat}°N ${params.launchLon}°E (Sriharikota SDSC)
Target: ${params.targetLat}°S ${params.targetLon}°E (Shackleton Rim, Lunar South Pole)
Date: ${params.launchDate} at ${params.launchTime} UTC

Answer: 1) Is this launch window viable? 2) Weather estimate for Sriharikota Sept 2026. 3) Lunar distance on this date. 4) TLI parameters: C3 energy, transit time, LOI delta-V. 5) Better window in next 7 days if any. 6) GO / NO-GO verdict with confidence %.` }],
          max_tokens:500, temperature:0.25,
        }),
      });
      const data = await res.json();
      setAiResult(formatAI(data.choices?.[0]?.message?.content ?? "No response."));
    } catch { setAiResult("API error — check VITE_GROQ_API_KEY secret."); }
    finally { setAiLoading(false); }
  };

  const cur = PHASE_META[phase];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <div>
          <div className="font-orbitron text-sm font-black text-slate-800 tracking-wide">3D MISSION SIMULATOR</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Real textures · Orbital mechanics · Scroll to zoom</div>
        </div>
        <div className="flex gap-2">
          <button onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-semibold"
            style={{ background:"white", border:"1px solid #e2e8f0", color:"#64748b" }}>
            <RotateCcw size={11}/>RESET
          </button>
          <button onClick={togglePlay}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-mono font-bold"
            style={{ background:"linear-gradient(135deg,#10b981,#0ea5e9)", color:"white" }}>
            {playing ? <><Pause size={11}/>PAUSE</> : <><Play size={11}/>PLAY</>}
          </button>
        </div>
      </div>

      {/* ── Canvas + glass terminal overlay ─────────────────────── */}
      <div className="relative flex-shrink-0 mx-4 rounded-2xl overflow-hidden"
        style={{ height:"400px", background:"#02050a", border:"1px solid rgba(255,255,255,.06)", boxShadow:"0 8px 32px rgba(0,0,0,.30)" }}>

        <div ref={mountRef} className="w-full h-full" />

        {/* Glass terminal — overlaid on canvas, no scroll */}
        <div className="absolute top-3 left-3 bottom-3 w-56 flex flex-col rounded-xl overflow-hidden pointer-events-none"
          style={{ background:"rgba(4,8,18,0.76)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", border:"1px solid rgba(110,231,183,.20)", boxShadow:"inset 0 0 0 1px rgba(255,255,255,.04)" }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
            style={{ borderBottom:"1px solid rgba(110,231,183,.15)", background:"rgba(0,0,0,.25)" }}>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background:"#ef4444" }}/>
              <div className="w-2 h-2 rounded-full" style={{ background:"#f59e0b" }}/>
              <div className="w-2 h-2 rounded-full" style={{ background:"#10b981" }}/>
            </div>
            <span className="font-mono text-[9px] text-slate-400 ml-1">mission-computer — live</span>
          </div>
          {/* Log lines — fixed, no scroll, newest at bottom */}
          <div className="flex-1 flex flex-col justify-end p-2.5 gap-px overflow-hidden">
            {logs.map((l, i) => (
              <div key={i} className="font-mono text-[9.5px] leading-[1.55] whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ color: l.color }}>
                {l.text}
              </div>
            ))}
            <div className="font-mono text-[9.5px] text-emerald-400" style={{ animation:"blink 1s step-end infinite" }}>▋</div>
          </div>
        </div>

        {/* Phase badge — top right */}
        <div className="absolute top-3 right-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background:"rgba(2,5,10,.80)", border:`1px solid ${cur.color}35`, backdropFilter:"blur(8px)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background:cur.color, animation:"pulse 2s infinite" }}/>
            <span className="font-orbitron text-[10px] font-bold" style={{ color:cur.color }}>{cur.label}</span>
          </div>
          <div className="text-[8px] font-mono text-slate-500 mt-1 text-right">{cur.desc}</div>
        </div>

        {/* Body labels */}
        <div className="absolute bottom-8 left-3 right-3 flex justify-between pointer-events-none">
          <div className="px-2 py-0.5 rounded text-[8px] font-mono text-slate-400" style={{ background:"rgba(2,5,10,.60)" }}>EARTH</div>
          <div className="px-2 py-0.5 rounded text-[8px] font-mono" style={{ background:"rgba(2,5,10,.60)", color:"#10b981" }}>CHANDRAYAAN-4</div>
          <div className="px-2 py-0.5 rounded text-[8px] font-mono" style={{ background:"rgba(2,5,10,.60)", color:"#7dd3fc" }}>MOON · South Pole</div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5">
          <div className="h-1.5 transition-all duration-300" style={{ width:`${progress}%`, background:`linear-gradient(90deg,#10b981,#0ea5e9)` }}/>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="flex gap-1.5 px-4 mt-2 flex-shrink-0">
        {(Object.entries(PHASE_META) as [Phase, typeof PHASE_META[Phase]][]).map(([key,val]) => (
          <div key={key} className="flex-1 py-1.5 rounded-xl text-center transition-all"
            style={{ background:phase===key?`${val.color}12`:"white", border:`1px solid ${phase===key?val.color+"40":"#e2e8f0"}` }}>
            <div className="text-[7px] font-orbitron font-bold truncate leading-tight" style={{ color:phase===key?val.color:"#94a3b8" }}>
              {val.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Parameters + AI result (scrollable independently) ────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 mt-3 space-y-3">

        {/* Params */}
        <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid #e8ecf0" }}>
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={13} className="text-violet-500"/>
            <span className="font-orbitron text-[10px] font-bold text-slate-700 tracking-widest">SIMULATION PARAMETERS</span>
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-3">
            {[
              { key:"launchLat",  label:"Earth Lat °N" },
              { key:"launchLon",  label:"Earth Lon °E" },
              { key:"targetLat",  label:"Moon Lat °S"  },
              { key:"targetLon",  label:"Moon Lon °E"  },
              { key:"launchDate", label:"Launch Date", type:"date" },
              { key:"launchTime", label:"UTC Time",    type:"time" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <div className="text-[8px] font-mono text-slate-400 mb-0.5">{label}</div>
                <input type={type ?? "text"} value={params[key as keyof typeof params]}
                  onChange={(e) => setParams((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-2 py-1.5 rounded-lg text-[10px] font-mono outline-none"
                  style={{ background:"#f8fafc", border:"1px solid #e2e8f0", color:"#1e293b" }} />
              </div>
            ))}
          </div>
          <button onClick={analyzeWithAI} disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-mono font-bold transition-all"
            style={{ background:aiLoading?"#f1f5f9":"linear-gradient(135deg,#8b5cf6,#0ea5e9)", color:aiLoading?"#94a3b8":"white" }}>
            <Cpu size={11}/>{aiLoading?"ANALYZING…":"ANALYZE LAUNCH WINDOW WITH AI"}
          </button>
        </div>

        {/* AI result */}
        {aiResult && (
          <div className="rounded-2xl p-4" style={{ background:"white", border:"1px solid rgba(139,92,246,.20)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={13} className="text-violet-500"/>
              <span className="font-orbitron text-[10px] font-bold text-violet-700 tracking-widest">AI — LAUNCH ANALYSIS</span>
              <button onClick={reset} className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold"
                style={{ background:"linear-gradient(135deg,#10b981,#0ea5e9)", color:"white" }}>
                APPLY & SIMULATE
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">{aiResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
