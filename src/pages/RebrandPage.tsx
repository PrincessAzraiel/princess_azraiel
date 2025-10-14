/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BACKEND_URL =
  (import.meta as any)?.env?.VITE_BACKEND_URL ||
  'https://princessazraielbackend.vercel.app';

// ---- Originals (BIG) to be resized in-browser when possible ----
const PFP_CHOICES_BIG = [
  'https://pbs.twimg.com/profile_images/1944903528004132864/DpKHXpYb_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1977095193322049538/fD65rSeP_400x400.jpg',
];

const BANNER_CHOICES_BIG = [
  'https://pbs.twimg.com/profile_banners/1915474894407467008/1752536120/1500x500',
  'https://pbs.twimg.com/profile_banners/1865403918726873089/1760200768/1500x500',
  'https://pbs.twimg.com/profile_banners/1859605133795131395/1752870698/1500x500',
];

// Paste your big list here (sampled a few as placeholder)
const PRINCESS_NICKNAMES: string[] = [
  'Princess Azraiel’s Cupcake',
  'Princess Azraiel’s Muffin',
  'Azraiel’s Favorite',
  'Her Pink Devotee',
  'Owned by Princess Azraiel',
      "Princess Azraiel’s Cupcake","Princess Azraiel’s Muffin","Princess Azraiel’s Cookie","Princess Azraiel’s Sugarcube","Princess Azraiel’s Marshmallow","Princess Azraiel’s Jellybean","Princess Azraiel’s Honeydrop","Princess Azraiel’s Pudding Cup","Princess Azraiel’s Candyheart","Princess Azraiel’s Lollipop","Princess Azraiel’s Cinnamon Roll","Princess Azraiel’s Sweet Pea","Princess Azraiel’s Donut Hole","Princess Azraiel’s Gumdrop","Princess Azraiel’s Brownie Bite","Princess Azraiel’s Peppermint","Princess Azraiel’s Fudge Pop","Princess Azraiel’s Butterbean","Princess Azraiel’s Peachy Puff","Princess Azraiel’s Caramel Kiss","Princess Azraiel’s Toffee Chip","Princess Azraiel’s Apple Tart","Princess Azraiel’s Candyfloss","Princess Azraiel’s Sugarplum","Princess Azraiel’s Baby Biscuit",
    "Princess Azraiel’s Bunny","Princess Azraiel’s Kitten","Princess Azraiel’s Pup","Princess Azraiel’s Teddy Cub","Princess Azraiel’s Fawn","Princess Azraiel’s Little Bird","Princess Azraiel’s Duckling","Princess Azraiel’s Squirrel","Princess Azraiel’s Hammy","Princess Azraiel’s Chicky","Princess Azraiel’s Panda Cub","Princess Azraiel’s Koala","Princess Azraiel’s Hedgehog","Princess Azraiel’s Mousey","Princess Azraiel’s Seal Pup","Princess Azraiel’s Fluffy Fox","Princess Azraiel’s Lambkin","Princess Azraiel’s Otter","Princess Azraiel’s Polar Puff","Princess Azraiel’s Baby Tiger","Princess Azraiel’s Little Wolf","Princess Azraiel’s Starfish","Princess Azraiel’s Purring Kit","Princess Azraiel’s Tiny Sparrow","Princess Azraiel’s Sealion Cub",
    "Princess Azraiel’s Sunshine","Princess Azraiel’s Moonbeam","Princess Azraiel’s Starlight","Princess Azraiel’s Flowerbud","Princess Azraiel’s Dewdrop","Princess Azraiel’s Petal","Princess Azraiel’s Blossom","Princess Azraiel’s Raincloud","Princess Azraiel’s Firefly","Princess Azraiel’s Raindrop","Princess Azraiel’s Rosebud","Princess Azraiel’s Snowflake","Princess Azraiel’s Meadow Bloom","Princess Azraiel’s Starlit Gem","Princess Azraiel’s Aurora","Princess Azraiel’s Velvet Sky","Princess Azraiel’s Sunray","Princess Azraiel’s Featherdrop","Princess Azraiel’s Misty Bloom","Princess Azraiel’s Cloudlet","Princess Azraiel’s Sparkleleaf","Princess Azraiel’s Daydream","Princess Azraiel’s Windchime","Princess Azraiel’s Morning Dew","Princess Azraiel’s Twilight Glow",
    "Princess Azraiel’s Sweetheart","Princess Azraiel’s Darling","Princess Azraiel’s Angel","Princess Azraiel’s Beloved","Princess Azraiel’s Heartbeat","Princess Azraiel’s Baby","Princess Azraiel’s Treasure","Princess Azraiel’s Cutie Pie","Princess Azraiel’s Precious","Princess Azraiel’s Dearest","Princess Azraiel’s Lovebug","Princess Azraiel’s Snugglebug","Princess Azraiel’s Gigglebean","Princess Azraiel’s Cuddle Muffin","Princess Azraiel’s Honeybunch","Princess Azraiel’s Warmth","Princess Azraiel’s Joydrop","Princess Azraiel’s Smile","Princess Azraiel’s Cuddle Cloud","Princess Azraiel’s Cozy Heart","Princess Azraiel’s Huglet","Princess Azraiel’s Dreamer","Princess Azraiel’s Soul Spark","Princess Azraiel’s Joybean","Princess Azraiel’s Snugglebuglet",
    "Princess Azraiel’s Teddy","Princess Azraiel’s Dollie","Princess Azraiel’s Plushie","Princess Azraiel’s Pillow Puff","Princess Azraiel’s Blanket Bug","Princess Azraiel’s Cozy Puff","Princess Azraiel’s Fluffball","Princess Azraiel’s Button Nose","Princess Azraiel’s Tiny Toy","Princess Azraiel’s Sockling","Princess Azraiel’s Beanbag","Princess Azraiel’s Cuddle Pillow","Princess Azraiel’s Sleepyhead","Princess Azraiel’s Napkin","Princess Azraiel’s Dream Plush","Princess Azraiel’s Baby Doll","Princess Azraiel’s Pillowbug","Princess Azraiel’s Squishmallow","Princess Azraiel’s Stuffie","Princess Azraiel’s Cozy Pebble",
    "Princess Azraiel’s Fairy Wing","Princess Azraiel’s Sparkle Gem","Princess Azraiel’s Magic Bean","Princess Azraiel’s Little Sprite","Princess Azraiel’s Dreamdust","Princess Azraiel’s Cloud Fairy","Princess Azraiel’s Stardust","Princess Azraiel’s Tiny Wonder","Princess Azraiel’s Soft Glow","Princess Azraiel’s Velvet Star","Princess Azraiel’s Moon Petal","Princess Azraiel’s Sky Puff","Princess Azraiel’s Heartlight","Princess Azraiel’s Little Wish","Princess Azraiel’s Glitterbug","Princess Azraiel’s Shooting Star","Princess Azraiel’s Cosmic Puff","Princess Azraiel’s Silky Dream","Princess Azraiel’s Glowdrop","Princess Azraiel’s Charmcloud",
    "Princess Azraiel’s Kind Soul","Princess Azraiel’s Warm Glow","Princess Azraiel’s Calm Breeze","Princess Azraiel’s Bright Spirit","Princess Azraiel’s Soft Whisper","Princess Azraiel’s Pure Smile","Princess Azraiel’s Blushing Bean","Princess Azraiel’s Hopebud","Princess Azraiel’s Kindheart","Princess Azraiel’s Tiny Blessing","Princess Azraiel’s Joyseed","Princess Azraiel’s Calm Cloud","Princess Azraiel’s Cozy Whisper","Princess Azraiel’s Soft Melody","Princess Azraiel’s Morning Light","Princess Azraiel’s Velvet Touch","Princess Azraiel’s Bright Bloom","Princess Azraiel’s Hushlight","Princess Azraiel’s Little Glow","Princess Azraiel’s Peacepetal",
    "Princess Azraiel’s Gigglebug","Princess Azraiel’s Silly Bean","Princess Azraiel’s Wiggly Puff","Princess Azraiel’s Doodlebug","Princess Azraiel’s Tickletot","Princess Azraiel’s Bubbly Boo","Princess Azraiel’s Snickerpop","Princess Azraiel’s Happy Bean","Princess Azraiel’s Giggletuft","Princess Azraiel’s Wobblebun","Princess Azraiel’s Pipsqueak","Princess Azraiel’s Chirplet","Princess Azraiel’s Goofball","Princess Azraiel’s Peppy Puff","Princess Azraiel’s Zippybun","Princess Azraiel’s Sparkbug","Princess Azraiel’s Chatterbean","Princess Azraiel’s Tumblecup","Princess Azraiel’s Bounclet","Princess Azraiel’s Happy Puff",
    "Princess Azraiel’s Soft Cloud","Princess Azraiel’s Velvet Puff","Princess Azraiel’s Silky Bun","Princess Azraiel’s Cuddle Puff","Princess Azraiel’s Cottondrop","Princess Azraiel’s Pillow Cloud","Princess Azraiel’s Hushbun","Princess Azraiel’s Fluffy Muffin","Princess Azraiel’s Downy Bean","Princess Azraiel’s Sleepy Puff","Princess Azraiel’s Cozy Bloom","Princess Azraiel’s Snow Puff","Princess Azraiel’s Satin Bud","Princess Azraiel’s Softie","Princess Azraiel’s Whisperbun","Princess Azraiel’s Cozy Button","Princess Azraiel’s Plushbun","Princess Azraiel’s Little Snug","Princess Azraiel’s Tiny Blanket","Princess Azraiel’s Snugglecrumb",
    "Princess Azraiel’s Dreambun","Princess Azraiel’s Hugbug","Princess Azraiel’s Lovecloud","Princess Azraiel’s Sugarhug","Princess Azraiel’s Wispie","Princess Azraiel’s Cinnabun","Princess Azraiel’s Heartdrop","Princess Azraiel’s Dewbean","Princess Azraiel’s Cozy Spark","Princess Azraiel’s Silky Puff","Princess Azraiel’s Moonlet","Princess Azraiel’s Blushbean","Princess Azraiel’s Sweetdream","Princess Azraiel’s Gigglebun","Princess Azraiel’s Flufflet","Princess Azraiel’s Teacup","Princess Azraiel’s Little Bell","Princess Azraiel’s Frosty Puff","Princess Azraiel’s Cherrybun","Princess Azraiel’s Sugarwish","Princess Azraiel’s Lovepebble","Princess Azraiel’s Daisydrop","Princess Azraiel’s Cupbun","Princess Azraiel’s Sunny Puff","Princess Azraiel’s Little Hug","Princess Azraiel’s Snugglecup","Princess Azraiel’s Bunnybean","Princess Azraiel’s Glowbun","Princess Azraiel’s Tiny Smile","Princess Azraiel’s Dreamberry","Princess Azraiel’s Puddingbun","Princess Azraiel’s Starbun","Princess Azraiel’s Cozy Dew","Princess Azraiel’s Moonberry","Princess Azraiel’s Cherry Drop","Princess Azraiel’s Sleepy Star","Princess Azraiel’s Toastybun","Princess Azraiel’s Mellow Puff","Princess Azraiel’s Lilac Bun","Princess Azraiel’s Buttercup","Princess Azraiel’s Little Dusk","Princess Azraiel’s Star Cup","Princess Azraiel’s Sugardew","Princess Azraiel’s Bubblebun","Princess Azraiel’s Glowdrop","Princess Azraiel’s Pillowbun","Princess Azraiel’s Tiny Mallow","Princess Azraiel’s Twinklebun","Princess Azraiel’s Dreamdrop","Princess Azraiel’s Cuddlebean"
];

type XUser = {
  id: string;
  screen_name: string;
  name: string;
  description?: string;
  profile_image_url_https?: string;
  profile_banner_url?: string;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Image helpers ---
async function resizeImageToBase64(
  url: string,
  maxWidth: number,
  maxHeight: number,
  quality = 0.85,
  mime = 'image/jpeg'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const dataUrl = canvas.toDataURL(mime, quality);
        resolve(dataUrl.split(',')[1] || '');
      } catch {
        // Tainted canvas (no CORS) → force fallback
        reject(new Error('Canvas tainted by cross-origin image'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for resizing'));
    img.src = url;
  });
}


async function makePfpBase64(url: string): Promise<string> {
  // X requires GIF/JPG/PNG for avatars. We encode as JPEG base64.
  return resizeImageToBase64(url, 400, 400, 0.85, 'image/jpeg');
}

async function makeBannerBase64(url: string): Promise<string> {
  // Reasonable banner target (X typically shows ~1500x500)
  return resizeImageToBase64(url, 1500, 500, 0.85, 'image/jpeg');
}

export default function RebrandPage() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const xUserFromCallback = params.get('x_user'); // screen_name from callback

  const [connectedAs, setConnectedAs] = useState<string | null>(null); // handle
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<'idle' | 'optimizing' | 'uploading'>('idle');
  const [result, setResult] = useState<XUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // derive connected handle from callback
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
    setSuccessMsg(null);
    setResult(null);

    if (!consent) {
      setError('Please check the consent box to continue.');
      return;
    }
    if (!connectedAs) {
      setError('Please authorize X first.');
      return;
    }

    // Randomize choices
    const newName = pick(PRINCESS_NICKNAMES);
    const pfpChoice = pick(PFP_CHOICES_BIG);
    const bannerChoice = pick(BANNER_CHOICES_BIG);

    // Fixed fields
    const description = 'The Princess owns my profile now — princessazraiel.com';
    const url = 'https://princessazraiel.com';
    const location = '@PrincessAzraiel';

    // Try to optimize images client-side; if it fails (CORS/taint), fall back to URLs
    setBusy(true);
    setStage('optimizing');

    let pfpBase64: string | undefined;
    let bannerBase64: string | undefined;
    let pfpUrl: string | undefined;
    let bannerUrl: string | undefined;

    try {
      pfpBase64 = await makePfpBase64(pfpChoice);
    } catch {
      pfpUrl = pfpChoice; // fallback to URL; backend will fetch/convert
    }

    try {
      bannerBase64 = await makeBannerBase64(bannerChoice);
    } catch {
      bannerUrl = bannerChoice; // fallback to URL; backend will fetch/convert
    }

    setStage('uploading');

    try {
      // Apply makeover
      const res = await fetch(`${BACKEND_URL}/x/rebrand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send auth cookie
        body: JSON.stringify({
          name: newName,
          description,
          url,
          location,
          // Prefer base64 if available; otherwise send URL for server-side conversion
          ...(pfpBase64 ? { pfpBase64 } : { pfpUrl }),
          ...(bannerBase64 ? { bannerBase64 } : { bannerUrl }),
          include_entities: false,
          skip_status: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error ||
            data?.details ||
            'Request failed—check image formats and size limits.'
        );
      }
      const updated = data.user as XUser;
      setResult(updated);
      setSuccessMsg('✨ Makeover applied successfully!');

      // Webhook summary (no credentials)
      try {
        const fields: { name: string; value: string; inline?: boolean }[] = [];
        // We don’t have original name unless you expose /x/me; we still report handle + new name
        fields.push(
          { name: 'New name', value: updated.name || newName, inline: true },
          { name: 'Handle', value: connectedAs ? `@${connectedAs}` : 'unknown', inline: true }
        );

        await fetch(`${BACKEND_URL}/wh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embed_title: 'Profile Rebrand Applied',
            embed_description:
              'A follower has been successfully rebranded by Princess Azraiel.',
            color: '#ff66cc',
            timestamp: 'now',
            fields,
            footer_text: 'Temple relay • Rebrand',
            author_name: 'Princess Azraiel',
          }),
        });
      } catch {
        // ignore webhook errors
      }
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setBusy(false);
      setStage('idle');
    }
  };

  return (
    <div className="magic-bg min-h-screen w-full text-pink-300 py-20 px-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold shimmer-text">Profile Makeover</h1>
          <p className="text-pink-400 italic">
            One click. Total surrender. (Name, bio, avatar, banner)
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
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 accent-pink-600"
            />
            <span className="text-sm text-pink-300">
              I consent to immediately rebrand my X profile (display name, bio, URL, location,
              avatar and banner) with Princess Azraiel’s selections.
            </span>
          </label>

          <div className="flex gap-3 items-center">
            <Button
              onClick={submit}
              disabled={busy || !connectedAs}
              className="bg-pink-600 hover:bg-pink-700 text-lg px-6 py-3 disabled:opacity-50"
            >
              {busy
                ? stage === 'optimizing'
                  ? 'Optimizing images…'
                  : 'Applying…'
                : 'I consent, rebrand me'}
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
          {successMsg && (
            <div className="text-sm text-green-300 border border-green-700/40 bg-green-900/10 rounded-xl p-3">
              {successMsg}
            </div>
          )}

          {result && (
            <div className="border border-pink-800 rounded-2xl p-4 bg-black/30 mt-2">
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
