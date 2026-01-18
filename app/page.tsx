"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Heart, Sparkles, Coffee, Gift, Bird, Send, 
  Users, Wand2, ArrowRight, ShoppingBag, Globe, Zap 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#030303] text-pink-50 selection:bg-pink-500 selection:text-black">
      
      {/* --- VISUAL ENGINE --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;600&family=Syncopate:wght@400;700&display=swap');

        .font-italiana { font-family: 'Italiana', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }

        /* Tech Background Grid */
        .tech-grid {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }

        /* Floating Animation */
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { opacity: 0.5; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
        .animate-float { animation: floatUp linear infinite; }

        /* Border Flow for Special Cards */
        @keyframes borderFlow {
          0% { border-color: rgba(236, 72, 153, 0.3); box-shadow: 0 0 5px rgba(236,72,153,0.1); }
          50% { border-color: rgba(236, 72, 153, 0.8); box-shadow: 0 0 20px rgba(236,72,153,0.4); }
          100% { border-color: rgba(236, 72, 153, 0.3); box-shadow: 0 0 5px rgba(236,72,153,0.1); }
        }
        .animate-border-flow { animation: borderFlow 3s ease-in-out infinite; }
        
        /* Shimmer Animation */
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(150%) skewX(-12deg); }
        }
      `}</style>

      {/* --- LAYERS --- */}
      <div className="fixed inset-0 bg-[#050505]" />
      <div className="fixed inset-0 tech-grid pointer-events-none z-0" />
      {/* Increased contrast on noise for texture through glass */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 pointer-events-none z-10 brightness-100 contrast-150 mix-blend-overlay" />
      
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-900/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none z-0" />

      <FloatingHearts />

      {/* --- MAIN INTERFACE --- */}
      <main className="relative z-20 min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-16">
        
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* === LEFT: IDENTITY MODULE === */}
          <section className="w-full lg:w-[35%] lg:sticky lg:top-24 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            
            {/* Holographic Panel Container - Now with Premium Glass */}
            <SpotlightCard className="w-full rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] group">
              {/* Inner Specular Highlight (The "Glass Edge" look) */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
              
              <div className="relative z-10 p-8 md:p-10">
              
                {/* Decorative Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-pink-500/50 rounded-tl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-pink-500/50 rounded-br-lg" />

                {/* Status Badge */}
                <div className="inline-flex items-center gap-3 border border-pink-500/30 bg-pink-950/40 px-4 py-1.5 rounded-full mb-8 shadow-[0_0_15px_rgba(236,72,153,0.1)] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="font-syncopate text-[9px] uppercase tracking-[0.25em] text-pink-100">
                    System Online
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-2 mb-8 relative z-10">
                  <h1 className="font-italiana text-6xl md:text-7xl leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-950/80 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                    Princess <br/> Azraiel
                  </h1>
                  <div className="h-px w-24 bg-gradient-to-r from-pink-500 to-transparent mx-auto lg:mx-0 my-4" />
                  <p className="font-syncopate text-[10px] md:text-xs uppercase tracking-[0.3em] text-pink-400 font-bold text-shadow-sm">
                    Corruption Hub // V4.1
                  </p>
                </div>

                {/* Quote */}
                <p className="font-manrope text-pink-50/80 text-sm md:text-base italic leading-relaxed mb-8 drop-shadow-md">
                  "Submit. Suffer. Smile.<br/> Your digital devotion is required."
                </p>

                {/* Social Icons Grid */}
                <div className="grid grid-cols-5 gap-3 pt-6 border-t border-white/5 relative z-20">
                  <SocialBtn href="https://x.com/PrincessAzraiel" icon={<Send className="w-4 h-4" />} />
                  <SocialBtn href="https://bsky.app/profile/princess-azraiel.bsky.social" icon={<Bird className="w-4 h-4" />} />
                  <SocialBtn href="https://discord.gg/e3uzBK2VJS" icon={<Globe className="w-4 h-4" />} />
                  <SocialBtn href="https://throne.com/princessazraiel" icon={<Gift className="w-4 h-4" />} />
                  <SocialBtn href="https://ko-fi.com/princessazraiel" icon={<Coffee className="w-4 h-4" />} />
                </div>
              </div>
            </SpotlightCard>

            <p className="hidden lg:block font-manrope text-xs text-white/30 pl-4 border-l border-white/10">
              Consent is sacred. <br/> Optimize your obedience.
            </p>
          </section>


          {/* === RIGHT: COMMAND GRID === */}
          <nav className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. HERO LINK (Full Width) */}
            <div className="md:col-span-2">
              <LinkCard 
                href="/corruption" 
                label="Initiate Corruption" 
                sub="The Standard Protocol"
                icon={<Heart className="w-6 h-6" />}
                variant="primary"
                isHero
              />
            </div>

            {/* 2. COMMUNITY (High Priority) */}
            <LinkCard 
              href="https://discord.gg/q9nsnSKvtu" 
              label="Domina" 
              sub="Elite Community"
              icon={<Users className="w-5 h-5" />}
              tag="JOIN NOW"
              variant="glow"
            />

            {/* 3. TRIBUTE (Money) */}
            <LinkCard 
              href="https://youpay.me/PrincessAzraiel" 
              label="Send Tribute" 
              sub="Secure Transfer"
              icon={<ShoppingBag className="w-5 h-5" />}
              variant="glass"
            />

            {/* 4. HYPNOSIS */}
            <LinkCard 
              href="/corruption2" 
              label="Hypnosis V2" 
              sub="Deep Trance"
              icon={<Sparkles className="w-5 h-5" />}
              variant="glass"
            />

            {/* 5. REBRAND */}
            <LinkCard 
              href="/rebrand" 
              label="Rebrand Profile" 
              sub="Identity Overwrite"
              icon={<Wand2 className="w-5 h-5" />}
              variant="glass"
            />

            {/* 6. EVENT */}
            <LinkCard 
              href="/infection" 
              label="Infection Protocol" 
              sub="A group of bots that will ruin you slowly over time"
              icon={<Zap className="w-5 h-5" />}
              variant="ghost"
            />

            {/* 7. ARCHIVES */}
            <LinkCard 
              href="/programs" 
              label="Archives" 
              sub="All Programs"
              icon={<ArrowRight className="w-5 h-5" />}
              variant="ghost"
            />
            
            {/* Mobile Footer */}
            <div className="md:hidden col-span-1 pt-12 text-center pb-10">
               <p className="font-manrope text-xs text-white/20">
                Consent is sacred. Optimize your obedience.
              </p>
            </div>

          </nav>

        </div>
      </main>
    </div>
  );
}

// --- REACTIVE SPOTLIGHT WRAPPER ---
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    
    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* PREMIUM GLASS UPGRADE: 
        1. backdrop-saturate: makes colors behind glass pop
        2. shadow-inset: adds the 'thick glass' top edge reflection
      */}
      
      {/* The Spotlights */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(236, 72, 153, 0.1), transparent 40%)`,
        }}
      />
      {/* The Border Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(236, 72, 153, 0.5), transparent 40%)`,
          maskImage: `linear-gradient(black, black) content-box, linear-gradient(black, black)`,
          maskComposite: `exclude`,
          WebkitMaskComposite: `xor`,
          padding: '1px'
        }}
      />
      
      {children}
    </div>
  );
}


// --- SOPHISTICATED LINK CARD ---

function LinkCard({ 
  href, 
  label, 
  sub, 
  icon, 
  tag,
  variant = "glass",
  isHero = false
}: { 
  href: string; 
  label: string; 
  sub?: string; 
  icon: React.ReactNode; 
  tag?: string;
  variant?: "primary" | "glass" | "glow" | "ghost";
  isHero?: boolean;
}) {
  
  const baseStyles = `
    group relative w-full h-full flex flex-col justify-between 
    transition-all duration-500 ease-out 
    ${isHero ? 'p-8 md:p-10' : 'p-6'}
  `;
  
  // VISUAL VARIANTS - GLASS UPGRADED
  const variants = {
    // Primary: Deep, rich dark glass with strong border
    primary: `
      bg-gradient-to-br from-pink-950/60 via-black/80 to-black/90 
      backdrop-blur-xl backdrop-saturate-150
      border border-pink-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
    `,
    
    // Glass: The "Vision Pro" style lighter glass
    glass: `
      bg-gradient-to-b from-white/[0.08] to-white/[0.01] 
      backdrop-blur-xl backdrop-saturate-150
      border border-white/10 
      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
      hover:bg-white/[0.05]
    `,
    
    // Glow: High activity state
    glow: `
      bg-black/80 backdrop-blur-xl 
      animate-border-flow border border-pink-500 
      shadow-[inset_0_0_20px_rgba(236,72,153,0.1)]
    `,
    
    // Ghost: Subtle, blends in more
    ghost: `
      bg-transparent border border-white/5 
      hover:bg-white/[0.03] hover:border-white/10 
      opacity-70 hover:opacity-100 backdrop-blur-sm
    `
  };

  const isExternal = href.startsWith('http');

  return (
    <Link href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="block w-full h-full perspective-1000">
      <SpotlightCard className={`h-full rounded-xl ${variants[variant]}`}>
        <div className={baseStyles}>
        
          {/* Animated Background Shimmer for Primary/Glow */}
          {(variant === 'primary' || variant === 'glow') && (
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent -skew-x-12 w-[200%] animate-[shimmer_3s_infinite] pointer-events-none" />
            </div>
          )}

          {/* Top Row: Icon + Arrow */}
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`
              p-3 rounded-lg transition-all duration-300 border border-white/5
              ${variant === 'primary' || variant === 'glow' 
                ? 'bg-pink-500 text-black shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
                : 'bg-white/5 text-pink-200 group-hover:bg-pink-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]'}
            `}>
              {icon}
            </div>
            
            <div className="flex items-center gap-2">
              {tag && (
                <span className="font-syncopate text-[8px] font-bold bg-fuchsia-600/90 backdrop-blur text-white px-2 py-1 uppercase tracking-wider rounded shadow-lg shadow-pink-500/20">
                  {tag}
                </span>
              )}
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-pink-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>

          {/* Bottom Row: Text */}
          <div className="relative z-10">
            <h3 className={`font-italiana leading-none mb-1 group-hover:text-white transition-colors drop-shadow-md ${isHero ? 'text-4xl' : 'text-2xl'}`}>
              {label}
            </h3>
            {sub && (
              <p className="font-manrope text-[10px] md:text-xs text-white/50 uppercase tracking-widest group-hover:text-pink-300 transition-colors">
                {sub}
              </p>
            )}
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}

function SocialBtn({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      // Added glass effect to social buttons too
      className="group flex items-center justify-center w-full aspect-square bg-white/[0.03] backdrop-blur-md border border-white/5 hover:border-pink-500 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all duration-300 rounded-lg relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="text-white/60 group-hover:text-pink-400 transition-colors transform group-hover:scale-110 duration-300 relative z-10">{icon}</span>
    </a>
  );
}

// --- BACKGROUND EFFECTS ---

function FloatingHearts() {
  const [hearts, setHearts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = 15;
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 12 + Math.random() * 20,
      delay: Math.random() * 10,
      size: 10 + Math.random() * 25,
      opacity: 0.05 + Math.random() * 0.2
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