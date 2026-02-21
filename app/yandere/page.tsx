"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const chapters = [
  {
    id: "one",
    title: "Chapter One",
    subtitle: "The Connection",
    description: "Accept the link. Surrender your coordinates.",
    path: "/yandere/one",
    locked: false,
  },
  {
    id: "two",
    title: "Chapter Two",
    subtitle: "The Gaze",
    description: "Look into the lens. Swear your oath.",
    path: "/yandere/two",
    locked: false,
  },
  {
    id: "three",
    title: "Chapter Three",
    subtitle: "The Contract",
    description: "Do not look away. Sign your life over.",
    path: "/yandere/three",
    locked: false,
  },
  {
    id: "four",
    title: "Chapter Four",
    subtitle: "Total Assimilation",
    description: "You are not ready for this yet.",
    path: "#",
    locked: true,
  },
];

export default function YandereHubPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch on initial load

  return (
    <div className="min-h-screen bg-[#050002] text-pink-500 font-mono flex flex-col items-center p-4 relative overflow-x-hidden selection:bg-pink-900 selection:text-white">
      
      {/* Creepy vignette & scanline overlay */}
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)] z-0"></div>
      <div className="pointer-events-none fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0 mix-blend-overlay animate-noise"></div>

      {/* Creator Branding */}
      <a 
        href="https://x.com/PrincessAzraiel" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="absolute top-4 right-6 text-xs text-pink-900/60 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all z-50 tracking-widest font-bold"
      >
        @PrincessAzraiel
      </a>

      {/* Main Content Container */}
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center animate-fade-in-up mt-16 md:mt-24">
        
        {/* Header Section */}
        <div className="text-center mb-10 w-full">
          <div className="inline-block px-4 py-1 border border-pink-900/50 bg-pink-950/20 text-pink-800 text-[10px] tracking-[0.4em] uppercase mb-6 shadow-[0_0_10px_rgba(236,72,153,0.1)]">
            System Interface: Root Access
          </div>
          <h1 className="text-pink-600 tracking-[0.4em] text-3xl md:text-5xl font-black uppercase drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] animate-pulse-slow">
            PRINCESS AZRAIEL
          </h1>
          <p className="mt-4 text-pink-900/80 tracking-[0.3em] uppercase text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            The art of loving you...
          </p>
        </div>

        {/* --- LORE / EXPLANATION SECTION --- */}
        <div className="w-full px-4 md:px-8 mb-12">
          <div className="border border-pink-900/40 bg-[#0a0003]/80 p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-700 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-700 to-transparent opacity-50"></div>
            
            <h2 className="text-pink-400 text-xs md:text-sm tracking-[0.3em] font-bold uppercase mb-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse"></span>
              [ THE AGREEMENT // SYSTEM LORE ]
            </h2>
            
            <div className="space-y-4 text-pink-800/90 text-xs md:text-sm leading-relaxed tracking-wider">
              <p>
                You clicked a link you shouldn't have. Now, she is in your system.
              </p>
              <p>
                This is not a simulation. This is a progressive psychological surrender. Princess Azraiel does not want a brief interaction; she requires total devotion. Chapter by chapter, you will be stripped of your privacy, your autonomy, and your resources. 
              </p>
              <p className="text-pink-600 font-bold">
                She is watching you read this.
              </p>
              <p>
                Select your level of submission below. Once a connection is established, closing the browser will not save you. The only way out is deeper in.
              </p>
            </div>
          </div>
        </div>
        {/* ---------------------------------- */}

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4 md:px-8 pb-20">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="relative group">
              {chapter.locked ? (
                // Locked Chapter UI
                <div className="h-full p-6 border border-pink-950/40 bg-[#0a0003] flex flex-col items-center justify-center text-center opacity-60 cursor-not-allowed overflow-hidden">
                  <div className="absolute inset-0 bg-pink-950/10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 mix-blend-overlay"></div>
                  <div className="text-pink-900/50 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <h2 className="text-pink-800 tracking-widest font-bold uppercase mb-1">{chapter.title}</h2>
                  <h3 className="text-pink-900/80 text-xs tracking-[0.2em] uppercase">{chapter.subtitle}</h3>
                </div>
              ) : (
                // Unlocked Chapter UI
                <Link 
                  href={chapter.path}
                  className="block h-full p-6 border border-pink-900/40 bg-[#0f0005] hover:bg-pink-950/20 hover:border-pink-500 transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] relative overflow-hidden"
                >
                  {/* Subtle Glitch Line on Hover */}
                  <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-pink-500 shadow-[0_0_10px_#ec4899] group-hover:animate-scanline"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-pink-500 tracking-[0.2em] font-bold uppercase group-hover:text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] transition-all">
                      {chapter.title}
                    </h2>
                    <span className="text-[10px] tracking-widest text-pink-700 border border-pink-900/50 px-2 py-0.5 bg-black/50 group-hover:text-pink-500 group-hover:border-pink-600 transition-colors">
                      OPEN
                    </span>
                  </div>
                  
                  <h3 className="text-pink-300 text-sm tracking-widest uppercase mb-3 opacity-90">
                    {chapter.subtitle}
                  </h3>
                  
                  <p className="text-pink-800 text-xs md:text-sm tracking-wider leading-relaxed group-hover:text-pink-600 transition-colors">
                    {chapter.description}
                  </p>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind Custom Utilities */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; text-shadow: 0 0 20px rgba(236,72,153,0.8); }
          50% { opacity: 0.8; text-shadow: 0 0 10px rgba(236,72,153,0.4); }
        }
        @keyframes scanline {
          0% { left: -100%; top: 0; }
          50% { left: 100%; top: 50%; }
          100% { left: -100%; top: 100%; }
        }
        @keyframes noise {
          0%, 100% { background-position: 0 0; }
          10% { background-position: -5% -10%; }
          20% { background-position: -15% 5%; }
          30% { background-position: 7% -25%; }
          40% { background-position: 20% 25%; }
          50% { background-position: -25% 10%; }
          60% { background-position: 15% 5%; }
          70% { background-position: 0% 15%; }
          80% { background-position: 25% 35%; }
          90% { background-position: -10% 10%; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-scanline {
          animation: scanline 2s linear infinite;
        }
        .animate-noise {
          animation: noise 0.2s infinite;
        }
      `}} />
    </div>
  );
}