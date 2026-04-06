"use client";
import { usePathname } from "next/navigation";

const PHASES = [
  { id: "01", path: "/ascension/one" },
  { id: "02", path: "/ascension/two" },
  { id: "03", path: "/ascension/three" },
  { id: "04", path: "/ascension/four" },
];

export function ProgressIndicator() {
  const pathname = usePathname();
  const activeIndex = PHASES.findIndex(p => pathname === p.path);

  // Hide on the hub itself
  if (activeIndex === -1) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-1 px-4 py-2 bg-[#0a0000] border-b border-x border-[#ff00a0]/20 text-[9px] tracking-[0.25em] font-mono uppercase select-none">
      {PHASES.map((phase, i) => {
        const isActive  = i === activeIndex;
        const isPast    = i < activeIndex;
        return (
          <span key={phase.id} className="flex items-center gap-1">
            {/* Node dot */}
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-[#ff00a0] shadow-[0_0_8px_#ff00a0] animate-pulse"
                  : isPast
                  ? "bg-[#9d00ff]"
                  : "bg-[#ff00a0]/20"
              }`}
            />
            {/* Phase label */}
            <span
              className={`transition-colors duration-300 ${
                isActive  ? "text-[#ff00a0]" :
                isPast    ? "text-[#9d00ff]/70" :
                            "text-[#ff00a0]/20"
              }`}
            >
              {phase.id}
            </span>
            {/* Connector between nodes */}
            {i < PHASES.length - 1 && (
              <span className={`mx-0.5 transition-colors duration-300 ${isPast || isActive ? "text-[#9d00ff]/50" : "text-[#ff00a0]/10"}`}>
                ▸
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
