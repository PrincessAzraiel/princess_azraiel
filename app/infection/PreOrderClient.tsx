"use client";

import { useEffect, useState, type ReactNode } from "react";
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

export default function PreOrderPageClient() {
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
    <div className="magic-bg min-h-screen text-pink-300 py-12 px-4 sm:px-6">
      <div className="text-center space-y-10 max-w-6xl mx-auto">
        {/* HERO / FINAL STATUS */}
        <header className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold shimmer-text mb-4">
            Princess&apos;s Infection Protocol
          </h1>
          <p className="text-pink-300/90 text-lg md:text-xl max-w-3xl mx-auto">
            A multi-persona Discord experience that <span className="text-pink-200">drips attention 24/7</span>.
            Nine distinct AIs send timed messages, images, and prompts at configurable intervals.The system rotates them to keep you on edge—and in orbit.
          </p>

          <div className="mt-6 max-w-3xl mx-auto bg-pink-950/60 border border-pink-800 rounded-xl p-6 text-left">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <h2 className="text-2xl font-semibold text-pink-200">What the Infection Protocol does</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-pink-900/60 border border-pink-700">
                Final Release · Next major update: Jan–Feb 2026
              </span>
            </div>
            <ul className="list-none space-y-2 text-pink-300/90">
              <li className="flex gap-2">
                <span aria-hidden className="mt-1">▸</span>
                Schedules message “floods” from the personas included in your tier — drizzle to full storm.
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="mt-1">▸</span>
                Syncs captions, images, and persona-specific links.
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="mt-1">▸</span>
                Runs on your Discord: no app install required, just join the server and opt-in.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-200 mt-5 mb-2">What it also offers</h3>
            <ul className="list-none space-y-2 text-pink-300/80">
              <li className="flex gap-2">
                <span aria-hidden className="mt-1">—</span>
                You can activate/deactivate the flood anytime!
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="mt-1">—</span>
                You can opt-out whenever you want; no hard feelings.
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="mt-1">—</span>
                Future DLC packs to deepen the experience (tasks, special personas, special lore and events).
              </li>
            </ul>
          </div>
        </header>

        {/* PERSONAS */}
        <section aria-labelledby="personas-heading" className="mt-2">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 id="personas-heading" className="text-3xl font-semibold shimmer-text mb-4 md:mb-0">
              Corrupted Personalities
            </h2>
            <div className="bg-pink-900/40 px-4 py-2 rounded-full text-sm border border-pink-700">
              <span className="text-pink-300">9 unique AI personas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {characters.map((c) => (
              <button
                key={c.name}
                onClick={() => openCharacterModal(c)}
                className="group relative text-left rounded-xl border border-pink-800 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 transition"
                aria-label={`Open ${c.name}`}
              >
                <div className="relative w-full h-72">
                  <Image
                    src={c.image}
                    alt={`${c.name} — ${c.role}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width:1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  <p className="text-sm text-pink-300">{c.role}</p>
                  <p className="text-xs mt-1 text-pink-400 line-clamp-2">{c.tone}</p>
                </div>
                <div className="absolute inset-0 ring-1 ring-transparent group-hover:ring-pink-500/40 transition" />
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              className="bg-pink-700 hover:bg-pink-600 text-white px-8 py-6 text-lg font-medium transition-all transform hover:scale-105"
              onClick={() => document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              Unlock All Characters →
            </Button>
          </div>
        </section>

        {/* TIERS */}
        <section id="tiers" className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold shimmer-text mb-3">Obedience Tiers</h2>
            <p className="text-pink-300 max-w-2xl mx-auto">
              Each tier increases message volume, persona slots, and flood speed. You can upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.title}
                className={`relative bg-pink-950/50 border rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20 ${
                  tier.popular ? "border-2 border-pink-500 -translate-y-2 shadow-lg shadow-pink-500/30" : "border-pink-800"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-700 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-semibold shimmer-text mb-2">{tier.title}</h3>
                <p className="text-3xl font-bold text-pink-200 mb-4">{tier.price}</p>
                <ul className="flex-grow mb-6 space-y-3">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-pink-300">{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block w-full mt-auto py-3 text-lg font-medium text-white text-center transition-all rounded-md ${
                    tier.popular
                      ? "bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800"
                      : "bg-pink-800 hover:bg-pink-700"
                  }`}
                >
                  Order Now
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* DLCS */}
        <section id="dlcs" className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold shimmer-text mb-3">DLC Expansions</h2>
            <p className="text-pink-300 max-w-2xl mx-auto">
              Bolt-on packs that deepen the simulation. Add them at checkout or anytime later. Some are spots-limited.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dlcs.map((d) => (
              <div
                key={d.title}
                className="relative rounded-xl overflow-hidden border border-pink-800 bg-pink-950/50 hover:border-pink-500 transition"
              >
                <div className="relative w-full h-48">
                  <Image src={d.image} alt={d.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white">{d.title}</h3>
                  <p className="text-pink-300/90 text-sm mb-3">{d.tagline}</p>
                  <ul className="text-sm text-pink-300 list-disc pl-5 space-y-1 mb-4">
                    {d.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-pink-200 font-semibold">{d.price}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="bg-pink-900/70 hover:bg-pink-900"
                        onClick={() => {
                          setSelectedDLC(d);
                          setShowDLCModal(true);
                        }}
                      >
                        Details
                      </Button>
                      <a
                        href={d.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-md bg-pink-700 hover:bg-pink-600 text-white"
                      >
                        Add
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ (final release copy) */}
        <section className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold shimmer-text mb-8">Corrupted Questions</h2>
          <div className="space-y-4">
            <div className="bg-pink-950/40 border border-pink-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-2">Is this a beta?</h3>
              <p className="text-pink-400">
                No—this is the final release. Major feature updates are planned for January–February 2026.
              </p>
            </div>
            <div className="bg-pink-950/40 border border-pink-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-2">Can I upgrade my tier later?</h3>
              <p className="text-pink-400">Yes. Upgrades are instant, just purchase the desired tier and dm the Princess on discord</p>
            </div>
            <div className="bg-pink-950/40 border border-pink-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-2">Is there a mobile version?</h3>
              <p className="text-pink-400">
                It works on every device; all you need is a Discord account and to be on the server.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 mb-12 p-8 bg-gradient-to-r from-pink-900/60 to-purple-900/60 border border-pink-700 rounded-xl">
          <h2 className="text-3xl font-bold shimmer-text mb-4">Submit to the Obedience Protocol</h2>
          <p className="text-pink-300 max-w-2xl mx-auto mb-6">
            Choose your tier, pick your personas, and let the system do the rest.
          </p>
          <Button className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 px-10 py-6 text-xl font-bold transform hover:scale-105 transition-all">
            Pre-Order Now
          </Button>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link href="/" aria-label="Return to Submission Gate">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-200 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Submission Gate
            </Button>
          </Link>
        </div>
      </div>

      {/* PERSONA MODAL */}
      {showPersonaModal && selectedCharacter && (
        <ClientPortal>
          <div
            className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4"
            onClick={() => setShowPersonaModal(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="relative bg-gradient-to-br from-pink-900/90 to-purple-900/90 border-2 border-pink-600 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close"
                className="absolute top-4 right-4 text-pink-300 hover:text-white z-10 bg-pink-900/50 rounded-full p-1"
                onClick={() => setShowPersonaModal(false)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-48 h-64 border-2 border-pink-600 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/30 to-pink-900/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedCharacter.image}
                        alt={selectedCharacter.name}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedCharacter.name}</h3>
                    <p className="text-pink-400 text-lg mb-2">{selectedCharacter.role}</p>
                    <p className="text-pink-500 text-sm mb-2">{selectedCharacter.tone}</p>

                    <div className="flex border-b border-pink-800 mb-4">
                      {(["description", "sample"] as const).map((tab) => (
                        <button
                          key={tab}
                          className={`px-4 py-2 text-sm font-medium transition ${
                            activeTab === tab
                              ? "text-pink-300 border-b-2 border-pink-500"
                              : "text-pink-500 hover:text-pink-300"
                          }`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab === "description" ? "Description" : tab === "sample" ? "Sample Dialogue" : "Links"}
                        </button>
                      ))}
                    </div>

                    {activeTab === "description" && (
                      <p className="text-pink-300 mb-6">{selectedCharacter.description}</p>
                    )}

                    {activeTab === "sample" && (
                      <div className="bg-pink-950/40 border border-pink-800 rounded-lg p-4 mb-6">
                        <p className="text-pink-300 italic">"{selectedCharacter.sample}"</p>
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
          <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4" onClick={() => setShowDLCModal(false)}>
            <div
              role="dialog"
              aria-modal="true"
              className="relative bg-gradient-to-br from-pink-900/90 to-purple-900/90 border-2 border-pink-600 rounded-xl max-w-xl w-full overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close"
                className="absolute top-4 right-4 text-pink-300 hover:text-white z-10 bg-pink-900/50 rounded-full p-1"
                onClick={() => setShowDLCModal(false)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative w-full h-48">
                <Image src={selectedDLC.image} alt={selectedDLC.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-white">{selectedDLC.title}</h3>
                <p className="text-pink-300/90 mb-3">{selectedDLC.tagline}</p>
                <ul className="text-pink-300 list-disc pl-5 space-y-1 mb-4">
                  {selectedDLC.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-pink-200 font-semibold">{selectedDLC.price}</span>
                  <a
                    href={selectedDLC.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-pink-700 hover:bg-pink-600 text-white"
                  >
                    Add DLC
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        .magic-bg {
          background: radial-gradient(ellipse at center, #1a0629 0%, #0d0419 70%);
          background-size: 400% 400%;
          animation: gradientBG 18s ease infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ff69eb, #ffffff, #ff69eb);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s infinite;
        }
        .animate-fade-in {
          animation: fadeInUp 600ms ease-out both;
        }
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(0, 10px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
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
