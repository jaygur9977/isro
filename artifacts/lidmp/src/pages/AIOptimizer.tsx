import { useState, useRef } from "react";
import { Cpu, Send, Sparkles, AlertCircle, ChevronRight } from "lucide-react";

interface Message { role:"user"|"assistant"; content:string; }

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:#f1f5f9;padding:1px 4px;border-radius:3px;font-size:10px'>$1</code>")
    .replace(/^#{3}\s(.+)$/gm, "<div style='font-family:Orbitron,sans-serif;font-size:9px;font-weight:700;color:#5b21b6;margin:6px 0 2px'>$1</div>")
    .replace(/^#{2}\s(.+)$/gm, "<div style='font-family:Orbitron,sans-serif;font-size:10px;font-weight:800;color:#5b21b6;margin:8px 0 3px'>$1</div>")
    .replace(/^#{1}\s(.+)$/gm, "<div style='font-family:Orbitron,sans-serif;font-size:11px;font-weight:900;color:#5b21b6;margin:8px 0 4px'>$1</div>")
    .replace(/^[-•]\s(.+)$/gm, "<div style='display:flex;gap:6px;margin:2px 0'><span style='color:#8b5cf6;flex-shrink:0'>▸</span><span>$1</span></div>")
    .replace(/^\d+\.\s(.+)$/gm, "<div style='margin:2px 0'>$1</div>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

const SYSTEM_PROMPT = `You are LIDMP-AI, an expert ISRO mission planning assistant for Chandrayaan-4 lunar south pole operations. You have deep knowledge of:
- Lunar ice detection: DFSAR CPR/DOP analysis, Diviner thermal mapping, LOLA DEM data
- Landing site selection: slope constraints (<5°), illumination >60%, thermal stability
- Rover traverse planning with solar window constraints  
- Launch window optimization using orbital mechanics
- Risk assessment for south pole missions (PSR navigation, dust, radiation)

Current mission: Shackleton Rim Alpha (89.54°S, 0.00°E) · Ice: 93% · Safety: 94% · Launch: 2026-09-14 · 180 sols

Be precise, technical, and actionable. Use ISRO terminology. Concise but thorough.`;

const PRESETS = [
  "Optimal launch window for September 2026?",
  "Analyze ice deposit at Shackleton Rim Alpha",
  "Improve the rover traverse path",
  "Top 3 risks for this south pole mission",
  "Compare LS-01 vs LS-02 success probability",
];

export default function AIOptimizer() {
  const [messages, setMessages] = useState<Message[]>([{
    role:"assistant",
    content:"LIDMP-AI online. I'm your AI mission planning assistant for Chandrayaan-4 south pole operations. I can analyze launch windows, ice detection data, landing site safety, and rover path optimization. What would you like to explore?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);
    const userMsg: Message = { role:"user", content:text };
    setMessages(prev=>[...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model:"llama-3.3-70b-versatile",
          messages:[
            { role:"system", content:SYSTEM_PROMPT },
            ...messages.map(m=>({role:m.role,content:m.content})),
            { role:"user", content:text },
          ],
          max_tokens:700, temperature:.7,
        }),
      });
      if (!res.ok) { const e=await res.json().catch(()=>({})); throw new Error(e?.error?.message||`API ${res.status}`); }
      const data = await res.json();
      setMessages(prev=>[...prev,{ role:"assistant", content:data.choices?.[0]?.message?.content??"No response." }]);
      setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),80);
    } catch(e) {
      const msg = e instanceof Error?e.message:"Unknown error";
      setError(msg);
      setMessages(prev=>[...prev,{ role:"assistant", content:`Error: ${msg}` }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4" style={{ background:"linear-gradient(135deg,#f0f7f3,#f5f9ff,#fef2f5)" }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
          <Cpu size={20} className="text-violet-600" />
        </div>
        <div>
          <div className="font-orbitron text-base font-black text-slate-800">AI LAUNCH OPTIMIZER</div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Sparkles size={10} className="text-amber-500" />
            Llama 3.3 70B · Mission Planning Assistant
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-soft" />
          <span className="text-[10px] font-mono text-emerald-600 font-semibold">AI ONLINE</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p=>(
          <button key={p} onClick={()=>send(p)} disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] font-mono font-medium transition-all"
            style={{ background:"white", border:"1px solid rgba(139,92,246,.2)", color:"#5b21b6", opacity:loading?.6:1, boxShadow:"0 1px 4px rgba(139,92,246,.08)" }}
          >
            <ChevronRight size={8}/>{p.slice(0,42)}{p.length>42?"…":""}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto rounded-2xl p-3 space-y-3" style={{ background:"white", border:"1px solid rgba(0,0,0,.07)" }}>
        {messages.map((msg,i)=>(
          <div key={i} className={`flex gap-2.5 ${msg.role==="user"?"flex-row-reverse":""}`}>
            <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-[8px] font-mono font-bold"
              style={{ background:msg.role==="user"?"linear-gradient(135deg,#dbeafe,#d1fae5)":"linear-gradient(135deg,#ede9fe,#fce7f3)", color:msg.role==="user"?"#1e40af":"#5b21b6" }}>
              {msg.role==="user"?"YOU":"AI"}
            </div>
            <div className="flex-1 p-3 rounded-xl text-xs leading-relaxed"
              style={{ background:msg.role==="user"?"linear-gradient(135deg,#f0f9ff,#f0fdf4)":"linear-gradient(135deg,#faf5ff,#fdf2f8)", border:`1px solid ${msg.role==="user"?"rgba(14,165,233,.15)":"rgba(139,92,246,.15)"}`, color:"#1e293b", maxWidth:"85%" }}>
              <div className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
            </div>
          </div>
        ))}
        {loading&&(
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-[8px] font-mono font-bold" style={{ background:"linear-gradient(135deg,#ede9fe,#fce7f3)", color:"#5b21b6" }}>AI</div>
            <div className="p-3 rounded-xl" style={{ background:"linear-gradient(135deg,#faf5ff,#fdf2f8)", border:"1px solid rgba(139,92,246,.15)" }}>
              <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 pulse-soft" style={{ animationDelay:`${i*.2}s` }}/>)}</div>
            </div>
          </div>
        )}
        {error&&<div className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-mono" style={{ background:"#fff1f2", border:"1px solid #fda4af", color:"#9f1239" }}><AlertCircle size={12}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
          placeholder="Ask about launch windows, ice analysis, rover paths…"
          className="flex-1 px-4 py-2.5 rounded-xl text-xs font-mono outline-none transition-all"
          style={{ background:"white", border:"1px solid rgba(0,0,0,.1)", color:"#1e293b" }}
          disabled={loading}
        />
        <button onClick={()=>send(input)} disabled={loading||!input.trim()}
          className="px-4 py-2.5 rounded-xl transition-all"
          style={{ background:loading||!input.trim()?"#e2e8f0":"linear-gradient(135deg,#8b5cf6,#0ea5e9)", color:loading||!input.trim()?"#94a3b8":"white" }}>
          <Send size={14}/>
        </button>
      </div>
    </div>
  );
}
