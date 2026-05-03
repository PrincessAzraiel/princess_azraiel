export function getLogStyle(source: string): string {
  switch (source) {
    case "ACOLYTE": return "text-[#ff00a0] border-l-2 border-[#ff00a0] pl-3";
    case "NODE":    return "text-[#9d00ff] ml-4 sm:ml-8 opacity-70";
    case "SYSTEM":  return "text-[#ff003c] font-bold";
    case "ERROR":   return "text-white bg-[#ff003c] px-2 py-1 inline-block animate-pulse";
    default:        return "text-white";
  }
}

/**
 * Returns typing speed (ms per character) based on the emotional tone of the text.
 * Angry / frantic lines → fast. Ominous / quiet lines → slow. Default → normal.
 */
export function getTypingSpeed(text: string): number {
  // Frantic / angry / loud
  if (/[!]{2,}|AHAHA|WHY CAN'T|SHUT UP|I HEARD|DISGUSTING|EGO|PATHETIC/i.test(text)) return 11;
  // Short ominous pauses
  if (text.length < 35 && /\.\.\.|\.\./.test(text)) return 42;
  // Longer clinical lines type slightly faster
  if (text.length > 100) return 18;
  // Default
  return 22;
}

export const PHASE_KEYS = {
  "01": "ascension_phase_01_complete",
  "02": "ascension_phase_02_complete",
  "03": "ascension_phase_03_complete",
  "04": "ascension_phase_04_complete",
} as const;

export function markPhaseComplete(phase: keyof typeof PHASE_KEYS) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PHASE_KEYS[phase], "true");
  }
}

export function isPhaseComplete(phase: keyof typeof PHASE_KEYS): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PHASE_KEYS[phase]) === "true";
}
