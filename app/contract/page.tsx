"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileDown, ShieldCheck } from "lucide-react";

import { CONTRACT_TEXT, FINDOM_PART,FINAL_CONFIRMATION, SURVEILANCE_TEXT, REQUIRED_FIELDS } from "./contract.config";
import { ContractHeader } from "./components/ContractHeader";
import { Section } from "./components/Section";
import { ContractParagraph } from "./components/ContractParagraph";
import { Checklist } from "./components/Checklist";
import { SignaturePad } from "./components/SignaturePad";
import { generatePDF } from "./utils/generatePDF";
import { a } from "framer-motion/client";

const CHECK_ITEMS = [
  "I confirm I am acting voluntarily and can stop at any time.",
  "I will send the exported contract to the Princess.",
  "With the contract inside a zip file I will send my safeword to the princess.",
  "The zip file will contain other files or information I want to share with the princess.",
  "I agree to communicate limits and safe-words clearly.",
  "I understand I can withdraw consent at any moment.",
];

export default function ContractPage() {
  // ---- Core state ----
  const [values, setValues] = useState<Record<string, string>>({
    name: "",
    title: "Princess Azraiel",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    lala: "",
  });

  const [checks, setChecks] = useState<boolean[]>(
    Array.from({ length: CHECK_ITEMS.length }, () => false)
  );

  const [signature, setSignature] = useState("");
  const [exporting, setExporting] = useState(false);

  // where we render the "paper" to export
  const contractRef = useRef<HTMLDivElement | null>(null);

  // ---- Helpers ----
  const updateValue = (key: string, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const toggleCheck = (i: number) => {
    setChecks((prev) => prev.map((x, idx) => (idx === i ? !x : x)));
  };

  const allChecksOk = useMemo(() => checks.every(Boolean), [checks]);

  const requiredOk = useMemo(() => {
    return REQUIRED_FIELDS.every((k) => (values[k] || "").trim().length > 0);
  }, [values]);

  const signatureOk = useMemo(() => signature.trim().length > 1, [signature]);

  const canExport = requiredOk && allChecksOk && signatureOk;

  const onExport = async () => {
    if (!contractRef.current) return;
    if (!canExport) return;

    setExporting(true);

    // let export-safe styles apply before html2canvas snapshots
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    try {
      await generatePDF(contractRef.current, {
        filename: `contract_${(values.name || "user").replaceAll(" ", "_")}.pdf`,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-pink-50 selection:bg-pink-500 selection:text-black">
      {/* Export-safe overrides (kills lab()/oklch gradients and blur) */}
      <style jsx global>{`
        #contract-root[data-export="true"] * {
          background-image: none !important;
          filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          text-shadow: none !important;
        }

        /* Gradient text is the #1 offender; we replace it with plain text */
        #contract-root[data-export="true"] .export-no-gradient-text {
          color: #ffffff !important;
          background: none !important;
          -webkit-text-fill-color: #ffffff !important;
        }
      `}</style>

      {/* Atmosphere / same vibe as landing */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(255,122,214,0.15),transparent_60%),radial-gradient(900px_500px_at_90%_20%,rgba(155,92,255,0.12),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-15 [background:linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%)] [background-size:100%_4px]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150" />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-pink-200 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <button
            onClick={onExport}
            disabled={!canExport || exporting}
            className={[
              "inline-flex items-center gap-2 px-4 py-2 border transition",
              canExport && !exporting
                ? "border-[#ec489966] bg-[#ec48991a] hover:bg-[#ec489926] text-pink-100"
                : "border-[#ffffff1a] bg-[#ffffff0d] text-white/30 cursor-not-allowed",
            ].join(" ")}
          >
            <FileDown className="h-4 w-4" />
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>

        {/* This is the "paper" area that will be exported */}
        <div
          id="contract-root"
          ref={contractRef}
          data-export={exporting ? "true" : "false"}
          className={[
            "relative overflow-hidden border p-6 md:p-10",
            exporting
              ? "border-[#ffffff1a] bg-[#0b0b0b]" // export-safe (no blur)
              : "border-white/10 bg-black/40 backdrop-blur-md shadow-[0_0_60px_rgba(236,72,153,0.10)]",
          ].join(" ")}
        >
          {/* faint side glow (disable during export) */}
          {!exporting && (
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(236,72,153,0.10),transparent_35%,transparent_65%,rgba(192,38,211,0.08))]" />
          )}

          <ContractHeader
            title="Submission Contract"
            subtitle="Consensual · Submit · Suffer · Smile"
            badge="System Online"
            exporting={exporting}
          />

          <div className="mt-10 space-y-10">
            {/* Main text */}
            <Section
              title="Agreement"
              hint="Fill the highlighted fields inside the text."
              icon={<ShieldCheck className="h-4 w-4" />}
            >
              <ContractParagraph
                text={CONTRACT_TEXT}
                values={values}
                onChange={updateValue}
              />

            </Section>

            <Section
                title="Findom Terms"
                hint="if it isnt part of your fetishes, fill it with 0s or N/A."
            >
              <ContractParagraph
                text={FINDOM_PART}
                values={values}
                onChange={updateValue}
              />
            </Section>

            <Section
                title="Surveillance Consent"
                hint="If it isnt part of your fetishes, fill it with N/A."
            >
              <ContractParagraph
                text={SURVEILANCE_TEXT}
                values={values}
                onChange={updateValue}
              />
            </Section>
            <Section
                title="Final Confirmation"
                hint="Please read and confirm before exporting."
            >
              <ContractParagraph
                text={FINAL_CONFIRMATION}
                values={values}
                onChange={updateValue}
              />
            </Section>

            {/* Checklist */}
            <Section title="Checklist" hint="All must be checked.">
              <Checklist
                items={CHECK_ITEMS}
                checked={checks}
                onToggle={toggleCheck}
              />
            </Section>

            {/* Signature */}
            <Section title="Signature" hint="Typed signature counts as an autograph.">
              <div className="space-y-3">
                <SignaturePad value={signature} onChange={setSignature} />
                <p className="text-xs text-white/35 font-manrope">
                  By signing, you confirm you understand and accept the terms above.
                </p>
              </div>
            </Section>

            {/* Export status */}
            <div className="pt-4 border-t border-white/10">
              {!canExport ? (
                <p className="text-xs text-white/35 font-manrope">
                  To export: fill required fields, check all boxes, and sign.
                </p>
              ) : (
                <p className="text-xs text-pink-200/70 font-manrope">
                  Ready to export.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-white/20 font-manrope">
          Consent is sacred.
        </p>
      </main>
    </div>
  );
}
