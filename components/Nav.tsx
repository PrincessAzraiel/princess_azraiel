"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    { href: "/links", label: "Links" }, // <- your Secret Channels page
    { href: "/programs", label: "Programs" },
    { href: "/infection", label: "Infection Protocol" },
  ];

  return (
    <nav className="fixed top-6 left-6 z-50">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        className="flex items-center gap-2 bg-black/70 border border-white/10 text-pink-200 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg transition-all duration-300 hover:text-pink-300 hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
        <span className="hidden sm:inline font-syncopate text-[10px] tracking-[0.18em] uppercase">
          Menu
        </span>
      </button>

      {/* Slide-in Menu */}
      <div
        className={`absolute top-16 left-0 w-[80vw] max-w-sm bg-black/90 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl transform transition-all duration-300 ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Panel Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/10">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
            </span>
            <span className="font-syncopate text-[9px] uppercase tracking-[0.22em] text-pink-100">
              System Navigation
            </span>
          </div>

          <div className="mt-3">
            <p className="font-italiana text-2xl text-pink-50 leading-tight">
              Princess Azraiel
            </p>
            <p className="font-manrope text-xs text-white/40 mt-1">
              Choose your next protocol, pet.
            </p>
          </div>
        </div>

        {/* Links */}
        <ul className="px-3 py-4 space-y-2 text-pink-200 font-manrope text-sm">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    group flex items-center justify-between gap-3 px-3 py-2 rounded-2xl border transition-all duration-300
                    ${
                      isActive
                        ? "bg-pink-900/40 border-pink-400/70 text-pink-50 shadow-[0_0_18px_rgba(236,72,153,0.35)]"
                        : "bg-white/5 border-transparent text-pink-200 hover:bg-white/10 hover:border-pink-300/50 hover:text-pink-50"
                    }
                  `}
                >
                  <span className="font-manrope text-sm">
                    {label}
                  </span>
                  <ArrowRight
                    className={`
                      w-4 h-4 transition-transform duration-300
                      ${isActive ? "translate-x-1 text-pink-300" : "group-hover:translate-x-1 text-white/40 group-hover:text-pink-300"}
                    `}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Tiny Footer */}
        <div className="px-5 pb-4 pt-2 border-t border-white/10">
          <p className="font-syncopate text-[9px] uppercase tracking-[0.2em] text-white/30">
            Corruption Hub // V4.0
          </p>
        </div>
      </div>
    </nav>
  );
}
