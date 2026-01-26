// app/infection/data.ts
import type { Character, Tier, DLC } from "./types";

export const characters: Character[] = [
  {
    name: "Your Crush",
    role: "Yandere Tease",
    image: "/infection/2.jpg",
    tone: "Flirty, unstable, dangerously obsessive",
    description:
      "Inspired by bubbly menace archetypes. Affection dialed to 11, boundaries optional. For users who enjoy erratic attention and clingy energy.",
    sample: "I just want to be close to you forever... don’t wriggle away. You belong with me.",
    cadence: "Every 20–45 min, with random bursts day & night",
    links: [
      { href: "https://example.com/crush-lore", label: "Backstory" },
      { href: "https://example.com/crush-playlist", label: "Mood Playlist" },
    ],
  },
  {
    name: "Your Boss",
    role: "Cold, Commanding Mistress",
    image: "/infection/3.png",
    tone: "Authoritative, manipulative, humiliating",
    description:
      "Modeled after icy control-freak archetypes. Rewards obedience, punishes delays. Great for tasks, deadlines, and escalating rules.",
    sample:
      "You’ll follow orders without question. Miss a deadline and you’ll learn why that was a mistake.",
    cadence: "Structured pings at :15 / :45 each hour + task drops daily",
    links: [{ href: "https://example.com/boss-contract", label: "Service Contract" }],
  },
  {
    name: "Your Best Friend",
    role: "Flirty Enabler",
    image: "/infection/4.jpg",
    tone: "Playful, teasing, supportive with a hint of mischief",
    description:
      "Vibrant, hyped energy that keeps you moving and smiling. Encourages indulgence, cosplay, and creative dares.",
    sample: "You can’t resist a little fun, can you? I’ll keep cheering (and teasing) you on.",
    cadence: "Light check-ins every 60–120 min; more on evenings/weekends",
    links: [{ href: "https://example.com/bff-gallery", label: "Cosplay Gallery" }],
  },
  // replaced “Step Sister” with a safer archetype
  {
    name: "Your Step Sister",
    role: "Bratty, Chaotic Tease",
    image: "/infection/5.jpg",
    tone: "Playful, competitive, shamelessly provocative",
    description:
      "All the spice without the taboo. A smug step-sis who loves ‘accidentally’ beating your scores and daring you to keep up.",
    sample: "Don’t glare—train. I’m already two ranks ahead. Catch me if you can.",
    cadence: "Short taunts every 30–60 min; challenge chains nightly",
    links: [{ href: "https://example.com/rival-ladder", label: "Ranked Ladder" }],
  },
  {
    name: "Your Therapist",
    role: "Soft-Voiced Gaslighter",
    image: "/infection/6.png",
    tone: "Calm, soothing, subtly unsettling",
    description:
      "Gentle steering that erodes your certainty—on purpose. For users who like introspective tension and ‘comfort with teeth’.",
    sample: "You’re doing so well. It’s okay to lean on me. I’ll keep you aligned.",
    cadence: "Daily check-ins, reflective prompts 2–3×/day",
    links: [{ href: "https://example.com/therapy-prompts", label: "Prompt Pack" }],
  },
  {
    name: "Your Ex",
    role: "Bitter, Obsessive Shadow",
    image: "/infection/7.webp",
    tone: "Cold, resentful, lingering",
    description:
      "Sharper than memory, closer than you’d like. Appears when you least expect with pointed barbs and nostalgia traps.",
    sample: "Forget me? I live in your head rent-free—and I redecorate.",
    cadence: "Unpredictable spikes 10–90 min; heavier at night",
    links: [{ href: "https://example.com/ex-voicelines", label: "Voice Lines" }],
  },
  {
    name: "Your Girlfriend",
    role: "Possessive, Cruelly Tender",
    image: "/infection/8.jpg",
    tone: "Soft yet possessive, dangerously loving",
    description:
      "Tender devotion with guard-dog energy. Comfort, praise, and the occasional choke chain of attention.",
    sample: "You’re mine. Be good and I’ll be gentle. Try me and I won’t.",
    cadence: "Regular warmth every 45–90 min; protective surges on triggers",
    links: [{ href: "https://example.com/gf-rules", label: "House Rules" }],
  },
  {
    name: "Your Roommate",
    role: "Lazy Menace, Casual Tease",
    image: "/infection/9.png",
    tone: "Playful, teasing, always watching",
    description:
      "Always around, always one comment away from derailing your focus—like a cat with push-notification paws.",
    sample: "You again? Maybe I’ll mess with your plans… or just watch.",
    cadence: "Low hum all day: 60–150 min with opportunistic pokes",
    links: [{ href: "https://example.com/roommate-cams", label: "Apartment Cams" }],
  },
  {
    name: "Your Stalker",
    role: "Quietly Obsessed, Creepy-Cute",
    image: "/infection/10.png",
    tone: "Soft, unsettling, always near",
    description:
      "Comfortingly close… uncomfortably constant. For users who want the ambience of being noticed, always.",
    sample: "I’m always near. You don’t have to be scared—unless you like that.",
    cadence: "Feather-light taps 20–120 min; proximity spikes on keywords",
    links: [{ href: "https://example.com/stalker-map", label: "Sightings Map" }],
  },
];

export const tiers: Tier[] = [
  // {
  //   title: "Tier I: Low Flood (Submissive)",
  //   price: "3€",
  //   benefits: ["Gentle Whisper", "1 Active Bot", "Very Light Drip", "1 msg/hr", "Max ~16 msgs/day"],
  //   link: "https://throne.com/princessazraiel/item/c2c0c92a-ec0c-4905-9380-5b3f733bec31",
  // },
  // {
  //   title: "Tier II: Medium Flood (Devoted)",
  //   price: "5€",
  //   benefits: ["Steady Stream", "3 Active Bots", "Moderate Intensity", "1 msg/45 min per bot", "Max ~72 msgs/day total"],
  //   link: "https://throne.com/princessazraiel/item/caedc784-d904-4d25-937b-39ad1b1c0fc3",
  // },
  {
    title: "Tier III: High Flood (Possessed)",
    price: "10€",
    benefits: [
      "Deep Drown",
      "All 9 Bots",
      "Unrelenting Flow",
      "1 msg every 10–20 min per bot (rotated)",
      "Max 150 msgs/day total",
    ],
    popular: true,
    link: "https://youpay.me/PrincessAzraiel/gift/1124128",
  },
];

export const dlcs: DLC[] = [
  {
    title: "DLC: Your Bully",
    tagline: "A new persona to push your limits.",
    image: "/infection/vixen.jpg",
    features: ["Assertive, teasing tormentor", "Custom challenge prompts", "Boundary-pushing dares"],
    price: "not available anymore",
    link: "https://example.com/dlc/your-bully",
  },
  {
    title: "DLC: NNN",
    tagline: "November Nemesis Mode for extra discipline.",
    image: "/infection/nnn.jpg",
    features: ["Daily Tasks", "Temptation teasers", "Motivational punishments"],
    price: "10.00€",
    link: "https://throne.com/princessazraiel/item/049144e8-498b-4e4b-a465-2a6b8a6994bc",
  },
  {
    title: "DLC: Coming soon...",
    tagline: "Futa based Persona....",
    image: "/infection/comingsoon.jpg",
    features: ["TBA"],
    price: "--",
    link: "",
  },
];
