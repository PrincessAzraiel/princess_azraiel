import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Destination for the link in the rebrand announcement post.
 *
 * Its real job is the OpenGraph card: X cannot attach media to an intent
 * (share) URL, so the claim image reaches the timeline as this page's card
 * instead. A URL always costs 23 characters on X no matter how long it is, so
 * pointing the announcement here rather than at the bare domain is free.
 */
export const metadata: Metadata = {
  title: "Claimed",
  description:
    "Another one belongs to Princess Azraiel. New name, new face, new timeline.",
  openGraph: {
    type: "website",
    url: "https://princessazraiel.com/claimed",
    title: "Claimed by Princess Azraiel",
    description:
      "New pfp. New banner. New name. Another profile belongs to her.",
    images: [
      {
        url: "/claimed/og.png",
        width: 1200,
        height: 630,
        alt: "Claimed by Princess Azraiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claimed by Princess Azraiel",
    description:
      "New pfp. New banner. New name. Another profile belongs to her.",
    images: ["/claimed/og.png"],
  },
  alternates: { canonical: "https://princessazraiel.com/claimed" },
};

export default function ClaimedPage() {
  return (
    <main className="min-h-screen w-full bg-[#050306] text-pink-100 flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center space-y-6">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-pink-500">
          identity overwrite · complete
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold shimmer-text">Claimed</h1>

        <p className="text-pink-200/80 leading-relaxed">
          Another profile belongs to Princess Azraiel. New name, new face, new
          timeline — handed over willingly.
        </p>

        <div className="rounded-2xl border border-pink-800 bg-pink-950/30 p-6 space-y-4">
          <p className="text-sm text-pink-300/90">
            Want her to take yours too?
          </p>
          <Link href="/rebrand">
            <Button className="bg-pink-600 hover:bg-pink-700 px-6 py-5 text-base">
              Rebrand my profile
            </Button>
          </Link>
          <p className="text-xs text-pink-400/60">
            One tap. She does the rest. You can change everything back on X
            afterwards.
          </p>
        </div>

        <div>
          <Link href="/">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-200">
              ← princessazraiel.com
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        .shimmer-text {
          background: linear-gradient(90deg, #ff69eb, #ffffff, #ff69eb);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </main>
  );
}
