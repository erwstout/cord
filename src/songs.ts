import { chords } from "./chords";

export type SongBlock = {
  id: string;
  label: string;
  chordIds: string[];
};

export type SongCollection = {
  version: 1;
  title: string;
  blocks: SongBlock[];
};

export type DisplayMode = "names" | "graphs";

const STORAGE_KEY = "cord.song.v1";

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function emptySong(): SongCollection {
  return {
    version: 1,
    title: "Untitled song",
    blocks: [
      { id: newId(), label: "Intro", chordIds: [] },
      { id: newId(), label: "Verse", chordIds: [] },
      { id: newId(), label: "Chorus", chordIds: [] },
    ],
  };
}

export function loadSong(): SongCollection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySong();
    const parsed = JSON.parse(raw);
    const validated = validateCollection(parsed);
    return validated ?? emptySong();
  } catch {
    return emptySong();
  }
}

export function saveSong(song: SongCollection): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(song));
  } catch {
    // ignore quota / privacy mode
  }
}

export function validateCollection(value: unknown): SongCollection | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (v.version !== 1) return null;
  if (typeof v.title !== "string") return null;
  if (!Array.isArray(v.blocks)) return null;
  const blocks: SongBlock[] = [];
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
  return { version: 1, title: v.title, blocks };
}

export function exportSong(song: SongCollection): void {
  const json = JSON.stringify(song, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = song.title.trim().replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "song";
  a.href = url;
  a.download = `${safe}.cord.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function chordNameById(id: string): string {
  return chords.find((c) => c.id === id)?.name ?? id;
}
