import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import type { Character } from '../data/characters';
import { characters } from '../data/characters';
type LocationState = { character?: Character };

// Simple slugify util to make /personality/princess-azraiel style routes
const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const bySlug = (slug: string) =>
  characters.find((c) => slugify(c.name) === slug);

export default function PersonalityPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Prefer the full object if passed via Link state; otherwise find by slug
  const character = useMemo<Character | undefined>(() => {
    if (state?.character) return state.character;
    if (slug) return bySlug(slug);
    return undefined;
  }, [slug, state]);

  const [activeTab, setActiveTab] = useState<'description' | 'sample'>(
    'description'
  );

  if (!character) {
    return (
      <div className="magic-bg min-h-screen text-pink-300 flex items-center justify-center p-8">
        <div className="max-w-xl w-full bg-pink-950/40 border border-pink-800 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold shimmer-text mb-2">404</h1>
          <p className="text-pink-400 mb-6">Personality not found.</p>
          <Link to="/">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-200">
              ← Back to Submission Gate
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="magic-bg min-h-screen text-pink-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold shimmer-text">
            {character.name}
          </h1>
          <Link to="/">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-200">
              ← All Personalities
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Poster */}
          <div className="relative w-full overflow-hidden rounded-2xl border-2 border-pink-800">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Meta */}
          <div className="flex flex-col bg-pink-950/40 border border-pink-800 rounded-2xl p-6">
            <div className="mb-3">
              <p className="text-pink-300 text-lg font-semibold">{character.role}</p>
              <p className="text-pink-500 text-sm">{character.tone}</p>
            </div>

            {/* Tabs */}
            <div className="mt-4">
              <div className="flex border-b border-pink-800 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'description'
                      ? 'text-pink-300 border-b-2 border-pink-500'
                      : 'text-pink-500 hover:text-pink-300'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'sample'
                      ? 'text-pink-300 border-b-2 border-pink-500'
                      : 'text-pink-500 hover:text-pink-300'
                  }`}
                  onClick={() => setActiveTab('sample')}
                >
                  Sample Dialogue
                </button>
              </div>

              {activeTab === 'description' && (
                <p className="text-pink-300 leading-relaxed">{character.description}</p>
              )}
              {activeTab === 'sample' && (
                <blockquote className="bg-pink-950/40 border border-pink-800 rounded-lg p-4 italic text-pink-200">
                  “{character.sample}”
                </blockquote>
              )}
            </div>

            {/* CTA */}
            <div className="mt-auto pt-6">
              <Button
                className="w-full bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 py-4 text-lg"
                onClick={() => {
                  const el = document.getElementById('tiers');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.href = '/pre-order';
                }}
              >
                Choose Your Obedience Tier →
              </Button>
            </div>
          </div>
        </div>

        {/* Related (optional): other personalities quick chips */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold shimmer-text mb-4">More Personalities</h2>
          <div className="flex flex-wrap gap-3">
            {characters
              .filter((c) => c.name !== character.name)
              .slice(0, 8)
              .map((c) => (
                <Link
                  key={c.name}
                  to={`/personality/${slugify(c.name)}`}
                  state={{ character: c }}
                  className="text-xs bg-pink-900/40 border border-pink-800 hover:border-pink-600 text-pink-300 px-3 py-2 rounded-full"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Local styles in case you need them here too */}
      <style>{`
        .magic-bg {
          background: radial-gradient(ellipse at center, #1a0629 0%, #0d0419 70%);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ff69eb, #ffffff, #ff69eb);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s infinite;
        }
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
