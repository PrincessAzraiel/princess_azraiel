"use client";

import { useEffect, useRef, useState } from "react";

const COOKIE_NAME = "age_ok";
const COOKIE_MAX_AGE_DAYS = 365;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

type Props = {
  underageRedirect?: string;
  debugForceOpen?: boolean;
  termsUrl?: string;
  privacyUrl?: string;
  reportUrl?: string;
};

export default function AgeGate({
  underageRedirect = "/",
  debugForceOpen = false,
  termsUrl = "/terms",
  privacyUrl = "/privacy",
  reportUrl = "/report",
}: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHydrated(true);
    const ok = getCookie(COOKIE_NAME) === "1";
    setOpen(debugForceOpen ? true : !ok);
  }, [debugForceOpen]);

  useEffect(() => {
    if (!hydrated) return;
    const body = document.body;
    const prev = body.style.overflow;
    if (open) {
      body.style.overflow = "hidden";
      setTimeout(() => firstFocusRef.current?.focus(), 0);
    } else {
      body.style.overflow = prev;
    }
    return () => { body.style.overflow = prev; };
  }, [open, hydrated]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
      if (e.key === "Tab") {
        const a = document.activeElement;
        if (e.shiftKey && a === firstFocusRef.current) {
          e.preventDefault();
          lastFocusRef.current?.focus();
        } else if (!e.shiftKey && a === lastFocusRef.current) {
          e.preventDefault();
          firstFocusRef.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!hydrated || !open) return null;

  const confirm = () => {
    if (!(ageChecked && termsChecked)) return;
    // optional: record a local timestamp for your analytics/audit
    localStorage.setItem("age_gate_accepted_at", new Date().toISOString());
    setCookie(COOKIE_NAME, "1", COOKIE_MAX_AGE_DAYS);
    setOpen(false);
  };
  const underage = () => {
    setCookie(COOKIE_NAME, "0", COOKIE_MAX_AGE_DAYS);
    window.location.assign(underageRedirect);
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="agegate-title"
      aria-describedby="agegate-desc"
      className="fixed inset-0 z-[1000] flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen
        bg-[radial-gradient(900px_500px_at_50%_20%,rgba(16,185,129,0.25),transparent_60%),radial-gradient(700px_400px_at_40%_80%,rgba(236,72,153,0.18),transparent_60%)]" />

      <div className="relative w-[min(92vw,720px)] rounded-3xl border border-pink-400/30 bg-black/70 p-6 sm:p-8 shadow-2xl">
        <div className="mb-5 text-center">
          <h2 id="agegate-title" className="text-2xl sm:text-3xl font-extrabold tracking-wide text-pink-300">
            +18 Only — Mature Content Ahead
          </h2>
          <p id="agegate-desc" className="mt-2 text-pink-100/80 leading-relaxed">
            By entering, you certify that you are at least 18 years old (or the legal age of majority in your
            jurisdiction) and that viewing adult-themed material is legal where you live and on the device you use.
          </p>
        </div>

        {/* Legal copy */}
        <div className="text-sm text-pink-100/80 space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4 max-h-56 overflow-auto">
          <p>
            <strong>Legal notice.</strong> This site hosts fictional, adult-oriented content intended solely for mature
            audiences. You must not allow any minor to access this site. You are responsible for complying with all
            applicable laws and for ensuring that accessing this content is lawful in your location.
          </p>
          <p>
            By clicking <em>Enter</em>, you affirm: (1) you are 18+ (or the age of majority in your jurisdiction); (2)
            you will not share this content with minors; (3) you consent to view adult material; and (4) you agree to
            the <a className="underline hover:opacity-80" href={termsUrl}>Terms of Service</a> and{" "}
            <a className="underline hover:opacity-80" href={privacyUrl}>Privacy Policy</a>.
          </p>
          <p className="text-pink-200/70">
            If you encounter content that may be unlawful or non-compliant, please{" "}
            <a className="underline hover:opacity-80" href={reportUrl}>report it here</a>.
          </p>
          <p className="text-xs text-pink-100/60">
            Disclaimer: This notice is provided for general information only and is not legal advice.
            Compliance requirements vary by jurisdiction and platform.
          </p>
        </div>

        {/* Checkboxes */}
        <div className="mt-5 space-y-3">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-pink-500"
              checked={ageChecked}
              onChange={(e) => setAgeChecked(e.target.checked)}
            />
            <span className="text-sm text-pink-100/90">
              I confirm I am 18+ (or the age of majority where I live) and it is legal for me to view this content.
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-pink-500"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
            />
            <span className="text-sm text-pink-100/90">
              I agree to the <a className="underline hover:opacity-80" href={termsUrl}>Terms</a> and{" "}
              <a className="underline hover:opacity-80" href={privacyUrl}>Privacy Policy</a>.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            ref={firstFocusRef}
            onClick={confirm}
            disabled={!(ageChecked && termsChecked)}
            className="rounded-2xl border border-emerald-400/40 bg-emerald-600/20 px-5 py-3 font-semibold 
                       text-emerald-200 hover:bg-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed
                       active:scale-[0.99] transition"
          >
            Enter — I certify & agree
          </button>
          <button
            ref={lastFocusRef}
            onClick={underage}
            className="rounded-2xl border border-pink-400/40 bg-pink-600/20 px-5 py-3 font-semibold 
                       text-pink-200 hover:bg-pink-600/30 active:scale-[0.99] transition"
          >
            I’m under 18 — Leave
          </button>
        </div>

        <p className="mt-4 text-xs text-pink-100/60 text-center">
          Your choice is saved in a cookie for {COOKIE_MAX_AGE_DAYS} days.
        </p>
      </div>
    </div>
  );
}
