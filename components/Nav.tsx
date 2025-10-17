"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
    { href: "/links", label: "Links" },
    { href: "/programs", label: "Programs" },
    { href: "/infection-protocol", label: "Infection Protocol" },
  ];

  return (
    <nav className="fixed top-6 left-6 z-50">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label="Open navigation"
        className="bg-black/70 text-pink-300 backdrop-blur p-3 rounded-2xl shadow-lg transition-all duration-300 hover:text-pink-400 hover:drop-shadow-[0_0_6px_rgba(255,192,203,0.7)]"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Slide-in Menu */}
      <div
        className={`absolute top-20 left-0 w-[80vw] max-w-xs bg-black/80 backdrop-blur-lg rounded-r-3xl p-6 shadow-2xl transform transition-all duration-300 ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <ul className="space-y-4 text-pink-300 text-lg font-medium">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block transition-all duration-300 hover:text-pink-400 hover:drop-shadow-[0_0_6px_rgba(255,192,203,0.7)] ${
                    isActive ? "text-pink-400 underline underline-offset-4" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
