"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-pink-300 bg-black">
      <h1 className="text-5xl font-bold mb-4">404 — Lost in the corruption</h1>
      <p className="text-pink-400">The page you seek has been consumed by Azraiel’s code.</p>
    </div>
  );
}
