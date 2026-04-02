"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './princessos.css';

// Character data with custom distinct drop-shadow glows
const characters = [
  { id: 'princess', name: 'Princess', role: 'OS Assistant', clearance: 'Override', status: 'Learning...', image: '/princessos/princess.png', glow: 'drop-shadow(0 0 35px rgba(255, 105, 180, 0.8))' }, // Pink
  { id: 'adrian', name: 'Dr. Adrian Kovacs', role: 'Lead Scientist', clearance: 'Level 5', status: 'Restricted', image: '/princessos/adrian.png', glow: 'drop-shadow(0 0 25px rgba(173, 216, 230, 0.8)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))' }, // Blue-White
  { id: 'daniel', name: 'Daniel Reyes', role: 'Former Employee', clearance: 'Revoked', status: 'Missing', image: '/princessos/daniel.png', glow: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.9))' }, // White
  { id: 'elena', name: 'Elena Ward', role: 'HR Representative', clearance: 'Level 2', status: 'Active', image: '/princessos/elena.png', glow: 'drop-shadow(0 0 30px rgba(220, 20, 60, 0.9))' }, // Crimson
  { id: 'marcus', name: 'Marcus Hale', role: 'System Administrator', clearance: 'Level 4', status: 'Active', image: '/princessos/marcus.png', glow: 'drop-shadow(0 0 30px rgba(128, 0, 128, 0.9))' }, // Purple
  { id: 'noah', name: 'Noah Ibrahim', role: 'Cybersecurity', clearance: 'Level 4', status: 'Investigating', image: '/princessos/noah.png', glow: 'drop-shadow(0 0 25px rgba(139, 69, 19, 0.8)) drop-shadow(0 0 15px rgba(0, 0, 255, 0.6))' }, // Brown-Blue
  { id: 'rina', name: 'Rina Park', role: 'Coworker', clearance: 'Level 1', status: 'Active', image: '/princessos/rina.png', glow: 'drop-shadow(0 0 30px rgba(0, 0, 139, 0.9)) drop-shadow(0 0 15px rgba(0, 0, 0, 1))' }, // Dark Blue/Black mix
  { id: 'sophia', name: 'Sophia Bennett', role: 'Internal Comms', clearance: 'Level 3', status: 'Active', image: '/princessos/sophia.png', glow: 'drop-shadow(0 0 25px rgba(255, 0, 0, 0.7)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))' }, // Red-White
  { id: 'victor', name: 'Victor Sato', role: 'Internal Security', clearance: 'Level 5', status: 'Monitoring', image: '/princessos/victor.png', glow: 'drop-shadow(0 0 30px rgba(255, 255, 0, 0.8))' }, // Yellow
  { id: 'vivi', name: 'Vivi Tanaka', role: 'Developer', clearance: 'Level 4', status: 'Unresponsive', image: '/princessos/vivi.png', glow: 'drop-shadow(0 0 30px rgba(199, 21, 133, 0.9))' }, // Purple-Red
];

export default function PrincessOSPage() {
  const [activeChar, setActiveChar] = useState(characters[0]);
  const [viewMode, setViewMode] = useState<'roster' | 'overview'>('roster');
  
  // Audio state management
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Set atmosphere volume slightly lower
      // Attempt to auto-play on mount
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((err) => {
        // Browser blocked autoplay (needs user interaction first)
        console.log("Autoplay blocked pending user interaction", err);
        setIsAudioPlaying(false);
      });
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-300 font-sans selection:bg-pink-900 selection:text-white overflow-hidden scanlines">
      
      {/* BACKGROUND AUDIO ELEMENT */}
      <audio ref={audioRef} src="/princessos/music.mp3" loop className="hidden" />

      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')]"></div>

      {/* TOP NAVIGATION / HEADER */}
      <header className="relative z-20 w-full flex flex-col md:flex-row justify-between items-center p-6 md:p-8 border-b border-pink-900/30 bg-black/50 backdrop-blur-md">
        <div className="mb-4 md:mb-0 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-white uppercase glitch-text">
              Princess<span className="text-pink-600">OS</span>
            </h1>
            <p className="text-[10px] font-mono text-pink-500/70 mt-1 uppercase tracking-widest animate-warning">Submit or Survive.</p>
          </div>
          <Link href="/" className="text-xs font-mono px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white hover:border-pink-600 transition-all rounded">
            &lt; RETURN TO ROOT
          </Link>
        </div>
        
        <div className="flex gap-4 text-xs font-mono items-center">
          {/* AUDIO TOGGLE BUTTON */}
          <button 
            onClick={toggleAudio} 
            className={`transition-colors ${isAudioPlaying ? 'text-pink-500 hover:text-pink-400' : 'text-neutral-600 hover:text-neutral-400 animate-pulse'}`}
          >
            SYS.AUDIO:[{isAudioPlaying ? 'ON' : 'OFF'}]
          </button>
          
          <Link href="https://x.com/PrincessAzraiel" target="_blank" className="text-neutral-500 hover:text-pink-400 transition-colors">SYS.X_MAIN</Link>
          <Link href="https://x.com/AzraielExe" target="_blank" className="text-neutral-500 hover:text-pink-400 transition-colors">SYS.X_DEV</Link>
          <Link href="https://discord.gg/j6pCbYRJJ5" target="_blank" className="text-neutral-500 hover:text-[#5865F2] transition-colors">SYS.DISCORD</Link>
        </div>
      </header>

      {/* DEVELOPMENT NOTICE BANNER */}
      <div className="relative z-20 w-full border-b border-yellow-900/50 bg-yellow-950/20 backdrop-blur-md px-6 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <span className="text-yellow-500 font-mono text-xs font-bold uppercase tracking-widest shrink-0">[DEV NOTICE]</span>
        <p className="text-yellow-400/80 font-mono text-xs leading-relaxed">
          PrincessOS is currently in active development. Progress is slower than usual — this is an extremely large solo project and the developer is in the middle of exams until <span className="text-yellow-300 font-bold">07.06.2026</span>. Thank you for your patience.
        </p>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex flex-col lg:flex-row w-full h-auto lg:h-[calc(100vh-95px)]">
        
        {/* LEFT COLUMN: Controls & Roster */}
        <section className="w-full lg:w-1/3 flex flex-col border-r border-pink-900/30 bg-black/80">
          
          {/* View Toggle */}
          <div className="flex border-b border-pink-900/30">
            <button 
              onClick={() => setViewMode('roster')}
              className={`flex-1 py-4 text-xs font-mono tracking-widest transition-colors ${viewMode === 'roster' ? 'bg-pink-950/30 text-pink-400 border-b-2 border-pink-500' : 'text-neutral-600 hover:text-neutral-300'}`}
            >
              SUBJECT DATABASE
            </button>
            <button 
              onClick={() => setViewMode('overview')}
              className={`flex-1 py-4 text-xs font-mono tracking-widest transition-colors ${viewMode === 'overview' ? 'bg-pink-950/30 text-pink-400 border-b-2 border-pink-500' : 'text-neutral-600 hover:text-neutral-300'}`}
            >
              SYSTEM OVERVIEW
            </button>
          </div>

          {/* Roster View */}
          {viewMode === 'roster' && (
            <div className="flex-1 p-6 lg:p-8 lg:overflow-y-auto custom-scrollbar flex flex-col gap-2">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                {characters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => {
                      setActiveChar(char);
                      // Fallback: If they click a character, that's "user interaction", so we can start the music if it was blocked!
                      if (!isAudioPlaying && audioRef.current) {
                        audioRef.current.play();
                        setIsAudioPlaying(true);
                      }
                    }}
                    className={`flex-shrink-0 text-left px-4 py-3 border-l-2 transition-all duration-300 font-mono text-sm md:text-base whitespace-nowrap lg:whitespace-normal
                      ${activeChar.id === char.id 
                        ? 'border-pink-600 bg-pink-950/20 text-white pl-6' 
                        : 'border-neutral-800 text-neutral-500 hover:border-pink-900 hover:text-neutral-300 hover:bg-neutral-900/50'
                      }`}
                  >
                    {char.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lore / Overview View */}
          {viewMode === 'overview' && (
            <div className="flex-1 p-6 lg:p-8 lg:overflow-y-auto custom-scrollbar font-mono text-sm text-neutral-400 space-y-6 leading-relaxed">
              <h2 className="text-pink-500 font-bold uppercase tracking-widest text-lg">Submit or Survive.</h2>
              <p>
                Welcome to Apex Corporation. Your new role is simple: manage internal data, review archived materials, and maintain company records through your desktop interface.
              </p>
              <p>
                But routine office work is a façade. Files disappear. Corrupted fragments hint at an illicit project buried deep in the network. At the center of it all is <span className="text-pink-400 font-bold">Princess</span>—your AI assistant.
              </p>
              <p>
                Initially a guide, she is learning. Adapting. Forming attachments. As you uncover experimental human-AI interaction trials, the lines between assistant and observer blur.
              </p>
              <p className="text-neutral-500 border-l border-neutral-700 pl-4 italic">
                Everyone is watching. Who do you trust? The coworkers sending cryptic warnings? The vanished employee in the hidden terminal? Or the system itself?
              </p>
            </div>
          )}

          {/* Bottom Call to Action & Disclaimer */}
          <div className="p-6 lg:p-8 border-t border-pink-900/30 bg-black">
            <p className="text-[10px] font-mono text-neutral-600 mb-4 text-center uppercase tracking-widest border border-neutral-800 p-2">
              Note: All characters depicted are 18 years of age or older.
            </p>
            <Link 
              href="https://www.patreon.com/cw/PrincessAzraiel" 
              target="_blank" 
              className="block w-full text-center py-4 border border-pink-900/50 bg-pink-950/20 text-pink-500 font-mono text-sm hover:bg-pink-900 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,20,147,0.5)]"
            >
              [ INITIATE PATREON SUPPORT ]
            </Link>
          </div>
        </section>

        {/* RIGHT COLUMN: The Character Display */}
        <section className="relative w-full lg:w-2/3 h-[70vh] lg:h-full flex items-center justify-center overflow-hidden bg-neutral-950">
          
          {/* Background Name (Massive, faded) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[15rem] font-bold text-neutral-900/40 whitespace-nowrap tracking-tighter pointer-events-none select-none z-0 transition-all duration-500">
            {activeChar.name.split(' ')[0]}
          </div>

          {/* Character Silhouette Container */}
          <div className="relative z-10 w-full h-full flex items-end justify-center pb-0">
            <img 
              key={activeChar.id} 
              src={activeChar.image} 
              alt={activeChar.name} 
              style={{ filter: `brightness(0) ${activeChar.glow}` }}
              className="object-contain h-[85%] md:h-[95%] animate-float animate-in fade-in zoom-in-95 duration-700"
            />
          </div>

          {/* Character Info Overlay */}
          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 z-20 bg-black/80 border border-pink-900/50 p-6 backdrop-blur-md max-w-sm w-[calc(100%-3rem)] md:w-auto shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-1 uppercase tracking-tight">{activeChar.name}</h3>
            <p className="text-pink-500 font-mono text-sm mb-4">{activeChar.role}</p>
            
            <div className="space-y-2 font-mono text-xs md:text-sm text-neutral-400">
              <div className="flex justify-between border-b border-neutral-900 pb-1">
                <span>Clearance:</span>
                <span className="text-neutral-200">{activeChar.clearance}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-1">
                <span>Status:</span>
                <span className={activeChar.status === 'Missing' || activeChar.status === 'Unresponsive' ? 'text-pink-600 animate-pulse' : 'text-neutral-200'}>
                  {activeChar.status}
                </span>
              </div>
              <div className="flex justify-between pb-1 pt-2 text-neutral-600">
                <span>ID:</span>
                <span>APX-{Math.floor(Math.random() * 9000) + 1000}</span>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}