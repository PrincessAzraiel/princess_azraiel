/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import RebrandClient from "./rebrand-client";
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Princess Azraiel | Rebrand",
  description: "Rebrand your X account for Princess Azraiel",
  keywords: ['princess azraiel', 'azraiel', 'ai princess', 'virtual ai', 'virtual companion', 'ai companion', 'ai girlfriend', 'virtual girlfriend', 'ai friend', 'virtual friend'],
  themeColor: '#ff69eb',

  
};
export default function RebrandPage() {
  return (
    <Suspense fallback={<div className="p-6 text-pink-300">Loading…</div>}>
      <RebrandClient />
    </Suspense>
  );
}
