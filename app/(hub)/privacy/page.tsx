import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Princess Azraiel",
  description: "Privacy Policy for princessazraiel.com. How your data is handled under GDPR.",
  alternates: { canonical: "https://princessazraiel.com/privacy" },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "May 3, 2026";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#050306] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@400;500;600&family=Syncopate:wght@400;700&display=swap');
        .italiana { font-family: 'Italiana', serif; }
        .sync { font-family: 'Syncopate', sans-serif; }
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80vw 50vh at 50% 0%, rgba(134,25,143,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 manrope text-xs text-white/40 hover:text-pink-300/80 transition-colors mb-12"
        >
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>

        <div className="mb-10">
          <p className="sync text-[8px] tracking-[0.5em] text-pink-400/60 uppercase mb-3">
            Legal
          </p>
          <h1 className="italiana text-5xl text-white leading-none mb-3">
            Privacy <em className="italic text-pink-300">Policy</em>
          </h1>
          <p className="manrope text-sm text-white/40">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-8 manrope text-sm text-white/65 leading-relaxed">

          <p className="text-white/50">
            This Privacy Policy explains how{" "}
            <span className="text-pink-300/80">princessazraiel.com</span> collects and handles
            data when you visit the site. We act as controller under the EU General Data
            Protection Regulation (GDPR).
          </p>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">1. What We Collect</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-pink-400/60 mt-0.5 flex-shrink-0">—</span>
                <span>
                  <strong className="text-white/80">Technical data</strong> — IP address,
                  browser and device info, pages visited, timestamps. Collected automatically by
                  the hosting infrastructure for security and performance.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400/60 mt-0.5 flex-shrink-0">—</span>
                <span>
                  <strong className="text-white/80">Age-gate cookie</strong> — a cookie named{" "}
                  <code className="text-pink-300/70 bg-white/5 px-1 py-0.5 rounded text-xs">age_ok</code>{" "}
                  is stored when you confirm your age. It contains only a "1" or "0" and expires
                  after 365 days. No personal information is stored in it.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400/60 mt-0.5 flex-shrink-0">—</span>
                <span>
                  <strong className="text-white/80">Local storage</strong> — a timestamp
                  (
                  <code className="text-pink-300/70 bg-white/5 px-1 py-0.5 rounded text-xs">
                    age_gate_accepted_at
                  </code>
                  ) is saved locally in your browser when you enter. This never leaves your device.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400/60 mt-0.5 flex-shrink-0">—</span>
                <span>
                  <strong className="text-white/80">Report / contact submissions</strong> — if
                  you submit a report or message, we receive whatever information you choose to
                  include.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">2. Why We Use It</h2>
            <ul className="space-y-2">
              {[
                { basis: "Legitimate interests (Art. 6(1)(f) GDPR)", reason: "Operating and securing the site, preventing abuse." },
                { basis: "Consent (Art. 6(1)(a) GDPR)", reason: "The age-gate cookie requires your explicit confirmation before it is set." },
                { basis: "Legal obligation (Art. 6(1)(c) GDPR)", reason: "Responding to lawful requests from authorities." },
              ].map(({ basis, reason }) => (
                <li key={basis} className="flex items-start gap-3">
                  <span className="text-pink-400/60 mt-0.5 flex-shrink-0">—</span>
                  <span>
                    <strong className="text-white/80">{basis}</strong> — {reason}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">3. Third-Party Services</h2>
            <p className="mb-3">
              Links on this site point to external platforms (Patreon, Ko-fi, Throne, Discord,
              etc.). When you visit or transact on those platforms, their own privacy policies
              apply. We do not receive your payment details — any transactions are handled
              entirely by those providers.
            </p>
            <p>
              This site is hosted on Vercel. Vercel may process technical data as a data
              processor on our behalf under their{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-300/70 hover:text-pink-300 underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">4. Retention</h2>
            <ul className="space-y-2">
              {[
                "Age-gate cookie: up to 365 days, or until you clear your browser cookies.",
                "Technical logs: retained only as long as needed for security and diagnostics.",
                "Report submissions: retained only as long as needed to address the issue.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-pink-400/60 mt-0.5 flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">5. Your Rights (EU / EEA)</h2>
            <p className="mb-3">Under GDPR you have the right to:</p>
            <ul className="space-y-1.5">
              {[
                "Access the personal data we hold about you.",
                "Request correction or deletion of your data.",
                "Restrict or object to processing in certain circumstances.",
                "Data portability where processing is based on consent or contract.",
                "Withdraw consent at any time (without affecting prior processing).",
                "Lodge a complaint with your local supervisory authority.",
              ].map((right) => (
                <li key={right} className="flex items-start gap-3">
                  <span className="text-pink-400/60 mt-0.5 flex-shrink-0">—</span>
                  <span>{right}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-white/45 text-xs">
              Austrian supervisory authority:{" "}
              <a
                href="https://www.dsb.gv.at/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400/60 hover:text-pink-300 underline underline-offset-2 transition-colors"
              >
                Österreichische Datenschutzbehörde (DSB)
              </a>
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">6. Minors</h2>
            <p>
              This site is strictly for adults. We do not knowingly collect data from anyone
              under 18. If you believe a minor has submitted data through this site, please
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">7. Changes to This Policy</h2>
            <p>
              Material changes will be reflected in a new "Last updated" date above. Continued
              use of the site after changes constitutes acceptance of the revised Policy.
            </p>
          </section>

          <div className="pt-4 border-t border-white/[0.07]">
            <p className="text-white/40 text-xs">
              Privacy requests or questions?{" "}
              <Link href="/report" className="text-pink-400/60 hover:text-pink-300 transition-colors underline underline-offset-2">
                Use the report form
              </Link>
              {" "}or reach out via{" "}
              <a href="https://discord.gg/e3uzBK2VJS" target="_blank" rel="noopener noreferrer" className="text-pink-400/60 hover:text-pink-300 transition-colors underline underline-offset-2">
                Discord
              </a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
