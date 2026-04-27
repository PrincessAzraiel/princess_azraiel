"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

/* ──────────────────────────────────────────────
   DATA (Mapped to HTML classes & Grid spans)
────────────────────────────────────────────── */
const PROGRAMS = [
  { 
    num: '§ 01',
    title: 'Infection Protocol.', 
    titleSplit: ['Infection', 'Protocol.'],
    description: 'A new protocol, with 500 different links to click and over 5000 new images.', 
    link: '/infection',
    tag: 'FLAGSHIP',
    isNew: true,
    specs: ['500 LINKS', '5000 IMAGES'],
    variant: 'k-flag',
    gridClass: 'md:col-span-6 lg:col-span-4 min-h-[320px]'
  },
  { 
    num: '§ 02',
    title: 'SweetDrain.', 
    titleSplit: ['SweetDrain.'],
    description: 'A long edgeware session. Push your limits, embrace the void.', 
    link: 'https://gofile.io/d/ndMdxH',
    tag: 'LONG',
    isNew: false,
    specs: ['EDGEWARE', 'NO LIMITS'],
    variant: 'k-vip',
    gridClass: 'md:col-span-3 lg:col-span-2 lg:row-span-2 flex flex-col min-h-[320px]'
  },
  { 
    num: '§ 03',
    title: 'Heartbreak.exe', 
    titleSplit: ['Heartbreak', '.exe'],
    description: 'New Version of the LoveProtocol.exe. Now with more teeth.', 
    link: 'https://gofile.io/d/r0YYKc',
    tag: 'V2',
    isNew: false,
    specs: ['SHORT', 'UPDATED'],
    variant: 'k-exe',
    gridClass: 'md:col-span-3 lg:col-span-2'
  },
  { 
    num: '§ 04',
    title: 'Obedience Program.', 
    titleSplit: ['Obedience', 'Program.'],
    description: 'A 20-30-minute obedience trial. JOI.', 
    link: 'https://princessazraiel.itch.io/obedienceexe-advanced',
    tag: 'TRIAL',
    isNew: false,
    specs: ['20-30 MIN', 'ITCH.IO'],
    variant: 'k-exe',
    gridClass: 'md:col-span-3 lg:col-span-2'
  },
  { 
    num: '§ 05',
    title: 'Corruption Hub.', 
    titleSplit: ['Corruption', 'Hub.'],
    description: 'Ready to corrupt yourself? Enter the realm of Princess Azraiel.', 
    link: '/corruption',
    tag: 'WEB',
    isNew: false,
    specs: ['NO INSTALL', 'BROWSER'],
    variant: 'k-sys',
    gridClass: 'md:col-span-6 lg:col-span-4'
  },
  { 
    num: '§ 06',
    title: 'Love Protocol.', 
    titleSplit: ['Love', 'Protocol.'],
    description: 'A 2-minute love trial. Experience the thrill of devotion.', 
    link: 'https://gofile.io/d/qsbdzs',
    tag: 'BETA',
    isNew: false,
    specs: ['SHORT', 'DEVOTION'],
    variant: 'k-exe',
    gridClass: 'md:col-span-3 lg:col-span-2'
  },
  { 
    num: '§ 07',
    title: 'Her.exe', 
    titleSplit: ['Her', '.exe'],
    description: 'A 3-minute interactive experience. Enter the world of Princess Azraiel.', 
    link: 'https://gofile.io/d/yhQrNt',
    tag: 'ACT 01 & 02',
    isNew: false,
    specs: ['INTERACTIVE', '3 MIN'],
    variant: 'k-exe',
    gridClass: 'md:col-span-3 lg:col-span-2'
  },
  { 
    num: '§ 08',
    title: 'Drone.', 
    titleSplit: ['Drone.'],
    description: 'A browser extension that allows you to submit your devotion to ME.', 
    link: 'https://gofile.io/d/xW6gGR',
    tag: 'EXT',
    isNew: false,
    specs: ['BROWSER', 'ALWAYS ON'],
    variant: 'k-ext',
    gridClass: 'md:col-span-3 lg:col-span-2'
  },
  { 
    num: '§ 09',
    title: 'Gacha Extension.', 
    titleSplit: ['Gacha', 'Extension.'],
    description: 'Collect Gacha Points every time you interact with her posts. Spend them on nothing.', 
    link: 'https://gofile.io/d/Zeo7jG',
    tag: 'EXT',
    isNew: false,
    specs: ['BROWSER', 'POINTS'],
    variant: 'k-ext',
    gridClass: 'md:col-span-3 lg:col-span-3'
  },
  // { 
  //   num: '§ 10',
  //   title: 'Wallpaper Changer.', 
  //   titleSplit: ['Wallpaper', 'Changer.'],
  //   description: 'An Android app. Every few minutes it swaps your wallpaper for a new image of her. You will stop locking your phone.', 
  //   link: 'https://princessazraiel.itch.io/android-wallpaper-changer',
  //   tag: 'ANDROID APP',
  //   isNew: false,
  //   specs: ['APK', 'ANDROID'],
  //   variant: 'k-app',
  //   gridClass: 'md:col-span-6 lg:col-span-3'
  // }
];

export default function ProgramsPage() {
  return (
    <div className="crt-on relative min-h-screen w-full bg-[#050306] overflow-x-hidden selection:bg-pink-500 selection:text-black pb-24">
      
      {/* ─── STYLE ENGINE (HTML Standalone Mapping) ─── */}
      <style jsx global>{`
        :root {
          --bg: #050306;
          --ink: #fdf2f8;
          --pink: #ec4899;
          --pink-hot: #ff1493;
          --line: rgba(253, 242, 248, 0.08);
        }

        /* Background Layers */
        .bg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .bg-fill { background: var(--bg); }
        .bg-diag {
          background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.018) 0, rgba(255, 255, 255, 0.018) 1px, transparent 1px, transparent 50%);
          background-size: 28px 28px;
          z-index: 1;
        }
        .bg-scan {
          background-image: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.22) 50%), linear-gradient(90deg, rgba(255, 0, 128, 0.02), rgba(0, 229, 255, 0.008), rgba(255, 105, 235, 0.02));
          background-size: 100% 3px, 3px 100%;
          z-index: 3;
          opacity: 0.7;
        }
        .bg-grain { opacity: 0.04; z-index: 2; }
        .bg-grain::after {
          content: ''; position: absolute; inset: -200%; width: 400%; height: 400%;
          background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          animation: grainShift 0.5s steps(2) infinite;
        }

        .aurora { position: fixed; border-radius: 50%; pointer-events: none; z-index: 1; filter: blur(170px); animation: aurora 18s ease-in-out infinite; will-change: transform; }
        .aurora.a1 { top: -10%; left: -10%; width: 60vw; height: 60vw; background: rgba(134, 25, 143, 0.15); }
        .aurora.a2 { bottom: -20%; right: -10%; width: 50vw; height: 50vw; background: rgba(131, 24, 67, 0.12); animation-delay: -9s; }

        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-5%, -5%); }
          50% { transform: translate(-8%, 4%); }
          75% { transform: translate(4%, -8%); }
          100% { transform: translate(8%, 8%); }
        }
        @keyframes aurora {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, -6%) scale(1.07); }
          66% { transform: translate(-3%, 5%) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blink { 0%, 70% { opacity: 1; } 71%, 100% { opacity: 0.2; } }
        .blink { animation: blink 1.1s infinite; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fu { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity; }

        /* Monitor / Terminal Header CSS */
        .monitor {
          background: rgba(10, 4, 8, 0.78); border: 1px solid rgba(236, 72, 153, 0.25); border-radius: 10px; overflow: hidden;
          box-shadow: 0 30px 80px -20px rgba(236, 72, 153, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.02); backdrop-filter: blur(8px); position: relative;
        }
        .monitor::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.18) 50%); background-size: 100% 3px; }

        /* ─── EXACT HTML PCARD STYLES ─── */
        .pcard {
          position: relative; display: flex; flex-direction: column; padding: 28px;
          border-radius: 14px; border: 1px solid rgba(236,72,153,0.15);
          background: rgba(10,4,8,0.6); overflow: hidden; text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1); backdrop-filter: blur(10px);
        }
        .pcard::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%);
          background-size: 100% 3px; opacity: 0.5; z-index: 0;
        }
        .pcard:hover {
          transform: translateY(-4px); border-color: rgba(236,72,153,0.4);
          box-shadow: 0 12px 30px rgba(236,72,153,0.15); background: rgba(15,5,10,0.8);
        }
        .pcard .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: auto; position: relative; z-index: 2; }
        .pcard .num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(236,72,153,0.5); letter-spacing: 0.2em; }
        .pcard .chip { font-family: 'Syncopate', sans-serif; font-size: 8px; letter-spacing: 0.3em; padding: 4px 8px; border-radius: 4px; background: rgba(236,72,153,0.1); color: #ec4899; font-weight: 700; text-transform: uppercase; }
        .pcard .chip.new { background: #ff1493; color: #000; animation: blink 2s infinite; }
        .pcard .name { font-family: 'Italiana', serif; font-size: 28px; color: #fdf2f8; margin: 32px 0 12px; position: relative; z-index: 2; line-height: 1; letter-spacing: -0.01em; }
        .pcard .name em { color: #ec4899; font-style: italic; }
        .pcard .desc { font-family: 'Manrope', sans-serif; font-size: 13px; color: rgba(253,242,248,0.5); line-height: 1.6; margin-bottom: 24px; position: relative; z-index: 2; max-width: 95%; }
        .pcard .specs { display: flex; gap: 14px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(253,242,248,0.3); letter-spacing: 0.1em; position: relative; z-index: 2; margin-bottom: 28px; text-transform: uppercase; }
        .pcard .submit { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(236,72,153,0.2); padding-top: 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(236,72,153,0.6); letter-spacing: 0.2em; position: relative; z-index: 2; transition: color 0.3s; text-transform: uppercase; }
        .pcard:hover .submit { color: #ff1493; }
        .pcard .arr { transition: transform 0.3s; font-family: sans-serif; }
        .pcard:hover .arr { transform: translateX(6px); }

        /* PCard Variants */
        .k-flag { background: linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(10,4,8,0.9) 60%); border-color: rgba(236,72,153,0.3); }
        .k-flag .name { font-size: 42px; }
        .k-vip { background: #070307; border-color: rgba(236,72,153,0.3); }
        .k-vip .name { font-size: 34px; margin-top: auto; }
        .k-sys { background: rgba(20,5,15,0.4); border-left: 2px solid #ec4899; }
        .k-exe { background: #090609; }
        .k-ext { background: #050305; border-style: dashed; }
        .k-app { background: linear-gradient(to top, rgba(236,72,153,0.05), transparent); }

        /* Animation delays */
        .d0 { animation-delay: 0s; } .d1 { animation-delay: 0.1s; } .d2 { animation-delay: 0.2s; } .d3 { animation-delay: 0.3s; }
      `}</style>

      {/* ─── BG Elements ─── */}
      <div className="bg-layer bg-fill" />
      <div className="bg-layer bg-diag" />
      <div className="bg-layer bg-grain" />
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="bg-layer bg-scan crt" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(140%_100%_at_50%_50%,transparent_55%,rgba(0,0,0,0.6)_100%)]" />

      <FloatingHearts />

      {/* ─── CONTENT CONTAINER ─── */}
      <main className="relative z-10 pt-32 px-6 max-w-[1200px] mx-auto min-h-screen flex flex-col">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto w-full mb-16 text-center">
          <div className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.02] backdrop-blur px-4 py-1.5 rounded-full mb-8">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500" />
            </span>
            <span className="font-syncopate text-[8px] uppercase tracking-[0.44em] text-white/40">
              System Directory · § 01
            </span>
          </div>

          <h1 className="font-italiana text-[3.5rem] sm:text-[5rem] md:text-[6rem] leading-[0.85] tracking-tight text-white mb-6">
            The <em className="text-pink-500 not-italic">Archives.</em>
          </h1>
          <p className="font-manrope text-sm sm:text-base text-pink-100/60 max-w-xl mx-auto mb-10">
            Ten programs. All hers. All yours to install. Choose your poison, pet.
          </p>

          {/* System Warning Terminal */}
          <div className="monitor text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-pink-500/15 font-mono text-[9px] tracking-[0.16em] text-pink-100/50 uppercase">
              <div className="flex gap-1.5">
                <i className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <i className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <i className="w-2 h-2 rounded-full bg-[#28c840]" />
              </div>
              <span className="flex-1 text-center">system_warning.log</span>
            </div>
            <div className="p-4 sm:p-5 font-mono text-[11px] leading-[1.8] text-[#fbcfe8]">
              <div className="flex gap-2">
                <Terminal className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-pink-500">azraiel@sanctuary:~$</span> cat README.txt
                  <br />
                  <span className="text-pink-100/40"># These programs do not require currency.</span>
                  <br />
                  <span className="text-pink-100/40"># They demand complete cognitive submission.</span>
                  <br />
                  <span className="text-[#facc15]">WARNING:</span> Instructions contained within are absolute.<span className="inline-block w-[7px] h-[12px] bg-pink-500 align-[-1px] ml-[3px] blink"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── HTML GRID MAPPING ─── */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {PROGRAMS.map((prog, i) => {
            const isExternal = prog.link.startsWith("http");
            // Stagger animation based on index
            const delayClass = `d${i % 4}`;

            return (
              <Link 
                key={i} 
                href={prog.link}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`pcard ${prog.variant} fu ${delayClass} ${prog.gridClass}`}
              >
                <div className="head">
                  <span className="num">{prog.num}</span>
                  <span className={`chip ${prog.isNew ? 'new' : ''}`}>{prog.tag}</span>
                </div>
                
                <h2 className="name">
                  {prog.titleSplit[0]} <em>{prog.titleSplit.slice(1).join(' ')}</em>
                </h2>
                
                <p className="desc">
                  {prog.description}
                </p>
                
                <div className="specs">
                  {prog.specs.map((spec, sIdx) => (
                    <span key={sIdx}>{spec}</span>
                  ))}
                </div>

                <div className="submit">
                  <span>[ Submit ]</span>
                  <span className="arr">→</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer Return */}
        <div className="mt-20 pt-10 border-t border-white/[0.08] text-center pb-10">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 font-syncopate text-[9px] tracking-[0.3em] uppercase text-white/30 hover:text-pink-400 transition-colors duration-300"
          >
            <ArrowRight className="w-3 h-3 rotate-180" />
            Return to Root
          </Link>
        </div>

      </main>
    </div>
  );
}

/* ──────────────────────────────────────────────
   FLOATING HEARTS
────────────────────────────────────────────── */
type Heart = { id: number; left: number; dur: number; delay: number; size: number; op: number; };

function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setHearts(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i, left: Math.random() * 100, dur: 15 + Math.random() * 20, delay: Math.random() * 16, size: 7 + Math.random() * 15, op: 0.02 + Math.random() * 0.08,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-[-10%] text-pink-500 will-change-transform"
          style={{
            left: `${h.left}%`, width: h.size, height: h.size, opacity: h.op,
            animation: `floatUp ${h.dur}s linear ${h.delay}s infinite`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { opacity: var(--tw-bg-opacity, 0.5); }
          100% { transform: translateY(-115vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}