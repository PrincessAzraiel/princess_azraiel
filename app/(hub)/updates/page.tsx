import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Updates — Coming Soon",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#050306] text-white flex flex-col items-center justify-center px-6 text-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@400;500&family=Syncopate:wght@400;700&display=swap');
        .italiana { font-family: 'Italiana', serif; }
        .sync { font-family: 'Syncopate', sans-serif; }
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70vw 50vh at 50% 40%, rgba(134,25,143,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-sm">
        <p className="sync text-[8px] tracking-[0.5em] text-pink-400/60 uppercase mb-4">
          Coming Soon
        </p>
        <h1 className="italiana text-5xl text-white leading-none mb-4">
          Updates <em className="italic text-pink-300">&amp; Roadmap</em>
        </h1>
        <p className="manrope text-sm text-white/45 leading-relaxed mb-10">
          This page is being built. Check back soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 manrope text-xs text-white/40 hover:text-pink-300/80 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Back home
        </Link>
      </div>
    </div>
  );
}
