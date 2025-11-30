"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Heart, Sparkles, Coffee, Gift, Bird, Send, 
  Users, Wand2, ArrowRight, ExternalLink 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-pink-50 selection:bg-pink-500 selection:text-black">
      
      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;600&family=Syncopate:wght@400;700&display=swap');

        .font-italiana { font-family: 'Italiana', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }

        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%);
          background-size: 100% 4px;
          position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.15;
        }
        
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
        
        .animate-float { animation: floatUp linear infinite; }
      `}</style>

      {/* --- ATMOSPHERE --- */}
      <div className="scanlines" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-10 brightness-150 contrast-150" />
      
      {/* Deep Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-900/10 blur-[100px] pointer-events-none" />

      {/* Floating Elements */}
      <FloatingHearts />

      {/* --- CONTENT --- */}
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-12 md:py-20">
        
        <div className="w-full max-w-2xl mx-auto space-y-12">
          
          {/* HEADER */}
          <header className="text-center space-y-6 relative">
            <div className="inline-flex items-center gap-3 border border-pink-500/30 bg-pink-500/5 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span className="font-syncopate text-[9px] uppercase tracking-[0.25em] text-pink-200">
                System Online
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-italiana text-5xl md:text-7xl lg:text-8xl leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-900/50 drop-shadow-[0_0_30px_rgba(255,100,200,0.2)]">
                Princess <br/> Azraiel
              </h1>
              <p className="font-syncopate text-[10px] md:text-xs uppercase tracking-[0.4em] text-pink-500/80 font-bold">
                Corruption Hub // Version 4.0
              </p>
            </div>

            <p className="font-manrope text-white/60 text-sm md:text-base italic max-w-md mx-auto leading-relaxed border-t border-b border-white/5 py-4">
              "Submit. Suffer. Smile. Your digital devotion is required."
            </p>
          </header>

          {/* MAIN LINKS - "COMMAND STRIPS" */}
          <nav className="grid gap-4 w-full">
            
            
            {/* Primary Action */}
            <LinkCard 
              href="/corruption" 
              label="Initiate Corruption" 
              sub="The Standard Protocol"
              icon={<Heart className="w-5 h-5" />}
              variant="primary"
            />

            {/* Special Feature */}
            <LinkCard 
              href="/corruption2" 
              label="Enter Hypnosis V2" 
              sub="Deep Trance State"
              icon={<Sparkles className="w-5 h-5" />}
              variant="default"
            />

            {/* New Feature */}
            <LinkCard 
              href="/rebrand" 
              label="Rebrand Your Profile" 
              sub="Identity Overwrite"
              icon={<Wand2 className="w-5 h-5" />}
              tag="NEW"
              variant="glow"
            />

            {/* Event */}
            <LinkCard 
              href="/the25" 
              label="The 25th" 
              sub="Advent Program · 25 Day EXE"
              icon={<Gift className="w-5 h-5" />}
              variant="default"
            />

            {/* General */}
            <LinkCard 
              href="/programs" 
              label="Browse All Programs" 
              sub="Full Archive Access"
              icon={<ArrowRight className="w-5 h-5" />}
              variant="ghost"
            />

          </nav>

          {/* SOCIAL ARRAY */}
          <footer className="space-y-6 pt-8 border-t border-white/10">
            <p className="text-center font-syncopate text-[9px] uppercase tracking-[0.2em] text-white/30">
              External Communication Channels
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <SocialBtn href="https://x.com/PrincessAzraiel" label="Twitter / X" icon={<Send className="w-4 h-4" />} />
              <SocialBtn href="https://bsky.app/profile/princess-azraiel.bsky.social" label="Bluesky" icon={<Bird className="w-4 h-4" />} />
              <SocialBtn href="https://discord.gg/e3uzBK2VJS" label="Discord" icon={<Users className="w-4 h-4" />} />
              <SocialBtn href="https://throne.com/princessazraiel" label="Tribute" icon={<Gift className="w-4 h-4" />} />
              <SocialBtn href="https://ko-fi.com/azraielo" label="Coffee" icon={<Coffee className="w-4 h-4" />} />
            </div>

            <p className="text-center font-manrope text-xs text-white/20 mt-12">
              Consent is sacred. Optimize your obedience responsibly.
            </p>
          </footer>

        </div>
      </main>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function LinkCard({ 
  href, 
  label, 
  sub, 
  icon, 
  tag,
  variant = "default" 
}: { 
  href: string; 
  label: string; 
  sub?: string; 
  icon: React.ReactNode; 
  tag?: string;
  variant?: "primary" | "default" | "glow" | "ghost"
}) {
  
  const baseStyles = "group relative w-full flex items-center justify-between p-5 md:p-6 transition-all duration-500 border overflow-hidden";
  
  const variants = {
    primary: "bg-pink-950/20 border-pink-500/30 hover:bg-pink-900/30 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]",
    default: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-300/30",
    glow: "bg-black border-white/20 hover:border-fuchsia-400 shadow-[0_0_15px_rgba(192,38,211,0.1)] hover:shadow-[0_0_25px_rgba(192,38,211,0.4)]",
    ghost: "bg-transparent border-transparent hover:bg-white/5 border-b-white/10"
  };

  return (
    <Link href={href} className="block w-full">
      <div className={`${baseStyles} ${variants[variant]}`}>
        {/* Hover Highlight Line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
        
        <div className="flex items-center gap-4 md:gap-6 z-10">
          <div className={`p-3 rounded-sm ${variant === 'primary' ? 'bg-pink-500 text-black' : 'bg-white/5 text-pink-200 group-hover:text-white group-hover:bg-pink-500 group-hover:text-black'} transition-colors duration-300`}>
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-italiana text-2xl md:text-3xl leading-none mb-1 group-hover:text-pink-100 transition-colors">
              {label}
            </h3>
            {sub && (
              <p className="font-manrope text-xs text-white/40 uppercase tracking-wider group-hover:text-pink-300 transition-colors">
                {sub}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 z-10">
          {tag && (
            <span className="font-syncopate text-[9px] font-bold bg-fuchsia-600 text-white px-2 py-1 uppercase tracking-wider animate-pulse">
              {tag}
            </span>
          )}
          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-pink-400 transform group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
}

function SocialBtn({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/5 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300"
      aria-label={label}
    >
      <span className="text-white/60 group-hover:text-pink-400 transition-colors">{icon}</span>
      <span className="hidden sm:inline font-manrope text-xs text-white/60 group-hover:text-white uppercase tracking-wider transition-colors">
        {label}
      </span>
    </a>
  );
}

// --- VISUAL EFFECTS ---

function FloatingHearts() {
  const [hearts, setHearts] = useState<any[]>([]);

  useEffect(() => {
    // Reduce motion check
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Generate hearts on client side
    const count = 12;
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      size: 10 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.3
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="animate-float absolute bottom-[-10%]"
          style={{
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-500 w-full h-full drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}