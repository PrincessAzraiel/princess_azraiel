"use client";

import { useEffect, useState, type ReactNode, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";
import { characters, tiers, dlcs } from "./data";
import type { Character, DLC } from "./types";

/** client-only portal (avoids SSR `document` access) */
function ClientPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return ReactDOM.createPortal(children, document.body);
}

/** Floating Hearts Background Component */
function FloatingHearts() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hearts = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${10 + Math.random() * 15}s`,
    animationDelay: `${Math.random() * 10}s`,
    size: `${15 + Math.random() * 25}px`,
    opacity: 0.1 + Math.random() * 0.3,
  })), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <svg
          key={heart.id}
          className="absolute text-pink-500 animate-float-heart"
          style={{
            left: heart.left,
            width: heart.size,
            height: heart.size,
            animationDuration: heart.animationDuration,
            animationDelay: heart.animationDelay,
            opacity: heart.opacity,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProtocolPageClient() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "sample">("description");

  const [selectedDLC, setSelectedDLC] = useState<DLC | null>(null);
  const [showDLCModal, setShowDLCModal] = useState(false);

  const openCharacterModal = (character: Character) => {
    setSelectedCharacter(character);
    setActiveTab("description");
    setShowPersonaModal(true);
  };

  return (
    <div className="bg-[#090004] min-h-screen text-pink-100 py-16 px-4 sm:px-6 font-sans relative selection:bg-pink-500 selection:text-white">
      <FloatingHearts />
      
      <div className="text-center space-y-16 max-w-6xl mx-auto relative z-10">
        
        {/* HERO / STATUS */}
        <header className="animate-fade-in pb-8">
          <div className="inline-block mb-6 px-4 py-1.5 bg-pink-500/10 border-2 border-pink-500">
            <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">System Active</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-pink-500 mb-6 tracking-tight uppercase">
            Princess's Infection Protocol
          </h1>
          <p className="text-pink-100/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            A multi-persona Discord experience that <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5">drips attention 24/7</span>.
            Nine distinct AIs send timed messages, images, and prompts at configurable intervals. 
            The system rotates them to keep you on edge—and obsessed.
          </p>

          <div className="mt-12 max-w-3xl mx-auto bg-[#14000a] border-2 border-pink-900 p-8 text-left transition-all hover:border-pink-500 hover:shadow-[8px_8px_0_0_#ec4899]">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-6 border-b-2 border-pink-900/50">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide">What the Protocol does</h2>
              <span className="text-xs px-3 py-1 bg-pink-900 text-pink-100 font-bold uppercase tracking-wide">
                Final Release
              </span>
            </div>
            <ul className="list-none space-y-4 text-pink-200/90 text-md">
              <li className="flex gap-3 items-start">
                <span aria-hidden className="mt-1 text-pink-500 text-lg leading-none">■</span>
                <span>Schedules message “floods” from the personas assigned to your tier — drizzle to full storm.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span aria-hidden className="mt-1 text-pink-500 text-lg leading-none">■</span>
                <span>Syncs captions, images, and persona-specific links directly to your DMs.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span aria-hidden className="mt-1 text-pink-500 text-lg leading-none">■</span>
                <span>Runs on your Discord: no app install required, just join the server and opt-in.</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-10 mb-4 uppercase tracking-wide">
              The Rules of Submission
            </h3>
            <ul className="list-none space-y-3 text-pink-300/80 text-md">
              <li className="flex gap-3">
                <span aria-hidden className="mt-0.5 text-pink-500 font-bold">→</span>
                <span><strong className="text-pink-400">You don't pick your captors.</strong> Your tier determines which personalities are injected into your feed.</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-0.5 text-pink-500 font-bold">→</span>
                You can activate/deactivate the flood anytime.
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-0.5 text-pink-500 font-bold">→</span>
                Future DLC packs will deepen the experience (tasks, special lore, events).
              </li>
            </ul>
          </div>
        </header>

        {/* PERSONAS */}
        <section aria-labelledby="personas-heading" className="mt-24 pt-16 border-t-2 border-dashed border-pink-900/50">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="text-left">
              <h2 id="personas-heading" className="text-4xl font-black text-pink-500 mb-2 tracking-tight uppercase">
                Corrupted Personalities
              </h2>
              <p className="text-pink-300/80 font-medium text-lg">They are already waiting for you.</p>
            </div>
            <div className="mt-4 md:mt-0 px-4 py-2 border-2 border-pink-900 bg-[#14000a]">
              <span className="text-pink-400 font-bold tracking-wide uppercase text-sm">9 Unique AI Entities</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {characters.map((c) => (
              <button
                key={c.name}
                onClick={() => openCharacterModal(c)}
                className="group flex flex-col text-left bg-[#14000a] border-2 border-pink-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-500 transition-all hover:-translate-y-1 hover:border-pink-500 hover:shadow-[6px_6px_0_0_#ec4899]"
                aria-label={`Open ${c.name}`}
              >
                <div className="relative w-full h-64 border-b-2 border-pink-900 group-hover:border-pink-500 transition-colors">
                  <Image
                    src={c.image}
                    alt={`${c.name} — ${c.role}`}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 100vw, (max-width:1200px) 33vw, 25vw"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{c.name}</h3>
                    <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-4">{c.role}</p>
                  </div>
                  <div className="bg-[#090004] border-l-4 border-pink-500 p-3">
                    <p className="text-sm text-pink-200/80 italic line-clamp-2 leading-relaxed font-medium">
                      "{c.sample}"
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* TIERS */}
        <section id="tiers" className="mt-24 pt-16 border-t-2 border-dashed border-pink-900/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-pink-500 mb-4 tracking-tight uppercase">
              Obedience Tiers
            </h2>
            <p className="text-pink-200/80 max-w-2xl mx-auto text-lg font-medium">
              You do not get to pick your poison. Your tier dictates your volume and assigns your captors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.title}
                className={`relative bg-[#14000a] border-2 p-8 flex flex-col h-full transition-all hover:-translate-y-1 ${
                  tier.popular 
                  ? "border-pink-500 shadow-[8px_8px_0_0_#ec4899] z-10" 
                  : "border-pink-900 hover:border-pink-500 hover:shadow-[8px_8px_0_0_#831843]"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-black px-6 py-2 tracking-widest uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2 uppercase">{tier.title}</h3>
                <p className="text-5xl font-black text-pink-500 mb-6">{tier.price}</p>
                
                {/* Assigned Characters Display */}
                <div className="mb-8 bg-[#090004] p-4 border border-pink-900 text-left">
                  <span className="text-xs uppercase tracking-widest text-pink-500 font-bold block mb-2">System Assigned Entities:</span>
                  <span className="text-sm text-pink-100 font-bold leading-relaxed">
                    {tier.assignedCharacters.join(" • ")}
                  </span>
                </div>

                <ul className="flex-grow mb-10 space-y-4">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-pink-500 font-black mr-3 mt-0.5">■</span>
                      <span className="text-pink-200/90 text-left font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block w-full mt-auto py-4 text-lg font-black uppercase text-center transition-all border-2 ${
                    tier.popular
                      ? "bg-pink-500 text-white border-pink-500 hover:bg-pink-600 hover:border-pink-600"
                      : "bg-transparent text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white"
                  }`}
                >
                  Submit Order
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* DLCS */}
        <section id="dlcs" className="mt-24 pt-16 border-t-2 border-dashed border-pink-900/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-pink-500 mb-4 tracking-tight uppercase">
              DLC Expansions
            </h2>
            <p className="text-pink-200/80 max-w-2xl mx-auto text-lg font-medium">
              Bolt-on packs that deepen the simulation. Add them at checkout or anytime later.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dlcs.map((d) => (
              <div
                key={d.title}
                className="group flex flex-col bg-[#14000a] border-2 border-pink-900 transition-all hover:-translate-y-1 hover:border-pink-500 hover:shadow-[6px_6px_0_0_#ec4899]"
              >
                <div className="relative w-full h-56 border-b-2 border-pink-900 group-hover:border-pink-500 transition-colors">
                  <Image src={d.image} alt={d.title} fill className="object-cover opacity-80 group-hover:opacity-100" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-white mb-2 uppercase">{d.title}</h3>
                  <p className="text-pink-300/80 text-sm mb-6 flex-grow font-medium leading-relaxed">{d.tagline}</p>
                  <ul className="text-sm text-pink-200/90 list-none space-y-2 mb-8 text-left">
                    {d.features.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-pink-500">›</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t-2 border-pink-900/50">
                    <span className={`font-black tracking-wider ${d.isAvailable !== false ? "text-pink-400 text-lg" : "text-pink-900 text-sm uppercase"}`}>
                      {d.price}
                    </span>
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        className="text-pink-400 hover:text-white hover:bg-pink-900 uppercase font-bold text-xs rounded-none border-2 border-transparent hover:border-pink-500"
                        onClick={() => {
                          setSelectedDLC(d);
                          setShowDLCModal(true);
                        }}
                      >
                        Inspect
                      </Button>
                      {d.isAvailable !== false ? (
                        <a
                          href={d.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold uppercase text-xs transition-colors"
                        >
                          Add
                        </a>
                      ) : (
                        <span className="inline-flex items-center px-5 py-2 bg-[#090004] text-pink-900 border-2 border-pink-900 cursor-not-allowed font-bold uppercase text-xs">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-24 pt-16 border-t-2 border-dashed border-pink-900/50 max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-pink-500 mb-12 text-center tracking-tight uppercase">Corrupted Questions</h2>
          <div className="space-y-6">
            <div className="bg-[#14000a] border-2 border-pink-900 p-8 text-left transition hover:border-pink-500 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#831843]">
              <h3 className="text-xl font-black text-white mb-3 uppercase">Is this a beta?</h3>
              <p className="text-pink-200/80 leading-relaxed font-medium">
                No—this is the final release. More features and major updates are actively in development and coming soon.
              </p>
            </div>
            <div className="bg-[#14000a] border-2 border-pink-900 p-8 text-left transition hover:border-pink-500 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#831843]">
              <h3 className="text-xl font-black text-white mb-3 uppercase">Can I upgrade my tier later?</h3>
              <p className="text-pink-200/80 leading-relaxed font-medium">
                Yes. Upgrades are instant. Just purchase the desired tier and DM the Princess on Discord to adjust your protocol.
              </p>
            </div>
            <div className="bg-[#14000a] border-2 border-pink-900 p-8 text-left transition hover:border-pink-500 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#831843]">
              <h3 className="text-xl font-black text-white mb-3 uppercase">Is there a mobile version?</h3>
              <p className="text-pink-200/80 leading-relaxed font-medium">
                It works on every device; all you need is a Discord account and to be opted-in on the server.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-24 mb-16 p-12 bg-pink-600 border-4 border-pink-400 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase text-center">Submit to the Protocol</h2>
            <p className="text-pink-100 max-w-2xl mx-auto mb-10 text-lg font-bold text-center">
              Choose your tier, accept your assigned personas, and let the system take control.
            </p>
            <div className="text-center">
              <Button 
                className="bg-[#090004] text-pink-400 border-2 border-[#090004] hover:bg-transparent hover:text-white hover:border-white px-14 py-8 text-2xl font-black tracking-widest uppercase transition-colors rounded-none"
                onClick={() => document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" })}
              >
                Order Now
              </Button>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12 pb-12">
          <Link href="/" aria-label="Return to Submission Gate">
            <Button variant="ghost" className="text-pink-500 hover:text-white hover:bg-pink-900 flex items-center mx-auto text-lg font-bold transition-colors uppercase rounded-none border-2 border-transparent hover:border-pink-500">
              <span className="mr-3 text-2xl">←</span>
              Return to Gate
            </Button>
          </Link>
        </div>
      </div>

      {/* PERSONA MODAL */}
      {showPersonaModal && selectedCharacter && (
        <ClientPortal>
          <div
            className="fixed inset-0 bg-[#090004]/90 z-[1000] flex items-center justify-center p-4 transition-all"
            onClick={() => setShowPersonaModal(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="relative bg-[#14000a] border-2 border-pink-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[12px_12px_0_0_#ec4899]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close"
                className="absolute top-4 right-4 text-pink-500 hover:text-white bg-[#090004] border-2 border-pink-500 hover:bg-pink-500 p-2 transition-colors z-20"
                onClick={() => setShowPersonaModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/5 relative min-h-[300px] border-b-2 md:border-b-0 md:border-r-2 border-pink-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="w-full md:w-3/5 p-8 flex flex-col bg-[#14000a]">
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">{selectedCharacter.name}</h3>
                  <div className="inline-block bg-pink-500 px-3 py-1 mb-4 self-start">
                    <p className="text-white font-black tracking-widest uppercase text-xs">{selectedCharacter.role}</p>
                  </div>
                  <p className="text-pink-300 text-sm mb-8 font-bold uppercase tracking-wide border-l-4 border-pink-500 pl-3">{selectedCharacter.tone}</p>

                  <div className="flex border-b-2 border-pink-900 mb-8">
                    {(["description", "sample"] as const).map((tab) => (
                      <button
                        key={tab}
                        className={`px-6 py-3 text-sm font-black uppercase tracking-wider transition-colors ${
                          activeTab === tab
                            ? "text-pink-500 border-b-2 border-pink-500 -mb-[2px]"
                            : "text-pink-800 hover:text-pink-400"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === "description" ? "Lore" : "Transmission"}
                      </button>
                    ))}
                  </div>

                  <div className="flex-grow">
                    {activeTab === "description" && (
                      <p className="text-pink-100/90 leading-relaxed font-medium text-lg">{selectedCharacter.description}</p>
                    )}

                    {activeTab === "sample" && (
                      <div className="bg-[#090004] border-2 border-pink-900 p-6">
                        <p className="text-pink-400 italic text-xl font-serif tracking-wide">&quot;{selectedCharacter.sample}&quot;</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* DLC MODAL */}
      {showDLCModal && selectedDLC && (
        <ClientPortal>
          <div className="fixed inset-0 bg-[#090004]/90 z-[1000] flex items-center justify-center p-4 transition-all" onClick={() => setShowDLCModal(false)}>
            <div
              role="dialog"
              aria-modal="true"
              className="relative bg-[#14000a] border-2 border-pink-500 max-w-2xl w-full shadow-[12px_12px_0_0_#ec4899] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close"
                className="absolute top-4 right-4 text-pink-500 hover:text-white bg-[#090004] border-2 border-pink-500 hover:bg-pink-500 p-2 transition-colors z-20"
                onClick={() => setShowDLCModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative w-full h-64 border-b-2 border-pink-500">
                <Image src={selectedDLC.image} alt={selectedDLC.title} fill className="object-cover opacity-90" />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">{selectedDLC.title}</h3>
                <p className="text-pink-400 mb-8 text-sm font-bold uppercase tracking-wide border-l-4 border-pink-500 pl-3">{selectedDLC.tagline}</p>
                
                <ul className="text-pink-100/90 list-none space-y-3 mb-10 font-medium">
                  {selectedDLC.features.map((f, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-pink-500 font-bold">›</span> {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6 border-t-2 border-pink-900 mt-auto">
                  <span className={`text-2xl font-black tracking-wider ${selectedDLC.isAvailable !== false ? "text-pink-500" : "text-pink-900 uppercase text-sm"}`}>
                    {selectedDLC.price}
                  </span>
                  {selectedDLC.isAvailable !== false ? (
                    <a
                      href={selectedDLC.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-black uppercase tracking-widest transition-colors"
                    >
                      Acquire Expansion
                    </a>
                  ) : (
                    <span className="inline-flex items-center px-8 py-4 bg-[#090004] text-pink-900 border-2 border-pink-900 cursor-not-allowed font-black uppercase tracking-widest">
                      Data Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeInUp 600ms ease-out both;
        }
        .animate-float-heart {
          animation-name: floatUpSway;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUpSway {
          0% { 
            transform: translateY(100vh) scale(0.5) rotate(0deg) translateX(0px); 
          }
          50% { 
            transform: translateY(40vh) scale(1) rotate(15deg) translateX(25px); 
          }
          100% { 
            transform: translateY(-20vh) scale(1.2) rotate(-15deg) translateX(-25px); 
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}