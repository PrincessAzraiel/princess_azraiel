// AMAE — script format.
//
// A day is a graph of scenes. A scene is a list of beats the player clicks
// through, then either a choice or a link to the next scene. Beats that change
// state (dependency, phrasebook, flags) are invisible — the engine applies them
// and moves on, so writing a script never means thinking about React.

export type Beat =
  /** Plain prose. Second person, present tense. */
  | { t: "narration"; text: string }
  /** Her voice. The only voice you understand. */
  | { t: "her"; text: string }
  /** Before Japan. Past tense, set apart — the series keeps coming back to these. */
  | { t: "memory"; text: string }
  /** Someone speaks, and you don't understand a word of it.
   *  `her` is what she tells you it meant. `truth` is what was actually said —
   *  never shown at the time, only later, when a `reveal` beat fires. */
  | { t: "jp"; who?: string; jp: string; romaji?: string; her: string; truth?: string }
  /** Someone speaks. She is standing right there. She says nothing.
   *  The punishment: the translation slot renders empty. */
  | { t: "silence"; who?: string; jp: string; romaji?: string; truth?: string }
  /** He reads it himself, fluently, after eleven years of study — and is wrong.
   *  `you` is what he understands it to say. `truth` is what it says. */
  | { t: "read"; label?: string; jp: string; romaji?: string; you: string; truth?: string }
  /** Untranslated text in the world — a sign, a note, a timetable. */
  | { t: "text"; label?: string; jp: string; romaji?: string; her?: string; truth?: string }
  /** Cold system voice. Used sparingly. */
  | { t: "system"; text: string }
  /** A held silence. */
  | { t: "pause" }
  /** She teaches you a phrase. It goes in the phrasebook, with her meaning. */
  | { t: "phrase"; id: string; jp: string; romaji: string; her: string; truth?: string }
  /** A phrase you were taught turns out to mean something else. */
  | { t: "reveal"; id: string }
  /** Dependency only ever goes up. */
  | { t: "dep"; by: number; note?: string }
  /** Her mood. Goes both ways, and gates whether she tells you anything. */
  | { t: "favour"; by: number; note?: string }
  /** A thing she likes, which he has learned to prepare. Nobody ever asks him to
   *  learn one of these; that is the point. `timing` is how far off he still is. */
  | { t: "ritual"; id: string; jp: string; label: string; timing?: string }
  | { t: "flag"; set: string };

export type Choice = {
  text: string;
  /** Scene id to jump to. */
  goto: string;
  /** What it costs you to choose this. Asserting yourself usually costs more. */
  dep?: number;
  /** How she takes it. Negative means she is going to make you feel it. */
  favour?: number;
  /** Only offered if this flag is set. */
  requires?: string;
  /** Once this flag is set the option is gone. Not greyed out — gone.
   *  This is how "unthinkable" is rendered in an interface. */
  absentIf?: string;
  /** A quiet note under the choice, for the ones that should feel heavy. */
  hint?: string;
};

export type DayEnd = {
  title: string;
  lines: string[];
  nextHref?: string;
  nextLabel?: string;
};

export type Scene = {
  /** Optional — scenes are keyed by id in the day. */
  id?: string;
  place?: string;
  time?: string;
  beats: Beat[];
  choices?: Choice[];
  /** Used when there are no choices. */
  next?: string;
  /** Ends the day. */
  end?: DayEnd;
};

export type Day = {
  id: string;
  /** "PROLOGUE", "DAY ONE" … */
  label: string;
  /** Japanese chapter title. */
  jp: string;
  /** English chapter title. */
  title: string;
  start: string;
  scenes: Record<string, Scene>;
};

export type RitualEntry = {
  id: string;
  jp: string;
  label: string;
  timing?: string;
};

export type PhraseEntry = {
  id: string;
  jp: string;
  romaji: string;
  her: string;
  truth?: string;
  revealed?: boolean;
};

export type SaveState = {
  dependency: number;
  /** Her mood, roughly -10 … +10. Not a score — a weather report. */
  favour: number;
  phrasebook: PhraseEntry[];
  /** The things of hers he can now do without being told. */
  rituals: RitualEntry[];
  flags: string[];
  completed: string[];
};

export const EMPTY_SAVE: SaveState = {
  dependency: 0,
  favour: 0,
  phrasebook: [],
  rituals: [],
  flags: [],
  completed: [],
};

export const SAVE_KEY = "amae:save:v1";

/** Dependency accumulates as raw points and is shown as a percentage of this.
 *  Set so the meter arrives at 100 across all ten chapters rather than pinning
 *  in the third — the last six lessons need somewhere left to go. */
export const DEP_TOTAL = 500;
export const depPercent = (raw: number) =>
  Math.max(0, Math.min(100, Math.round((raw / DEP_TOTAL) * 100)));

/** Her mood, said out loud. A number would invite optimising; a word invites dread. */
export function moodLabel(favour: number): { jp: string; en: string; heat: number } {
  if (favour >= 6) return { jp: "上機嫌", en: "she is delighted with you", heat: 1 };
  if (favour >= 2) return { jp: "機嫌がいい", en: "she is warm today", heat: 0.7 };
  if (favour >= -1) return { jp: "平", en: "she is giving you nothing", heat: 0.35 };
  if (favour >= -5) return { jp: "不機嫌", en: "she is displeased", heat: 0.5 };
  return { jp: "沈黙", en: "she has stopped translating", heat: 0.9 };
}

export function loadSave(): SaveState {
  if (typeof window === "undefined") return EMPTY_SAVE;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return EMPTY_SAVE;
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    return {
      dependency: typeof parsed.dependency === "number" ? parsed.dependency : 0,
      favour: typeof parsed.favour === "number" ? parsed.favour : 0,
      phrasebook: Array.isArray(parsed.phrasebook) ? parsed.phrasebook : [],
      rituals: Array.isArray(parsed.rituals) ? parsed.rituals : [],
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
    };
  } catch {
    return EMPTY_SAVE;
  }
}

export function writeSave(state: SaveState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    /* private mode — the day still plays, it just will not remember */
  }
}
