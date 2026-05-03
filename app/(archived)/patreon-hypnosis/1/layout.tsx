import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Session — Princess Azraiel",
  description: "A guided hypnosis session for Princess Azraiel's Patreon members.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
