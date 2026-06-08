import type { Chord, ChordShape } from "./chords";

const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0, "C#": 1, Db: 1,
  D: 2, "D#": 3, Eb: 3,
  E: 4,
  F: 5, "F#": 6, Gb: 6,
  G: 7, "G#": 8, Ab: 8,
  A: 9, "A#": 10, Bb: 10,
  B: 11,
};

export type Variation = { shape: ChordShape; label: string };

function parseRoot(name: string): string | null {
  const m = name.match(/^([A-G][b#]?)/);
  return m ? m[1] : null;
}

function eShapeMajor(n: number): ChordShape {
  return {
    strings: [n, n + 2, n + 2, n + 1, n, n],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: n,
    barre: { fret: n, from: 0, to: 5 },
  };
}

function eShapeMinor(n: number): ChordShape {
  return {
    strings: [n, n + 2, n + 2, n, n, n],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: n,
    barre: { fret: n, from: 0, to: 5 },
  };
}

function aShapeMajor(n: number): ChordShape {
  return {
    strings: [-1, n, n + 2, n + 2, n + 2, n],
    fingers: [0, 1, 2, 3, 4, 1],
    baseFret: n,
    barre: { fret: n, from: 1, to: 5 },
  };
}

function aShapeMinor(n: number): ChordShape {
  return {
    strings: [-1, n, n + 2, n + 2, n + 1, n],
    fingers: [0, 1, 3, 4, 2, 1],
    baseFret: n,
    barre: { fret: n, from: 1, to: 5 },
  };
}

// Returns null for fret 0 (open string — not a barre position) and fret > 12.
function normalizeFret(fret: number): number | null {
  if (fret === 0 || fret > 12) return null;
  return fret;
}

function shapeIsIdentical(a: ChordShape, b: ChordShape): boolean {
  return a.strings.every((s, i) => s === b.strings[i]);
}

export function getVariations(chord: Chord): Variation[] {
  if (chord.tuning === "drop-d") return [];
  if (chord.category !== "Major" && chord.category !== "Minor") return [];

  const root = parseRoot(chord.name);
  if (!root) return [];
  const rootSemitone = NOTE_TO_SEMITONE[root];
  if (rootSemitone === undefined) return [];

  const isMinor = chord.category === "Minor";
  const results: Variation[] = [];

  // E-shape: root sits on 6th string (open E = semitone 4)
  const eFret = normalizeFret(((rootSemitone - 4) + 12) % 12);
  if (eFret !== null) {
    const shape = isMinor ? eShapeMinor(eFret) : eShapeMajor(eFret);
    if (!shapeIsIdentical(chord.shape, shape)) {
      results.push({ shape, label: `E-shape · fret ${eFret}` });
    }
  }

  // A-shape: root sits on 5th string (open A = semitone 9)
  const aFret = normalizeFret(((rootSemitone - 9) + 12) % 12);
  if (aFret !== null) {
    const shape = isMinor ? aShapeMinor(aFret) : aShapeMajor(aFret);
    if (!shapeIsIdentical(chord.shape, shape)) {
      results.push({ shape, label: `A-shape · fret ${aFret}` });
    }
  }

  return results;
}
