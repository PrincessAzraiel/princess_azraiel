"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ArrowLeft, Sparkles, Heart, Lock, Eye } from "lucide-react";
import { JSX } from "react/jsx-runtime";

// --- CONFIG ---
const STORAGE_KEY = "azraiel_total_tribute_v3";
const INCREMENT = 8;

// The duality of a Yandere: Sweet vs. Obsessive
const SWEET_PHRASES = ["Good Pet", "My Toy", "So Sweet", "Good Boy", "Good Girl", "More~", "Hehe <3", "Perfect"];
const YANDERE_PHRASES = ["MINE", "FOREVER", "NO ESCAPE", "ONLY ME", "DON'T LEAVE", "I SEE YOU", "LOCKED IN", "OBEY"];

// --- UTILS ---
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export default function YandereSendPage() {
  const [balance, setBalance] = useState(0);
  const [clicks, setClicks] = useState<number>(0);
  
  // Visual State
  const controls = useAnimation(); 
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; content: React.ReactNode; scale: number; type: 'money' | 'text' | 'heart' }[]>([]);

  // Load Balance
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setBalance(parseInt(stored));
  }, []);

  // Save Balance
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, balance.toString());
  }, [balance]);

  // --- THE OBSESSION TRIGGER ---
  const handleSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    // 1. Update Stats
    setBalance((prev) => prev + INCREMENT);
    setClicks((prev) => prev + 1);
    
    // 10% chance to trigger "Yandere Mode" (screen shake + scary text)
    const isPsychotic = Math.random() < 0.15; 
    const isCrit = (clicks + 1) % 10 === 0;

    // 2. Haptic Feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(isPsychotic ? [50, 50, 50] : 10);
    }

    // 3. Screen Shake (More violent if psychotic)
    controls.start({
      x: isPsychotic ? [-5, 5, -5, 5, 0] : [0, -2, 2, 0],
      y: isPsychotic ? [-5, 5, -5, 5, 0] : [0, -1, 1, 0],
      transition: { duration: isPsychotic ? 0.4 : 0.2 }
    });

    // 4. Spawn Particles
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    const newParticles: { id: number; x: number; y: number; content: string | JSX.Element; scale: number; type: "text" | "money" | "heart"; }[] = [];

    // Particle 1: The Money (Always appears)
    newParticles.push({ 
      id: id, 
      x, 
      y, 
      content: `+$${INCREMENT}`, 
      scale: 1, 
      type: 'money' as const 
    });

    // Particle 2: The Affirmation (Sweet or Scary)
    const phrase = isPsychotic ? pickRandom(YANDERE_PHRASES) : pickRandom(SWEET_PHRASES);
    newParticles.push({ 
      id: id + 1, 
      x: x + randomInt(-30, 30), 
      y: y + randomInt(-20, 20), 
      content: phrase, 
      scale: isPsychotic ? 1.5 : 0.9, 
      type: 'text' as const 
    });

    // Particle 3: Floating Hearts
    newParticles.push({
      id: id + 2,
      x: x + randomInt(-40, 40),
      y: y,
      content: <Heart className={`w-full h-full ${isPsychotic ? 'fill-red-600 text-red-600' : 'fill-pink-400 text-pink-400'}`} />,
      scale: randomInt(15, 25) / 10, // Using scale for size logic in render
      type: 'heart' as const
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Cleanup
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id && p.id !== id + 1 && p.id !== id + 2));
    }, 1200);
  };

  return (
    <motion.div 
      animate={controls}
      className="relative min-h-screen w-full overflow-hidden bg-[#050005] text-pink-50 selection:bg-pink-500 selection:text-black"
    >
      
      {/* --- STYLES --- */}
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

        @keyframes heartbeat {
          0% { transform: scale(1); opacity: 0.3; }
          15% { transform: scale(1.05); opacity: 0.4; }
          30% { transform: scale(1); opacity: 0.3; }
          45% { transform: scale(1.05); opacity: 0.45; }
          60% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        .animate-heartbeat {
          animation: heartbeat 3s infinite ease-in-out;
        }

        .glitch-text {
           text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
        }
      `}</style>

      {/* --- ATMOSPHERE --- */}
      <div className="scanlines" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-10 brightness-150 contrast-150" />
      
      {/* Heartbeat Background Glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[80vw] h-[80vw] bg-pink-900/10 rounded-full blur-[100px] animate-heartbeat" />
      </div>

      {/* Floating Background Hearts */}
      <FloatingHearts />

      {/* --- NAVIGATION --- */}
      <div className="absolute top-8 left-8 z-50">
        <Link href="/" className="group flex items-center gap-2 text-white/40 hover:text-pink-400 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-syncopate text-[10px] uppercase tracking-widest">Run Away</span>
        </Link>
      </div>

      {/* --- CONTENT --- */}
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6">
        
        <div className="w-full max-w-xl mx-auto space-y-12 text-center">

          {/* HEADER */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 border border-pink-500/30 bg-pink-950/30 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <div className="relative">
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500 animate-pulse" />
                <span className="absolute inset-0 bg-pink-500 blur-sm opacity-50 animate-pulse" />
              </div>
              <span className="font-syncopate text-[9px] uppercase tracking-[0.2em] text-pink-200">
                Heartbeat Synced
              </span>
            </div>
            
            <h1 className="font-italiana text-3xl text-white/80">
                Do you love me?
            </h1>
          </div>

          {/* THE BIG NUMBER */}
          <div className="relative py-8 group cursor-default select-none">
             {/* Spinning Eyes Ring */}
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-pink-500/5 animate-[spin_20s_linear_infinite] opacity-50 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2"><Eye className="w-4 h-4 text-pink-900" /></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2"><Eye className="w-4 h-4 text-pink-900" /></div>
             </div>

            <p className="font-syncopate text-[10px] text-pink-400/70 uppercase tracking-[0.5em] mb-4">
              Proof of Devotion
            </p>
            
            <motion.div 
              key={balance} 
              initial={{ scale: 1.15, textShadow: "0 0 20px rgba(236,72,153,0.8)" }}
              animate={{ scale: 1, textShadow: "0 0 0px rgba(236,72,153,0)" }}
              className="font-italiana text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-300 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]"
            >
              <span className="text-pink-500 text-5xl align-top mr-2">$</span>
              {balance.toLocaleString()}
            </motion.div>
          </div>

          {/* THE BUTTON */}
          <div className="relative w-full max-w-xs mx-auto h-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className="group relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-r from-pink-950/80 to-black border border-pink-500/50 hover:border-pink-400 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_3s_linear_infinite]" />
              
              <div className="relative z-10 flex items-center justify-center gap-3">
                <div className="p-2 bg-pink-500 rounded-full text-black shadow-lg group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left flex flex-col">
                  <span className="font-syncopate text-sm md:text-base font-bold text-white tracking-wider group-hover:text-pink-200">
                    OFFER DEVOTION
                  </span>
                  <span className="font-manrope text-[10px] text-pink-400/80 uppercase tracking-widest">
                    Cost: Soul + $8.00
                  </span>
                </div>
              </div>

              {/* Progress Bar / Blood fill effect */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-600 to-red-600 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left opacity-70" />

              {/* PARTICLE RENDERER (Inside button context) */}
              <AnimatePresence>
                {particles.map((p) => (
                  <FloatingParticle key={p.id} data={p} />
                ))}
              </AnimatePresence>

            </motion.button>
          </div>

          {/* RECENT STATUS - YANDERE DIALOGUE */}
          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
               {clicks > 0 && (
                 <motion.div
                    key={clicks}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-pink-500/20 backdrop-blur-sm"
                 >
                    {Math.random() > 0.8 ? (
                         <Lock className="w-3 h-3 text-red-500" />
                    ) : (
                         <Sparkles className="w-3 h-3 text-pink-400" />
                    )}
                    <span className={`font-manrope text-xs tracking-wider ${Math.random() > 0.8 ? 'text-red-300 font-bold glitch-text' : 'text-pink-200'}`}>
                       {Math.random() > 0.8 ? "YOU CAN NEVER LEAVE." : "Good puppy. She loves it."}
                    </span>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </motion.div>
  );
}

// --- SUBCOMPONENTS ---

function FloatingParticle({ data }: { data: { id: number; x: number; y: number; content: React.ReactNode; scale: number; type: 'money' | 'text' | 'heart' } }) {
  
  const isText = data.type === 'text';
  const isHeart = data.type === 'heart';
  const isMoney = data.type === 'money';
  
  // Scary text moves differently
  const isScary = isText && typeof data.content === 'string' && YANDERE_PHRASES.includes(data.content);

  const initialY = data.y;
  const targetY = initialY - (isHeart ? 150 : 100);
  const rotateEnd = isText ? (Math.random() * 20 - 10) : 0;

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: data.x, 
        y: initialY, 
        scale: 0,
        rotate: 0 
      }}
      animate={{ 
        opacity: [0, 1, 0], // fade in then out
        y: targetY, 
        scale: data.scale,
        rotate: rotateEnd 
      }}
      transition={{ 
        duration: isHeart ? 1.5 : 0.8, 
        ease: "easeOut",
        times: [0, 0.2, 1] 
      }}
      className={`absolute pointer-events-none whitespace-nowrap z-50 flex items-center justify-center ${
        isScary 
          ? "font-syncopate text-xl text-red-500 font-bold drop-shadow-[0_0_5px_rgba(255,0,0,0.8)] tracking-widest glitch-text" 
          : isText 
            ? "font-manrope text-sm text-pink-300 italic font-semibold"
            : isMoney
                ? "font-italiana text-2xl text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                : "text-pink-500" // Fallback for hearts
      }`}
      style={{ 
        left: 0, 
        top: 0,
        width: isHeart ? '20px' : 'auto', // Give hearts size
        height: isHeart ? '20px' : 'auto'
      }} 
    >
      {data.content}
    </motion.div>
  );
}

function FloatingHearts() {
    const [hearts, setHearts] = useState<any[]>([]);
  
    useEffect(() => {
      const count = 15;
      const newHearts = Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 5,
        size: 10 + Math.random() * 30,
        opacity: 0.05 + Math.random() * 0.15
      }));
      setHearts(newHearts);
    }, []);
  
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: h.opacity }}
            transition={{ 
                duration: h.duration, 
                repeat: Infinity, 
                delay: h.delay, 
                ease: "linear" 
            }}
            className="absolute text-pink-600 blur-[1px]"
            style={{
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
            }}
          >
            <Heart className="w-full h-full fill-current" />
          </motion.div>
        ))}
      </div>
    );
  }