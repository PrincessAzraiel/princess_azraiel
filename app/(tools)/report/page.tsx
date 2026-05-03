"use client";

import { useState } from "react";

const REPORT_ENDPOINT = "/api/report"; // ⬅️ change to your Express/Vercel route

export default function ReportPage() {
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(REPORT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: form.get("url"),
          category: form.get("category"),
          details: form.get("details"),
          email: form.get("email"),
          consentContact: form.get("consentContact") === "on",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
      setMessage("Thanks. Your report was submitted.");
      e.currentTarget.reset();
    } catch (err: any) {
      setStatus("err");
      setMessage("Submission failed. Please try again or email report@princessazraiel.example");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-pink-100">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-pink-300">Report Content</h1>
        <p className="mt-2 text-pink-100/80">
          THIS PAGE DOESNT WORK FULLY YET YOU DUMBASSES mwah. Use this form to report potentially unlawful or non-compliant content.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-pink-400/30 bg-black/60 p-6 shadow-2xl">
        <div>
          <label className="block text-sm mb-1">URL or page path *</label>
          <input
            required
            name="url"
            type="text"
            placeholder="/some-page or https://example.com/some-page"
            className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category *</label>
          <select
            required
            name="category"
            className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="minor-access">Minor access risk</option>
            <option value="illegal-content">Potentially illegal content</option>
            <option value="copyright">Copyright / IP</option>
            <option value="harassment">Harassment / Abuse</option>
            <option value="other">Other policy concern</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Describe the issue *</label>
          <textarea
            required
            name="details"
            rows={6}
            placeholder="Please include context, timestamps, and why you believe this violates law or policy."
            className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Your email (optional)</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
          />
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="consentContact" className="accent-pink-500" />
            You may contact me about this report.
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-2xl border border-emerald-400/40 bg-emerald-600/20 px-6 py-3 font-semibold text-emerald-200 hover:bg-emerald-600/30 disabled:opacity-50"
          >
            {status === "sending" ? "Submitting…" : "Submit report"}
          </button>
          <a
            href="mailto:report@princessazraiel.example"
            className="rounded-2xl border border-pink-400/40 bg-pink-600/20 px-6 py-3 font-semibold text-pink-200 hover:bg-pink-600/30"
          >
            Email us instead
          </a>
        </div>

        {status !== "idle" && (
          <p className={`text-sm ${status === "ok" ? "text-emerald-300" : status === "err" ? "text-red-300" : "text-pink-100/80"}`}>
            {message}
          </p>
        )}
      </form>

      <p className="mt-6 text-xs text-pink-100/60">
        We take reports seriously. Submitting false or malicious reports may be a violation of our Terms.
        For urgent legal issues, contact{" "}
        <a className="underline" href="mailto:legal@princessazraiel.example">legal@princessazraiel.example</a>.
      </p>
    </main>
  );
}
