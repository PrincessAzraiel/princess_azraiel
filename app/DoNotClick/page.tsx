import type { Metadata } from 'next';
import DoNotClickClient from './DoNotClickClient';

export const metadata: Metadata = {
  title: '❤️ DO NOT ENTER ❤️',
  description: 'NEVER EVER CLICK THIS PAGE. TURN BACK NOW. YOU HAVE BEEN WARNED.',
  robots: 'noindex, nofollow',
  themeColor: '#4a0000',
  openGraph: {
    title: 'JUST US',
    description: 'There is nobody else.',
    images: ['/redroom/image.png'], // Ideally a corrupted heart image
  },
  other: {
    'darkreader-lock': 'true',
  },
};

export default function DoNotClickPage() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden relative selection:bg-pink-900/50 selection:text-red-500 cursor-none">
      <DoNotClickClient />
      
      {/* Background Noise Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50 contrast-200"></div>
    </main>
  );
}