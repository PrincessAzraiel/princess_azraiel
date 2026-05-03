import React from "react";

export function Section({
  title,
  hint,
  icon,
  children,
}: {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      {/* Header line */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="text-pink-400 opacity-80">
              {icon}
            </span>
          )}
          <h2 className="font-italiana text-2xl md:text-3xl text-pink-100 leading-none">
            {title}
          </h2>
        </div>

        {hint && (
          <span className="hidden sm:inline font-syncopate text-[9px] uppercase tracking-[0.25em] text-white/30">
            {hint}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="mb-6 h-px w-full bg-gradient-to-r from-pink-500/40 via-white/10 to-transparent" />

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </section> 
  );
}
