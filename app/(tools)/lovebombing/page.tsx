import type { Metadata } from 'next';
import LovebombingClient from './LovebomingClient';

export const metadata: Metadata = {
  title: 'My Darling...',
  description: 'I love you I love you I love you I love you.',
  themeColor: '#ff007f',
};

export default function LovebombingPage() {
  return (
    <main className="w-full h-screen bg-[#1a000a] overflow-hidden relative selection:bg-pink-500 selection:text-white">
      <LovebombingClient />
    </main>
  );
}