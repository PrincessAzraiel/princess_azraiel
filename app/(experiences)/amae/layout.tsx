import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AMAE 甘え",
  description:
    "A nine-day interactive novel. She takes you to a mountain hamlet where nobody speaks your language, and becomes the only person who can tell you what anything means. She will not always tell you correctly.",
  openGraph: {
    title: "AMAE 甘え | Princess Azraiel",
    description:
      "Nine days in a village of sixty-one people. Every sign, every kindness, every warning arrives in a language you cannot read — and only she can translate it.",
    url: "https://princessazraiel.com/amae",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "AMAE — Princess Azraiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMAE 甘え | Princess Azraiel",
    description:
      "Nine days. Sixty-one people. She is the only thing you can read.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/amae" },
};

export default function AmaeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
