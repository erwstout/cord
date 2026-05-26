import { chords, type Chord } from "./chords";

export type VibeType =
  | "post-rock"
  | "industrial"
  | "noise-rock"
  | "post-punk"
  | "stoner-doom";

export type VibeLabel = {
  genre: string;
  mood: string;
};

export const vibeLabels: Record<VibeType, VibeLabel> = {
  "post-rock": { genre: "Post-Rock", mood: "Cinematic" },
  industrial: { genre: "Industrial", mood: "Harsh" },
  "noise-rock": { genre: "Noise Rock", mood: "Heavy" },
  "post-punk": { genre: "Post-Punk", mood: "Minimal" },
  "stoner-doom": { genre: "Stoner/Doom", mood: "Dark" },
};

export type ProgressionBlock = {
  id: string;
  label: string;
  chordIds: string[];
};

export type ProgressionCollection = {
  version: 1;
  title: string;
  vibe: VibeType;
  blocks: ProgressionBlock[];
};

export type DisplayMode = "names" | "graphs";

const STORAGE_KEY = "cord.progression.v1";

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Chord roots in semitone order for easy transposition
const chordRoots = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getChordsByRoot(root: string, category: string): Chord[] {
  return chords.filter(
    (c) =>
      c.name.startsWith(root) &&
      c.category === category &&
      !c.tuning // exclude special tunings for now
  );
}

function getRandomChord(root: string, categories: string[]): Chord | null {
  // Shuffle categories to try them in random order
  const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);

  for (const category of shuffledCategories) {
    const matching = getChordsByRoot(root, category);
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)];
    }
  }

  // Fallback: if exact root not found, try adjacent semitones
  const fallbackRoots = [
    chordRoots[(chordRoots.indexOf(root) - 1 + chordRoots.length) % chordRoots.length],
    chordRoots[(chordRoots.indexOf(root) + 1) % chordRoots.length],
  ];

  for (const fallbackRoot of fallbackRoots) {
    for (const category of shuffledCategories) {
      const matching = getChordsByRoot(fallbackRoot, category);
      if (matching.length > 0) {
        return matching[Math.floor(Math.random() * matching.length)];
      }
    }
  }

  return null;
}

// Pattern: [degree offset from root, categories to choose from]
type ProgressionPattern = Array<[number, string[]]>;

function generateProgressionFromPattern(
  root: string,
  pattern: ProgressionPattern,
): string[] {
  const rootIdx = chordRoots.indexOf(root);
  if (rootIdx === -1) return [];

  const result: string[] = [];
  for (const [degree, categories] of pattern) {
    const targetIdx = (rootIdx + degree) % chordRoots.length;
    const targetRoot = chordRoots[targetIdx];
    const chord = getRandomChord(targetRoot, categories);
    if (chord) result.push(chord.id);
  }
  return result;
}

// Vibe-specific generation functions
function generatePostRock(root: string): string[] {
  const patterns: ProgressionPattern[] = [
    [[0, ["Major"]], [5, ["Major", "Major 7th"]], [7, ["Major"]], [0, ["Major"]]],
    [[0, ["Major"]], [5, ["Major"]], [7, ["Major"]], [9, ["Minor"]]],
    [[0, ["Major"]], [9, ["Minor"]], [5, ["Major"]], [7, ["Major"]]],
    [[0, ["Major"]], [0, ["Major 7th"]], [5, ["Major"]], [7, ["Major"]]],
  ];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return generateProgressionFromPattern(root, pattern);
}

function generateIndustrial(root: string): string[] {
  const patterns: ProgressionPattern[] = [
    [[0, ["Minor"]], [11, ["Major"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [5, ["Minor"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [10, ["7th"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [5, ["Minor"]], [11, ["7th"]], [0, ["Minor"]]],
  ];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return generateProgressionFromPattern(root, pattern);
}

function generateNoiseRock(root: string): string[] {
  const patterns: ProgressionPattern[] = [
    [[0, ["Minor"]], [5, ["Minor"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [11, ["Major"]], [7, ["Major"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [7, ["Major"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [5, ["Minor"]], [11, ["Major"]], [0, ["Minor"]]],
  ];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return generateProgressionFromPattern(root, pattern);
}

function generatePostPunk(root: string): string[] {
  const patterns: ProgressionPattern[] = [
    [[0, ["Minor"]], [11, ["Minor", "7th"]]],
    [[0, ["Minor"]], [5, ["Minor"]]],
    [[9, ["Minor", "Major"]], [11, ["Minor"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [5, ["Minor"]], [11, ["Minor"]]],
    [[0, ["Minor"]], [7, ["Major"]], [0, ["Minor"]]],
  ];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return generateProgressionFromPattern(root, pattern);
}

function generateStonerDoom(root: string): string[] {
  const patterns: ProgressionPattern[] = [
    [[0, ["Minor"]], [11, ["Minor", "7th"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [5, ["Minor"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [5, ["Minor"]], [11, ["Minor"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [7, ["Minor"]], [0, ["Minor"]]],
    [[0, ["Minor"]], [11, ["7th"]], [5, ["Minor"]], [0, ["Minor"]]],
  ];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return generateProgressionFromPattern(root, pattern);
}

export function generateProgression(vibe: VibeType, root: string): string[] {
  switch (vibe) {
    case "post-rock":
      return generatePostRock(root);
    case "industrial":
      return generateIndustrial(root);
    case "noise-rock":
      return generateNoiseRock(root);
    case "post-punk":
      return generatePostPunk(root);
    case "stoner-doom":
      return generateStonerDoom(root);
  }
}

export function emptyProgression(vibe: VibeType): ProgressionCollection {
  return {
    version: 1,
    title: "Untitled progression",
    vibe,
    blocks: [
      { id: newId(), label: "Section", chordIds: [] },
    ],
  };
}

export function loadProgression(): ProgressionCollection | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validated = validateCollection(parsed);
    return validated;
  } catch {
    return null;
  }
}

export function saveProgression(progression: ProgressionCollection): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progression));
  } catch {
    // ignore quota / privacy mode
  }
}

export function validateCollection(value: unknown): ProgressionCollection | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (v.version !== 1) return null;
  if (typeof v.title !== "string") return null;
  if (typeof v.vibe !== "string" || !Object.keys(vibeLabels).includes(v.vibe)) return null;
  if (!Array.isArray(v.blocks)) return null;
  const blocks: ProgressionBlock[] = [];
  for (const b of v.blocks) {
    if (!b || typeof b !== "object") return null;
    const block = b as Record<string, unknown>;
    if (typeof block.id !== "string") return null;
    if (typeof block.label !== "string") return null;
    if (!Array.isArray(block.chordIds)) return null;
    if (!block.chordIds.every((c) => typeof c === "string")) return null;
    blocks.push({
      id: block.id,
      label: block.label,
      chordIds: block.chordIds as string[],
    });
  }
  return { version: 1, title: v.title, vibe: v.vibe as VibeType, blocks };
}

export function exportProgression(progression: ProgressionCollection): void {
  const json = JSON.stringify(progression, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = progression.title
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .toLowerCase() || "progression";
  a.href = url;
  a.download = `${safe}.chord.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function chordNameById(id: string): string {
  return chords.find((c) => c.id === id)?.name ?? id;
}
