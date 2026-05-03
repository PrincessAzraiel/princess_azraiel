import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Princess Azraiel",
  description: "Terms of Service for princessazraiel.com. Adults only (18+).",
  alternates: { canonical: "https://princessazraiel.com/terms" },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "May 3, 2026";

export default function TermsPage() {
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
            Terms of <em className="italic text-pink-300">Service</em>
          </h1>
          <p className="manrope text-sm text-white/40">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-8 manrope text-sm text-white/65 leading-relaxed">

          <p className="text-white/50">
            These Terms of Service govern your access to and use of{" "}
            <span className="text-pink-300/80">princessazraiel.com</span> and all content and
            services available through it (the "Service"). By entering and using the Service,
            you agree to be bound by these Terms.
          </p>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">1. Age Requirement</h2>
            <p>
              The Service contains adult-themed fictional content and is intended{" "}
              <strong className="text-white/80">solely for persons 18 years of age or older</strong>{" "}
              (or the age of majority in your jurisdiction, whichever is higher). By accessing the
              Service you represent and warrant that you meet this requirement and that accessing
              such content is lawful in your location. You must not allow any minor to access the
              Service.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">2. Nature of Content</h2>
            <p>
              All content on this Service — including programs, text, audio, visuals, and
              interactive experiences — is fictional and created for entertainment purposes only.
              Nothing on this Service constitutes real-world instruction, professional advice, or
              consent to any real-world activity. You are solely responsible for how you choose to
              engage with it.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">3. Acceptable Use</h2>
            <ul className="space-y-2 list-none">
              {[
                "You will not share any content from this Service with minors or facilitate minors accessing it.",
                "You will not reproduce, redistribute, or resell any content without prior written permission.",
                "You will not attempt to reverse-engineer, scrape at scale, or disrupt the Service.",
                "You will not use the Service to harass, stalk, or harm Princess Azraiel or any other person.",
                "You will not engage in illegal activity in connection with the Service.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-pink-400/60 mt-0.5 flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">4. Intellectual Property</h2>
            <p>
              All content on the Service — artwork, writing, programs, audio, code, and branding —
              is the intellectual property of Princess Azraiel unless otherwise stated. You may not
              reproduce, distribute, or create derivative works without explicit prior written
              permission, except as permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">5. Third-Party Platforms</h2>
            <p>
              Certain links and features connect you to third-party platforms (Patreon, Ko-fi,
              Throne, Discord, etc.). Those services are governed solely by their own terms and
              privacy policies. We are not responsible for the practices or content of any
              third-party service.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">6. Privacy</h2>
            <p>
              Your use of the Service is also subject to our{" "}
              <Link href="/privacy" className="text-pink-300/80 hover:text-pink-300 underline underline-offset-2 transition-colors">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">7. Disclaimers</h2>
            <p>
              The Service is provided "as is" and "as available" without any warranties, express or
              implied. We do not guarantee uninterrupted or error-free operation. We reserve the
              right to modify, suspend, or discontinue any part of the Service at any time without
              notice.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Princess Azraiel shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages
              arising from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">9. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be reflected in a
              new "Last updated" date at the top of this page. Continued use of the Service after
              changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="italiana text-2xl text-white mb-3">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Austria. Mandatory consumer protection rules
              of your country of residence may still apply where required by law.
            </p>
          </section>

          <div className="pt-4 border-t border-white/[0.07]">
            <p className="text-white/40 text-xs">
              Questions?{" "}
              <Link href="/report" className="text-pink-400/60 hover:text-pink-300 transition-colors underline underline-offset-2">
                Contact via report form
              </Link>
              {" "}or reach out through{" "}
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
