import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AMAE 甘え",
  description:
    "A ten-chapter interactive novel. She takes you to a mountain hamlet where nobody speaks your language, and leaves you a shelf of books to teach yourself from. Every character in them is real. Your readings are correct. You are genuinely learning.",
  openGraph: {
    title: "AMAE 甘え | Princess Azraiel",
    description:
      "Forty houses, sixty-one people, one bus a day, and nobody with a word of your language. She does not offer to teach you. She points you at the shelf and lets you thank her for it.",
    url: "https://princessazraiel.com/amae",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "AMAE 甘え · Princess Azraiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMAE 甘え | Princess Azraiel",
    description:
      "You are genuinely learning, and you will get better every week. You will simply never be taught how to say I have decided.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/amae" },
};

export default function AmaeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
