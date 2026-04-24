"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Terminal } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/";

  // Close the menu when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/corruption", label: "Corruption" },
    { href: "/links", label: "Secret Channels" },
    { href: "/programs", label: "Programs" },
    { href: "/infection", label: "Infection Protocol" },
  ];

  return (
    <>
      {/* ─── GLOBAL BURGER BTN (Matches Techdom HTML) ─── */}
      <div className="fixed top-6 left-4 sm:left-6 z-[60]">
        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          className="group flex items-center gap-[10px] bg-black/75 border border-white/10 text-[#fbcfe8] backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-pink-500/40 hover:bg-[#0a0408]/90"
        >
          {/* Animated custom burger lines */}
          <div className="flex flex-col gap-[3px] w-[14px]">
            <i
              className={`block h-[1.5px] bg-current rounded-full transition-transform duration-300 origin-center ${
                isOpen ? "rotate-45 translate-y-[4.5px]" : ""
              }`}
            />
            <i
              className={`block h-[1.5px] bg-current rounded-full transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <i
              className={`block h-[1.5px] bg-current rounded-full transition-transform duration-300 origin-center ${
                isOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
              }`}
            />
          </div>
          <span className="font-syncopate text-[9px] tracking-[0.26em] uppercase mt-[1px]">
            {isOpen ? "Close" : "Menu"}
          </span>
        </button>

        {/* ─── TECHDOM MONITOR PANEL ─── */}
        <div
          className={`absolute top-14 left-0 w-[85vw] max-w-[340px] bg-[rgba(10,4,8,0.85)] border border-pink-500/25 rounded-xl shadow-[0_30px_80px_-20px_rgba(236,72,153,0.35),inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl transform transition-all duration-500 origin-top-left overflow-hidden ${
            isOpen
              ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
              : "scale-95 opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {/* CRT Scanline Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
              backgroundSize: "100% 3px"
            }}
          />

          {/* Monitor Header */}
          <div className="relative z-10 flex items-center gap-2.5 px-4 py-3 border-b border-pink-500/15 bg-black/40">
            <div className="flex gap-1.5">
              <i className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <i className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <i className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 text-center font-mono text-[9px] tracking-[0.16em] uppercase text-pink-100/50">
              azraiel@sanctuary — nav.sys
            </div>
          </div>

          {/* Monitor Body (Editorial / Terminal Mix) */}
          <div className="relative z-10 p-5">
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-pink-500 mb-2">
                <Terminal className="w-3 h-3" />
                <span>~$ locate target</span>
              </div>
              <h2 className="font-italiana text-3xl text-pink-50 leading-none mb-1 tracking-tight">
                Directory
              </h2>
              <p className="font-manrope text-xs text-white/40">
                Select your next protocol, pet.
              </p>
            </div>

            {/* Links */}
            <ul className="space-y-1.5">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`
                        group flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-300
                        ${
                          isActive
                            ? "bg-pink-500/15 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                            : "bg-white/[0.02] border-transparent hover:bg-pink-500/10 hover:border-pink-500/20"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className={`font-mono text-[10px] transition-colors duration-300 ${
                            isActive ? "text-pink-400" : "text-white/20 group-hover:text-pink-400/60"
                          }`}
                        >
                          {isActive ? "[*]" : "[ ]"}
                        </span>
                        <span 
                          className={`font-manrope text-[13px] tracking-wide transition-colors duration-300 ${
                            isActive ? "text-pink-50 font-medium" : "text-pink-100/60 group-hover:text-pink-100"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-all duration-300 ${
                          isActive 
                            ? "translate-x-0.5 text-pink-400" 
                            : "opacity-0 -translate-x-2 text-pink-400/50 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Monitor Footer */}
          <div className="relative z-10 flex items-center justify-between px-4 py-2.5 border-t border-pink-500/15 bg-black/40">
            <span className="font-syncopate text-[7.5px] tracking-[0.26em] uppercase text-pink-100/40">
              Protocol V4.1
            </span>
            <span className="flex items-center gap-1.5 font-syncopate text-[7.5px] tracking-[0.26em] uppercase text-pink-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500" />
              </span>
              Live
            </span>
          </div>
        </div>
      </div>

      {/* ─── INVISIBLE BACKDROP (To close on click outside) ─── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[50]" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}