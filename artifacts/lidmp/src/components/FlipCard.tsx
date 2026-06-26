import { useState } from "react";
import { RotateCcw } from "lucide-react";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  height?: string;
  className?: string;
}

export default function FlipCard({ front, back, height = "auto", className = "" }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card-wrapper ${flipped ? "flipped" : ""} ${className}`}
      style={{ height, minHeight: "100%" }}
      onClick={() => setFlipped((f) => !f)}
      title={flipped ? "Click to flip back" : "Click to see proof of concept"}
    >
      <div className="flip-card-inner">
        {/* FRONT */}
        <div className="flip-card-front">{front}</div>

        {/* BACK */}
        <div className="flip-card-back">
          {back}
          {/* flip-back hint */}
          <div
            className="absolute bottom-2 right-2 flex items-center gap-1 opacity-50"
            style={{ pointerEvents: "none" }}
          >
            <RotateCcw size={10} className="text-slate-500" />
            <span className="text-[8px] font-mono text-slate-500">flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
