/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/RebrandPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BACKEND_URL =
  (import.meta as any)?.env?.VITE_BACKEND_URL ||
  'https://princessazraielbackend.vercel.app'; // <-- change if needed

type XUser = {
  id: string;
  screen_name: string;
  name: string;
  description: string;
  profile_image_url_https?: string;
  profile_banner_url?: string;
};

export default function RebrandPage() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const xUserFromCallback = params.get('x_user'); // set by /x/auth/callback redirect

  // form state (placeholders you can tweak anytime)
  const [name, setName] = useState('Princess Azraiel’s Favorite');
  const [description, setDescription] = useState('I consented to the makeover 💗');
  const [url, setUrl] = useState('https://princessazraiel.com');
  const [location, setLocation] = useState('🌐');
  const [pfpUrl, setPfpUrl] = useState(
    'https://media.discordapp.net/attachments/1356980682798268446/1427701204338737274/2be5086516b9ed954fcdea74d42f4556.jpg?ex=68efd1dc&is=68ee805c&hm=88721f1e48b0543d5e86dba1116f0ffd127fe2d0bcb045ebb269aca0736e1716&=&format=webp'
  );
  const [bannerUrl, setBannerUrl] = useState(
    'https://pbs.twimg.com/profile_banners/1798486097267179520/1743975461/1500x500'
  );

  const [connectedAs, setConnectedAs] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<XUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If we came back from X with ?x_user=..., show it
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
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND_URL}/x/rebrand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // IMPORTANT: send auth cookie
        body: JSON.stringify({
          name,
          description,
          url,
          location,
          pfpUrl,
          bannerUrl,
          include_entities: false,
          skip_status: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Request failed');
      }
      setResult(data.user as XUser);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const fillAzraielPreset = () => {
    setName('Princess Azraiel’s Favorite');
    setDescription('I consented to the makeover 💗');
    setUrl('https://princessazraiel.com');
    setLocation('🌐');
    setPfpUrl('https://media.discordapp.net/attachments/1356980682798268446/1427701204338737274/2be5086516b9ed954fcdea74d42f4556.jpg?ex=68efd1dc&is=68ee805c&hm=88721f1e48b0543d5e86dba1116f0ffd127fe2d0bcb045ebb269aca0736e1716&=&format=webp');
    setBannerUrl('https://pbs.twimg.com/profile_banners/1798486097267179520/1743975461/1500x500');
  };

  const fillSoftPreset = () => {
    setName('Devoted Cutie');
    setDescription('Be kind. Be brave. Be owned. ✨');
    setUrl('https://example.com');
    setLocation('In my healing arc');
    setPfpUrl('https://media.discordapp.net/attachments/1356980682798268446/1427701204338737274/2be5086516b9ed954fcdea74d42f4556.jpg?ex=68efd1dc&is=68ee805c&hm=88721f1e48b0543d5e86dba1116f0ffd127fe2d0bcb045ebb269aca0736e1716&=&format=webp');
    setBannerUrl('https://pbs.twimg.com/profile_banners/1798486097267179520/1743975461/1500x500');
  };

  return (
    <div className="magic-bg min-h-screen w-full text-pink-300 py-20 px-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold shimmer-text">Profile Makeover</h1>
          <p className="text-pink-400 italic">
            Rebrand your X profile after authorizing—name, bio, avatar, banner.
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

        {/* Presets */}
        <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="text-pink-300 font-semibold">Quick presets</div>
            <div className="flex gap-2">
              <Button onClick={fillAzraielPreset} className="bg-pink-600 hover:bg-pink-700">
                Azraiel preset
              </Button>
              <Button onClick={fillSoftPreset} variant="secondary" className="bg-pink-900/50">
                Soft preset
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 shimmer-text">Profile Text</h2>

            <label className="block text-sm mb-1 text-pink-400">Display name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full mb-4 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              maxLength={50}
            />

            <label className="block text-sm mb-1 text-pink-400">Bio / Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full mb-4 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-pink-600"
              maxLength={160}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-pink-400">URL</label>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-pink-400">Location</label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  maxLength={30}
                />
              </div>
            </div>
          </div>

          <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 shimmer-text">Images</h2>

            <label className="block text-sm mb-1 text-pink-400">Avatar (URL)</label>
            <input
              value={pfpUrl}
              onChange={e => setPfpUrl(e.target.value)}
              className="w-full mb-3 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="https://media.discordapp.net/attachments/1356980682798268446/1427701204338737274/2be5086516b9ed954fcdea74d42f4556.jpg?ex=68efd1dc&is=68ee805c&hm=88721f1e48b0543d5e86dba1116f0ffd127fe2d0bcb045ebb269aca0736e1716&=&format=webp"
            />
            <div className="flex items-center gap-3 mb-5">
              <img
                src={pfpUrl}
                onError={(e: any) => (e.currentTarget.src = 'about:blank')}
                alt="pfp preview"
                className="w-16 h-16 rounded-full border border-pink-800 object-cover"
              />
              <span className="text-xs text-pink-400">
                Tip: &lt;= 700 KB (PNG/JPG/GIF). Animated GIF becomes static.
              </span>
            </div>

            <label className="block text-sm mb-1 text-pink-400">Banner (URL)</label>
            <input
              value={bannerUrl}
              onChange={e => setBannerUrl(e.target.value)}
              className="w-full mb-3 rounded-xl bg-black/40 border border-pink-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="https://pbs.twimg.com/profile_banners/1798486097267179520/1743975461/1500x500"
            />
            <div className="relative w-full h-24 rounded-xl overflow-hidden border border-pink-800">
              <img
                src={bannerUrl}
                onError={(e: any) => (e.currentTarget.src = 'about:blank')}
                alt="banner preview"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Consent + Submit */}
        <div className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 accent-pink-600"
            />
            <span className="text-sm text-pink-300">
              I understand this will update my X profile (display name, bio, URL, location,
              avatar and banner). I consent to these changes and I can revert them later.
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
