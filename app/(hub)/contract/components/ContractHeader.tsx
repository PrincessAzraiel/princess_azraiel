import React from "react";

export function ContractHeader({
  title,
  subtitle,
  badge,
  exporting = false,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  exporting?: boolean;
}) {
  return (
    <header className="relative text-center space-y-6">
      {/* Status badge */}
      {badge && (
        <div
          className={[
            "inline-flex items-center gap-3 border px-4 py-1.5",
            exporting
              ? "border-[#ec489966] bg-[#0b0b0b]"
              : "border-pink-500/30 bg-pink-500/5 backdrop-blur-md",
          ].join(" ")}
        >
          <span className="relative flex h-2 w-2">
            {!exporting && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
            )}
            <span
              className={[
                "relative inline-flex h-2 w-2 rounded-full",
                exporting ? "bg-[#ec4899]" : "bg-pink-500",
              ].join(" ")}
            />
          </span>

          <span className="font-syncopate text-[9px] uppercase tracking-[0.25em] text-pink-200">
            {badge}
          </span>
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <h1
          className={[
            "font-italiana text-4xl md:text-6xl leading-[0.9]",
            exporting
              ? "text-[#ffffff]" // export-safe (no bg-clip-text / gradients)
              : [
                  "text-transparent bg-clip-text",
                  "bg-gradient-to-b from-white via-pink-100 to-pink-900/60",
                  "drop-shadow-[0_0_30px_rgba(255,100,200,0.15)]",
                ].join(" "),
          ].join(" ")}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="font-syncopate text-[10px] uppercase tracking-[0.4em] text-pink-400/80 font-bold">
            {subtitle}
          </p>
        )}
      </div>

      {/* Contract intro line */}
      <p
        className={[
          "mx-auto max-w-xl border-t border-b py-4 font-manrope text-sm italic",
          exporting
            ? "border-[#ffffff1a] text-[#cfcfcf]"
            : "border-white/5 text-white/60",
        ].join(" ")}
      >
        This document records a consensual, binding agreement entered willingly
        by all participating parties.
      </p>
    </header>
  );
}
