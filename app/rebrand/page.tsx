/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import RebrandClient from "./rebrand-client";

export default function RebrandPage() {
  return (
    <Suspense fallback={<div className="p-6 text-pink-300">Loading…</div>}>
      <RebrandClient />
    </Suspense>
  );
}
