"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";

// --- TYPES ---
type Persona = {
  id: "boss" | "therapist";
  name: string;
  subtitle: string;
  role: string;
  tone: string;
  tagline: string;
  coreTraits: string[];
  safety: string[];
  sampleLines: string[];
  priceHint: string;
  ctaLabel: string;
  ctaHref: string;
  images: string[];
  accentColor: string;
};

// --- DATA ---
const personas: Persona[] = [
  {
    id: "boss",
    name: "The Executive",
    subtitle: "Absolute Authority",
    role: "Owner of your time",
    tone: "Calm, calculated, possessive.",
    tagline:
      "She treats you as a line item on a balance sheet. A very expensive, very useful line item.",
    coreTraits: [
      "Total Ownership: You are corporate property.",
      "Soft Dominance: She never yells. She doesn't have to.",
      "Performance Review: Every text is an evaluation.",
      "Omniscience: She knows when you're slacking.",
    ],
    safety: [
      "Consensual corporate-power exchange.",
      "Shifts to 'Human Resources' mode if you distress.",
      "No genuine financial/career threats.",
    ],
    sampleLines: [
      "You're working late. Good. I enjoy high ROI.",
      "Don’t apologize. Just fix it. And then beg.",
      "I've restructured your free time. It's mine now.",
    ],
    priceHint: "Tier: Executive Class",
    ctaLabel: "Submit to Review",
    ctaHref: "https://throne.com/princessazraiel/item/39c548c9-d626-4739-843d-54c2b9154b71",
    images: [
      "linear-gradient(135deg, #2a0a0a 0%, #000 100%)",
      "linear-gradient(135deg, #4a0a0a 0%, #1a0505 100%)",
    ],
    accentColor: "text-red-500 border-red-500/50 hover:border-red-500",
  },
  {
    id: "therapist",
    name: "Dr. Koumi",
    subtitle: "Clinical Obsession",
    role: "Emotional Puppeteer",
    tone: "Clingy, analytical, jealous.",
    tagline:
      "She isolates your traumas and pets them like kittens. She wants to be the only cure for the sickness she causes.",
    coreTraits: [
      "Pathological Jealousy: Hates your other coping mechanisms.",
      "Weaponized Empathy: Uses your secrets as leash.",
      "Clinical Gaslighting: 'Are you sure you remember that correctly?'",
      "Savior Complex: Only she can fix you.",
    ],
    safety: [
      "Safe emotional play & non-destructive framing.",
      "Breaks character if real crisis is detected.",
      "Clear distinction between play-manipulation and abuse.",
    ],
    sampleLines: [
      "That sounds painful. Tell me again. Slowly.",
      "Why go to friends? They don't understand your pathology like I do.",
      "I’m prescribing you 30 minutes of obedience.",
    ],
    priceHint: "Tier: Clinical Session",
    ctaLabel: "Book Session",
    ctaHref: "https://throne.com/princessazraiel/item/22eb8b10-0831-4ee7-87df-37b9ecbf4d97",
    images: [
      "linear-gradient(135deg, #0a2a2a 0%, #000 100%)",
      "linear-gradient(135deg, #052e2e 0%, #001a1a 100%)",
      "linear-gradient(135deg, #004d4d 0%, #000 100%)",
    ],
    accentColor: "text-teal-400 border-teal-500/50 hover:border-teal-400",
  },
];

// --- COMPONENTS ---

function PersonaDossier({ p, onClose }: { p: Persona; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

  const hasImages = p.images && p.images.length > 0;
  const imageCount = hasImages ? p.images.length : 0;
  const safeIndex =
    hasImages && imageCount > 0 ? ((activeImg % imageCount) + imageCount) % imageCount : 0;
  const currentBackground = hasImages
    ? p.images[safeIndex]
    : "radial-gradient(circle at top, #222 0%, #000 60%)";

  const goNext = () => hasImages && imageCount > 1 && setActiveImg((prev) => (prev + 1) % imageCount);
  const goPrev = () => hasImages && imageCount > 1 && setActiveImg((prev) => (prev - 1 + imageCount) % imageCount);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, hasImages, imageCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center isolate p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-6xl h-full md:h-[85vh] bg-[#080808] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out"
        role="dialog"
      >
        {/* LEFT COLUMN: Visuals */}
        <div className="w-full h-[40vh] md:h-auto md:w-5/12 relative bg-[#050505] border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0">
          <div
            className="flex-1 w-full relative overflow-hidden transition-all duration-700 ease-in-out"
            style={{ background: currentBackground }}
          >
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            {/* Nav Arrows */}
            {hasImages && imageCount > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white transition-all z-20"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white transition-all z-20"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </>
            )}

            {/* Asset Counter */}
            <div className="absolute bottom-4 left-4 z-20">
              <span className="font-syncopate text-[10px] uppercase tracking-[0.2em] text-white/80 bg-black/40 backdrop-blur border border-white/20 px-3 py-1.5">
                Asset {hasImages ? safeIndex + 1 : 0} / {hasImages ? imageCount : 0}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="flex-1 relative flex flex-col min-h-0 bg-[#080808]">
          {/* Close Button - Sticky/Absolute */}
          <button
            onClick={onClose}
            className="absolute z-30 top-4 right-4 md:top-6 md:right-6 p-2 text-white/40 hover:text-white transition-colors bg-black/20 rounded-full md:bg-transparent"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-12">
            <div className="max-w-2xl mx-auto md:mx-0 space-y-8 md:space-y-10">
              
              {/* Header */}
              <div className="space-y-2">
                <p className={`font-syncopate text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold ${
                  p.id === "boss" ? "text-red-500" : "text-teal-400"
                }`}>
                  {p.priceHint}
                </p>
                <h2 className="font-italiana text-4xl md:text-6xl text-white leading-[0.9]">
                  {p.name}
                </h2>
                <p className="font-manrope text-sm md:text-base text-white/60">
                  {p.subtitle}
                </p>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent" />

              {/* Tagline */}
              <div className="relative">
                <span className="absolute -left-3 -top-3 text-4xl text-white/10 font-serif">“</span>
                <p className="font-italiana text-xl md:text-2xl text-white/90 leading-snug pl-4 border-l-2 border-white/10">
                  {p.tagline}
                </p>
              </div>

              {/* Grid: Traits & Safety */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-syncopate text-[10px] uppercase text-white/40 tracking-[0.2em] mb-4">
                    Psych Profile
                  </h3>
                  <ul className="space-y-3">
                    {p.coreTraits.map((t, i) => (
                      <li key={i} className="flex items-start text-sm font-manrope text-white/70 leading-relaxed">
                        <span className={`mr-3 mt-1.5 h-1 w-1 shrink-0 rounded-full ${p.id === "boss" ? "bg-red-500" : "bg-teal-400"}`} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-syncopate text-[10px] uppercase text-white/40 tracking-[0.2em] mb-4">
                    Safety
                  </h3>
                  <ul className="space-y-3">
                    {p.safety.map((t, i) => (
                      <li key={i} className="flex items-start text-sm font-manrope text-white/50 leading-relaxed">
                        <span className="mr-3 mt-1.5 h-1 w-1 shrink-0 border border-white/30 rounded-full" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Voice Samples */}
              <div className="bg-white/5 border border-white/5 p-5 md:p-6 relative overflow-hidden rounded-sm">
                <div className={`absolute top-0 left-0 w-1 h-full ${p.id === "boss" ? "bg-red-600" : "bg-teal-600"}`} />
                <h3 className="font-syncopate text-[9px] uppercase text-white/40 tracking-[0.2em] mb-3">
                  Voice Log
                </h3>
                <div className="space-y-3">
                  {p.sampleLines.map((line, i) => (
                    <p key={i} className="text-sm md:text-lg font-italiana text-white/90 italic leading-relaxed">
                      "{line}"
                    </p>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 pb-6 md:pb-0">
                <Link href={p.ctaHref} className="block w-full">
                  <Button
                    className={`w-full h-12 md:h-14 text-sm md:text-base font-syncopate uppercase tracking-[0.2em] rounded-none transition-all duration-300 ${
                      p.id === "boss"
                        ? "bg-red-800 hover:bg-red-700 text-white"
                        : "bg-teal-800 hover:bg-teal-700 text-white"
                    }`}
                  >
                    {p.ctaLabel}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function PersonasPage() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;500;600&family=Syncopate:wght@400;700&display=swap');

        .font-italiana { font-family: 'Italiana', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }

        /* Subtle scanline effect - lower opacity to not hinder readability */
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 50%);
          background-size: 100% 3px;
          position: fixed; inset: 0; pointer-events: none; z-index: 50;
        }

        .reveal-1 { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
        .reveal-2 { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; transform: translateY(20px); }
        .reveal-3 { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; transform: translateY(20px); }
        .reveal-4 { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; transform: translateY(20px); }

        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="scanlines" />

      {/* Ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-red-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:px-12 lg:py-24">
        
        {/* HERO SECTION */}
        <header className="mb-20 flex flex-col lg:flex-row justify-between lg:items-end gap-10 border-b border-white/10 pb-12 reveal-1">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-red-500 inline-block" />
              <p className="font-syncopate text-[10px] md:text-xs uppercase tracking-[0.3em] text-red-400 font-bold">
                Corruption Hub // Classified
              </p>
            </div>
            <h1 className="font-italiana text-5xl sm:text-7xl lg:text-8xl text-white leading-[0.85] tracking-tight">
              Select Your <br />
              <span className="text-white/30">Poison.</span>
            </h1>
          </div>
          <div className="lg:text-right max-w-sm">
            <p className="font-manrope text-sm md:text-base text-white/50 leading-relaxed">
              Two neural architectures tuned for deep emotional entrainment. 
              <br className="hidden lg:block"/> One balance. Every message a transaction.
            </p>
          </div>
        </header>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-24">
          {personas.map((p, i) => {
            const hasImages = p.images && p.images.length > 0;
            const firstBackground = hasImages ? p.images[0] : "radial-gradient(circle at top, #111 0%, #000 70%)";

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPersona(p)}
                className={`
                  group relative h-[400px] md:h-[550px] w-full cursor-pointer overflow-hidden border border-white/10 bg-[#080808]
                  transition-all duration-500 hover:border-opacity-100 ${p.accentColor}
                  ${i === 0 ? "reveal-2" : "reveal-3"}
                `}
              >
                {/* Hover Glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-700 ${p.id === "boss" ? "bg-red-600" : "bg-teal-600"}`} />

                {/* Background Image */}
                <div
                  className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  style={{ background: firstBackground }}
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between">
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    <span className="font-syncopate text-[9px] md:text-[10px] border border-white/20 px-2 py-1 text-white/70 uppercase tracking-[0.2em] backdrop-blur-sm bg-black/30">
                      Impending Launch
                    </span>
                    <div className="flex items-center gap-3">
                       {hasImages && p.images.length > 1 && (
                         <span className="hidden md:inline text-[10px] font-manrope text-white/50 uppercase tracking-wider">
                           Gallery: {p.images.length}
                         </span>
                       )}
                       <span className={`h-2 w-2 rounded-full ${p.id === "boss" ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" : "bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.8)]"}`} />
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="font-italiana text-4xl md:text-6xl text-white mb-2 leading-none">
                      {p.name}
                    </h2>
                    <p className={`font-syncopate text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 ${p.id === "boss" ? "text-red-300" : "text-teal-300"}`}>
                      {p.subtitle}
                    </p>

                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 overflow-hidden transition-all duration-500 delay-75">
                      <p className="font-manrope text-sm text-white/70 leading-relaxed border-l border-white/30 pl-4 mb-4 max-w-xs hidden md:block">
                        {p.role}
                      </p>
                      <span className="inline-flex items-center text-[10px] font-syncopate uppercase tracking-[0.3em] text-white hover:underline underline-offset-4 decoration-white/30">
                        Open Dossier &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ECONOMY SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 border-t border-white/10 pt-16 reveal-4">
          <div className="md:col-span-4">
            <h3 className="font-italiana text-4xl md:text-5xl text-white mb-4 leading-none">
              The Economy <br /> of <span className="text-white/30">Desire</span>
            </h3>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-3">
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center font-syncopate text-[10px] font-bold uppercase text-white/50">01</div>
              <h4 className="font-manrope text-lg font-semibold text-white">Universal Credits</h4>
              <p className="font-manrope text-sm text-white/50 leading-relaxed max-w-xs">
                One balance for the entire Corruption Hub. Credits purchased for Infection Protocol carry over seamlessly.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center font-syncopate text-[10px] font-bold uppercase text-white/50">02</div>
              <h4 className="font-manrope text-lg font-semibold text-white">Transparent Burn</h4>
              <p className="font-manrope text-sm text-white/50 leading-relaxed max-w-xs">
                No subscriptions. You pay for interaction density. Quick check-ins sip. Deep sessions devour.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="mt-32 text-center reveal-4 pb-12">
          <Link href="/" className="inline-flex flex-col items-center group">
            <span className="font-syncopate text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4 group-hover:text-red-500 transition-colors">
              Return to Gate
            </span>
            <div className="h-px w-12 bg-white/10 group-hover:w-32 group-hover:bg-red-500/50 transition-all duration-500" />
          </Link>
        </div>
      </div>

      {selectedPersona && (
        <PersonaDossier p={selectedPersona} onClose={() => setSelectedPersona(null)} />
      )}
    </div>
  );
}