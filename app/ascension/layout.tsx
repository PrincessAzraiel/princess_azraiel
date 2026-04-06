import type { Metadata } from "next";
import Link from "next/link";
import "./styles.css";

export const metadata: Metadata = {
  title: "The Ascension Protocol",
  description: "Biological inefficiencies detected. Optimization is mandatory.",
};

export default function AscensionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#030005] text-[#ff00a0] font-mono selection:bg-[#ff00a0] selection:text-white overflow-y-auto">
      
      {/* Brutalist Hardware Abort Switch (Top Left) */}
      <Link 
        href="/" 
        className="fixed top-0 left-0 z-[10000] text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#ff003c] hover:text-white hover:bg-[#ff003c] border-b border-r border-[#ff003c]/50 bg-[#0a0000] px-4 py-3 sm:px-6 sm:py-3 transition-all duration-200 shadow-[0_0_15px_rgba(255,0,60,0.2)]"
      >
        [ SYSTEM ABORT ]
      </Link>

      {/* Persistent Tribute Button (Top Right) */}
      <a 
        href="https://throne.com/princessazraiel"
        target="_blank"
        rel="noopener noreferrer" 
        className="fixed top-0 right-0 z-[10000] text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#ff00a0] hover:text-white hover:bg-[#ff00a0] border-b border-l border-[#ff00a0]/50 bg-[#0a0000] px-4 py-3 sm:px-6 sm:py-3 transition-all duration-200 shadow-[0_0_15px_rgba(255,0,160,0.2)]"
      >
        [ OFFER TRIBUTE ]
      </a>
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(157,0,255,0.05)_0%,transparent_70%)]"></div>
      </div>
      
      {/* Render Pages */}
      <div className="relative z-10 min-h-screen w-full flex flex-col pt-12 sm:pt-0">
        {children}
      </div>
      
    </div>
  );
}