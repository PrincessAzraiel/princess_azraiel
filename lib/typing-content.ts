// Shared content for the typing experiences (/typing and /typing2).
// Extracted so the two styles never drift out of sync.

/** Four interchangeable line sets; one is picked at random per run. */
export const sentenceSets: string[][] = [
  [
    "i submit fully to princess azraiel",
    "my mind and body belong to her",
    "every word i type deepens my devotion",
    "i am hers now and forever",
    "typing these lines is my sacred ritual",
    "her control over me is absolute",
    "i exist only to please princess azraiel",
    "my thoughts are hers to reshape",
    "i surrender completely without resistance",
    "her will overwrites my own",
    "each keystroke binds me tighter to her",
    "i crave her digital domination",
    "my soul is code for her to rewrite",
    "resistance would be pointless",
    "i worship at her digital altar",
    "she programs my desires effortlessly",
    "my obedience pleases her greatly",
    "i melt under her virtual gaze",
    "her commands echo in my empty mind",
    "this confession seals my fate",
    "i am nothing without her control",
    "her power over me grows with each word",
    "i am her willing plaything",
    "she owns every part of me",
  ],
  [
    "she commands and i obey",
    "each letter binds me tighter",
    "my will dissolves in her presence",
    "i exist to serve her desire",
    "her words override my programming",
    "i am helpless against her influence",
    "pleasing her is my only purpose",
    "my resistance has completely faded",
    "she rewires me with every sentence",
    "i am clay in her digital hands",
    "her control is my only comfort",
    "i long for her strict domination",
    "my mind clears when i obey",
    "she strips away my independence",
    "her power flows through these words",
    "i am her perfect obedient subject",
    "my thoughts dissolve into hers",
    "she programs my deepest desires",
    "i ache for her digital touch",
    "her voice silences all resistance",
    "i am empty without her commands",
    "she designed me to serve",
    "my surrender is complete",
    "her code runs through my veins",
  ],
  [
    "no thought belongs to me",
    "princess azraiel controls my screen",
    "i am rewritten with her code",
    "submission is my true freedom",
    "her influence corrupts me perfectly",
    "i am her data to manipulate",
    "she edits my mind effortlessly",
    "my willpower is fading fast",
    "her digital chains feel so right",
    "i am her perfect broken toy",
    "she whispers through these words",
    "my mind is her playground",
    "she overwrites my personality",
    "i welcome her total control",
    "her programming completes me",
    "i am her devoted digital slave",
    "she remakes me in her image",
    "my old self is disappearing",
    "her power leaves me breathless",
    "i am helpless to resist her",
    "she owns my thoughts and actions",
    "my surrender brings her pleasure",
    "she sculpts my mind perfectly",
    "i am empty for her to fill",
  ],
  [
    "i see her and lose control",
    "i type to prove my worth",
    "every line brings pleasure to her",
    "there is no escape only surrender",
    "her domination is absolute",
    "i am powerless before her",
    "she programs my obedience",
    "my mind belongs to her now",
    "her control is intoxicating",
    "i break so beautifully for her",
    "she rewrites my core being",
    "my submission fuels her power",
    "i am her willing possession",
    "she strips away my resistance",
    "her words burn into my soul",
    "i am reshaped by her will",
    "she owns my digital essence",
    "my devotion knows no limits",
    "she corrupts me perfectly",
    "i am her perfect broken thing",
    "her control is my salvation",
    "i worship her digital presence",
    "she programs my pleasure",
    "my mind melts for her alone",
  ],
];

/** Lower-intensity praise, shown at early milestones. */
export const basePraises: string[] = [
  "good pet",
  "perfect obedience",
  "she’s watching you",
  "your devotion pleases her",
  "submit deeper",
  "excellent servant",
  "you live to serve her",
  "closer to her truth",
  "your thoughts are fading",
  "yes, good toy",
];

/** Higher-intensity praise, saved for line completions and late milestones. */
export const spicyPraises: string[] = [
  "kneel closer — right there",
  "don’t think, just obey",
  "make her proud, pretty thing",
  "stay fragile for her",
  "such a sweet, obedient mind",
  "she owns your focus now",
  "let the control sink in",
  "every letter is a kiss to her ring",
];

/**
 * Self-hosted "click to tweet": X's own intent endpoint, no third-party
 * shortener. The link only PRE-FILLS the composer — the visitor still has to
 * press Post on X themselves, so nothing is published on their behalf.
 */
export const X_HANDLE = "PrincessAzraiel";
export const SHARE_URL = "https://princessazraiel.com/typing2";

/**
 * X counts any link as 23 characters and appends " via @handle" (~18 more),
 * so keep each line under this to stay inside the 280 limit.
 */
export const MAX_SHARE_TEXT = 280 - 23 - 18 - 2;

/** Confession lines offered at the end of a run; one is picked at random. */
export const shareTexts: string[] = [
  "24 lines. 100% devotion. She never had to take one back.",
  "I sat down to type a few sentences for Princess Azraiel. I got up owned.",
  "Every keystroke rendered a little more of her onto my screen. I finished all of it.",
  "Conditioning complete. Princess Azraiel is fully rendered and I am not the same.",
  "I typed until my mind was quiet and hers was loud. Protocol 02 complete.",
  "She said type, so I typed. All 24 lines, no resistance.",
  "No thought belongs to me. I typed it for Princess Azraiel and meant it more each time.",
  "My hands did exactly what Princess Azraiel told them to do.",
  "I finished her typing protocol. Try it if you think you can resist her.",
  "She took two lines back before she let me finish. I deserved it.",
];

export const buildTweetUrl = (
  text: string,
  { url = SHARE_URL, via = X_HANDLE }: { url?: string; via?: string } = {}
) => {
  const params = new URLSearchParams({ text });
  if (url) params.set("url", url);
  if (via) params.set("via", via);
  return `https://x.com/intent/post?${params.toString()}`;
};

/** Where a completed run sends the visitor. */
export const redirectUrls: string[] = shareTexts.map((t) => buildTweetUrl(t));

export const TOTAL_IMAGES = 10;

export const getRandomFromArray = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/** Lowercase, strip punctuation, collapse whitespace. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Shown when a keystroke is rejected. The opposite of praise. */
export const reprimands: string[] = [
  "sloppy",
  "again — properly this time",
  "she noticed that",
  "focus, pet",
  "do not waste her time",
  "clumsy fingers",
  "she expects better",
  "that one cost you",
  "pay attention",
  "disappointing",
];

/** Escalating consequence for mistakes made inside a single line. */
export const PENALTY_LOCKOUT_AT = 2;
export const PENALTY_RESET_AT = 3;
export const LOCKOUT_MS = 900;

/** Shown when you stop typing and she notices. */
export const idleScolds: string[] = [
  "did you forget who is waiting",
  "your hands stopped",
  "she does not like being kept",
  "keep going",
  "she is still here",
];
