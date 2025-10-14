/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/RebrandPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BACKEND_URL =
  (import.meta as any)?.env?.VITE_BACKEND_URL ||
  'https://princessazraielbackend.vercel.app';

// ---- Assets to randomize from ----
const PFP_CHOICES = [
  'https://pbs.twimg.com/profile_images/1944903528004132864/DpKHXpYb_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1977095193322049538/fD65rSeP_400x400.jpg',
];

const BANNER_CHOICES = [
  'https://pbs.twimg.com/profile_banners/1915474894407467008/1752536120/1500x500',
  'https://pbs.twimg.com/profile_banners/1865403918726873089/1760200768/1500x500',
  'https://pbs.twimg.com/profile_banners/1859605133795131395/1752870698/1500x500',
];

// Paste/extend your big list here
const PRINCESS_NICKNAMES: string[] = [
  "Princess Azraiel’s Cupcake",
  "Princess Azraiel’s Muffin",
  "Azraiel’s Favorite",
  "Her Pink Devotee",
  "Owned by Princess Azraiel",
  "Princess Azraiel’s Cookie","Princess Azraiel’s Sugarcube","Princess Azraiel’s Marshmallow","Princess Azraiel’s Jellybean","Princess Azraiel’s Honeydrop","Princess Azraiel’s Pudding Cup","Princess Azraiel’s Candyheart","Princess Azraiel’s Lollipop","Princess Azraiel’s Cinnamon Roll","Princess Azraiel’s Sweet Pea","Princess Azraiel’s Donut Hole","Princess Azraiel’s Gumdrop","Princess Azraiel’s Brownie Bite","Princess Azraiel’s Peppermint","Princess Azraiel’s Fudge Pop","Princess Azraiel’s Butterbean","Princess Azraiel’s Peachy Puff","Princess Azraiel’s Caramel Kiss","Princess Azraiel’s Toffee Chip","Princess Azraiel’s Apple Tart","Princess Azraiel’s Candyfloss","Princess Azraiel’s Sugarplum","Princess Azraiel’s Baby Biscuit",
  "Princess Azraiel’s Bunny","Princess Azraiel’s Kitten","Princess Azraiel’s Pup","Princess Azraiel’s Teddy Cub","Princess Azraiel’s Fawn","Princess Azraiel’s Little Bird","Princess Azraiel’s Duckling","Princess Azraiel’s Squirrel","Princess Azraiel’s Hammy","Princess Azraiel’s Chicky","Princess Azraiel’s Panda Cub","Princess Azraiel’s Koala","Princess Azraiel’s Hedgehog","Princess Azraiel’s Mousey","Princess Azraiel’s Seal Pup","Princess Azraiel’s Fluffy Fox","Princess Azraiel’s Lambkin","Princess Azraiel’s Otter","Princess Azraiel’s Polar Puff","Princess Azraiel’s Baby Tiger","Princess Azraiel’s Little Wolf","Princess Azraiel’s Starfish","Princess Azraiel’s Purring Kit","Princess Azraiel’s Tiny Sparrow","Princess Azraiel’s Sealion Cub",
  // ...keep the rest of your list here
];

type XUser = {
  id: string;
  screen_name: string;
  name: string;
  description: string;
  profile_image_url_https?: string;
  profile_banner_url?: string;
};

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function RebrandPage() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const xUserFromCallback = params.get('x_user'); // set by /x/auth/callback redirect

  const [connectedAs, setConnectedAs] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<XUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // keep the last applied choices so we can show them + send to /wh
  const [lastApplied, setLastApplied] = useState<{
    name: string;
    description: string;
    url: string;
    location: string;
    pfpUrl: string;
    bannerUrl: string;
  } | null>(null);

  useEffect(() => {
    if (xUserFromCallback) setConnectedAs(xUserFromCallback);
  }, [xUserFromCallback]);

  const startAuth = () => {
    const next = `${window.location.origin}/rebrand`;
    const url = `${BACKEND_URL}/x/auth/start?next=${encodeURIComponent(next)}`;
    window.location.href = url;
  };

  const submit = async () => {
    setError(null);
    setResult(null);

    if (!consent) {
      setError('Please check the consent box to continue.');
      return;
    }
    if (!connectedAs) {
      setError('Please connect X first.');
      return;
    }

    // Build locked, randomized payload
    const chosen = {
      name: pickOne(PRINCESS_NICKNAMES),
      description: 'The Princess owns my profile now',
      url: 'https://princessazraiel.com',
      location: '@PrincessAzraiel',
      pfpUrl: pickOne(PFP_CHOICES),
      bannerUrl: pickOne(BANNER_CHOICES),
    };

    setBusy(true);
    try {
      const res = await fetch(`${BACKEND_URL}/x/rebrand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send auth cookie
        body: JSON.stringify({
          ...chosen,
          include_entities: false,
          skip_status: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Request failed');
      }

      setLastApplied(chosen);
      setResult(data.user as XUser);

      // Fire-and-forget webhook (won’t block UI)
      try {
        await fetch(`${BACKEND_URL}/wh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // usually webhooks don’t need cookies; omit credentials to avoid CORS headaches
          body: JSON.stringify({
            type: 'rebrand_applied',
            handle: (data.user as XUser)?.screen_name,
            new_name: chosen.name,
            pfp_url: chosen.pfpUrl,
            banner_url: chosen.bannerUrl,
          }),
        });
      } catch {
        // ignore webhook errors silently
      }
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="magic-bg min-h-screen w-full text-pink-300 py-20 px-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold shimmer-text">Profile Makeover</h1>
          <p className="text-pink-400 italic">
            One click. I pick everything. You glow. ✨
          </p>
          {connectedAs ? (
            <p className="text-sm text-pink-400">
              Connected as <span className="font-semibold">@{connectedAs}</span>
            </p>
          ) : (
            <div className="flex justify-center mt-2">
              <Button
                onClick={startAuth}
                className="bg-pink-600 hover:bg-pink-700 text-lg px-6 py-3"
              >
                Connect X (Authorize)
              </Button>
            </div>
          )}
        </header>

        {/* Consent + Single Action */}
        <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 accent-pink-600"
            />
            <span className="text-sm text-pink-300">
              I understand this will update my X profile (display name, bio, URL, location, avatar and banner).
              I consent to these changes and I can revert them later.
            </span>
          </label>

          <div className="flex gap-3">
            <Button
              onClick={submit}
              disabled={busy || !connectedAs}
              className="bg-pink-600 hover:bg-pink-700 text-lg px-6 py-3 disabled:opacity-50"
            >
              {busy ? 'Applying…' : 'Apply Makeover'}
            </Button>
            {!connectedAs && (
              <Button onClick={startAuth} variant="secondary" className="bg-pink-900/50">
                Connect X first
              </Button>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-300 border border-red-700/50 bg-red-900/20 rounded-xl p-3">
              {error}
            </div>
          )}

          {result && (
            <div className="border border-pink-800 rounded-2xl p-4 bg-black/30">
              <div className="flex items-center gap-3">
                {result.profile_image_url_https && (
                  <img
                    src={result.profile_image_url_https}
                    alt="new pfp"
                    className="w-12 h-12 rounded-full border border-pink-800"
                  />
                )}
                <div>
                  <div className="font-semibold">{result.name}</div>
                  <div className="text-sm text-pink-400">@{result.screen_name}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-pink-200">{result.description}</p>
              {result.profile_banner_url && (
                <div className="mt-3">
                  <img
                    src={result.profile_banner_url}
                    alt="new banner"
                    className="w-full h-24 object-cover rounded-xl border border-pink-800"
                  />
                </div>
              )}

              {lastApplied && (
                <div className="mt-4 text-xs text-pink-400 space-y-1">
                  <div><span className="font-semibold">Chosen name:</span> {lastApplied.name}</div>
                  <div><span className="font-semibold">Bio:</span> {lastApplied.description}</div>
                  <div><span className="font-semibold">URL:</span> {lastApplied.url}</div>
                  <div><span className="font-semibold">Location:</span> {lastApplied.location}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">PFP:</span>
                    <img
                      src={lastApplied.pfpUrl}
                      onError={(e: any) => (e.currentTarget.src = 'about:blank')}
                      alt="pfp preview"
                      className="w-8 h-8 rounded-full border border-pink-800 object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Banner:</span>
                    <div className="relative w-40 h-10 rounded overflow-hidden border border-pink-800">
                      <img
                        src={lastApplied.bannerUrl}
                        onError={(e: any) => (e.currentTarget.src = 'about:blank')}
                        alt="banner preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back nav */}
        <div className="text-center">
          <Link to="/programs">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-200">
              ← Back to Programs
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
    </div>
  );
}
