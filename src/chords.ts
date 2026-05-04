// Chord shapes use the convention:
//   strings: 6 entries from low E to high e
//   each entry is the fret number, 0 = open, -1 = muted (X)
//   fingers: optional, same length as strings, 0 = no finger / open / mute
//   baseFret: the lowest fret displayed (default 1). Frets in `strings` are absolute.
//   barre: optional { fret, from, to } where from/to are string indices (low E = 0)

export type ChordShape = {
  strings: number[];
  fingers?: number[];
  baseFret?: number;
  barre?: { fret: number; from: number; to: number };
};

export type Tuning = "standard" | "drop-d";

export type Chord = {
  id: string;
  name: string;
  category: "Major" | "Minor" | "7th" | "Minor 7th" | "Major 7th" | "Sus";
  shape: ChordShape;
  tuning?: Tuning;
  next?: string[];
};

// String labels low → high for each supported tuning.
export const tuningLabels: Record<Tuning, [string, string, string, string, string, string]> = {
  standard: ["low E", "A", "D", "G", "B", "high e"],
  "drop-d": ["low D", "A", "D", "G", "B", "high e"],
};

export const chords: Chord[] = [
  {
    id: "c-major",
    name: "C",
    category: "Major",
    shape: {
      strings: [-1, 3, 2, 0, 1, 0],
      fingers: [0, 3, 2, 0, 1, 0],
    },
    next: ["g-major", "a-minor", "f-major", "d-minor"],
  },
  {
    id: "d-major",
    name: "D",
    category: "Major",
    shape: {
      strings: [-1, -1, 0, 2, 3, 2],
      fingers: [0, 0, 0, 1, 3, 2],
    },
    next: ["g-major", "a-major", "b-minor", "e-minor"],
  },
  {
    id: "e-major",
    name: "E",
    category: "Major",
    shape: {
      strings: [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0],
    },
    next: ["a-major", "b-major", "b7", "a-minor"],
  },
  {
    id: "f-major",
    name: "F",
    category: "Major",
    shape: {
      strings: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      barre: { fret: 1, from: 0, to: 5 },
    },
    next: ["c-major", "g-major", "a-minor", "d-minor"],
  },
  {
    id: "g-major",
    name: "G",
    category: "Major",
    shape: {
      strings: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, 0, 0, 0, 3],
    },
    next: ["c-major", "d-major", "e-minor", "d7"],
  },
  {
    id: "a-major",
    name: "A",
    category: "Major",
    shape: {
      strings: [-1, 0, 2, 2, 2, 0],
      fingers: [0, 0, 1, 2, 3, 0],
    },
    next: ["d-major", "e-major", "b-minor", "e7"],
  },
  {
    id: "b-major",
    name: "B",
    category: "Major",
    shape: {
      strings: [-1, 2, 4, 4, 4, 2],
      fingers: [0, 1, 2, 3, 4, 1],
      barre: { fret: 2, from: 1, to: 5 },
    },
    next: ["e-major", "e-minor", "a-major"],
  },

  {
    id: "a-minor",
    name: "Am",
    category: "Minor",
    shape: {
      strings: [-1, 0, 2, 2, 1, 0],
      fingers: [0, 0, 2, 3, 1, 0],
    },
    next: ["d-minor", "e7", "f-major", "g-major"],
  },
  {
    id: "d-minor",
    name: "Dm",
    category: "Minor",
    shape: {
      strings: [-1, -1, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
    },
    next: ["g-major", "a7", "f-major", "c-major"],
  },
  {
    id: "e-minor",
    name: "Em",
    category: "Minor",
    shape: {
      strings: [0, 2, 2, 0, 0, 0],
      fingers: [0, 2, 3, 0, 0, 0],
    },
    next: ["a-minor", "b7", "c-major", "d-major"],
  },
  {
    id: "f-minor",
    name: "Fm",
    category: "Minor",
    shape: {
      strings: [1, 3, 3, 1, 1, 1],
      fingers: [1, 3, 4, 1, 1, 1],
      barre: { fret: 1, from: 0, to: 5 },
    },
    next: ["c-major", "c7", "g7"],
  },
  {
    id: "g-minor",
    name: "Gm",
    category: "Minor",
    shape: {
      strings: [3, 5, 5, 3, 3, 3],
      fingers: [1, 3, 4, 1, 1, 1],
      barre: { fret: 3, from: 0, to: 5 },
      baseFret: 3,
    },
    next: ["d7", "c7", "fmaj7"],
  },
  {
    id: "b-minor",
    name: "Bm",
    category: "Minor",
    shape: {
      strings: [-1, 2, 4, 4, 3, 2],
      fingers: [0, 1, 3, 4, 2, 1],
      barre: { fret: 2, from: 1, to: 5 },
      baseFret: 2,
    },
    next: ["e-minor", "a-major", "d-major", "g-major"],
  },

  {
    id: "a7",
    name: "A7",
    category: "7th",
    shape: {
      strings: [-1, 0, 2, 0, 2, 0],
      fingers: [0, 0, 1, 0, 2, 0],
    },
    next: ["d-major", "d-minor", "d7"],
  },
  {
    id: "b7",
    name: "B7",
    category: "7th",
    shape: {
      strings: [-1, 2, 1, 2, 0, 2],
      fingers: [0, 2, 1, 3, 0, 4],
    },
    next: ["e-major", "e-minor", "a-minor"],
  },
  {
    id: "c7",
    name: "C7",
    category: "7th",
    shape: {
      strings: [-1, 3, 2, 3, 1, 0],
      fingers: [0, 3, 2, 4, 1, 0],
    },
    next: ["f-major", "f-minor", "d-minor"],
  },
  {
    id: "d7",
    name: "D7",
    category: "7th",
    shape: {
      strings: [-1, -1, 0, 2, 1, 2],
      fingers: [0, 0, 0, 2, 1, 3],
    },
    next: ["g-major", "g-minor", "c-major"],
  },
  {
    id: "e7",
    name: "E7",
    category: "7th",
    shape: {
      strings: [0, 2, 0, 1, 0, 0],
      fingers: [0, 2, 0, 1, 0, 0],
    },
    next: ["a-major", "a-minor", "d-major"],
  },
  {
    id: "g7",
    name: "G7",
    category: "7th",
    shape: {
      strings: [3, 2, 0, 0, 0, 1],
      fingers: [3, 2, 0, 0, 0, 1],
    },
    next: ["c-major", "cmaj7", "f-major"],
  },

  {
    id: "am7",
    name: "Am7",
    category: "Minor 7th",
    shape: {
      strings: [-1, 0, 2, 0, 1, 0],
      fingers: [0, 0, 2, 0, 1, 0],
    },
    next: ["dm7", "g7", "cmaj7"],
  },
  {
    id: "dm7",
    name: "Dm7",
    category: "Minor 7th",
    shape: {
      strings: [-1, -1, 0, 2, 1, 1],
      fingers: [0, 0, 0, 2, 1, 1],
    },
    next: ["g7", "cmaj7", "fmaj7"],
  },
  {
    id: "em7",
    name: "Em7",
    category: "Minor 7th",
    shape: {
      strings: [0, 2, 0, 0, 0, 0],
      fingers: [0, 2, 0, 0, 0, 0],
    },
    next: ["a7", "dmaj7", "am7"],
  },

  {
    id: "cmaj7",
    name: "Cmaj7",
    category: "Major 7th",
    shape: {
      strings: [-1, 3, 2, 0, 0, 0],
      fingers: [0, 3, 2, 0, 0, 0],
    },
    next: ["dm7", "fmaj7", "am7", "g7"],
  },
  {
    id: "dmaj7",
    name: "Dmaj7",
    category: "Major 7th",
    shape: {
      strings: [-1, -1, 0, 2, 2, 2],
      fingers: [0, 0, 0, 1, 1, 1],
    },
    next: ["em7", "a7", "b-minor", "gmaj7"],
  },
  {
    id: "fmaj7",
    name: "Fmaj7",
    category: "Major 7th",
    shape: {
      strings: [-1, -1, 3, 2, 1, 0],
      fingers: [0, 0, 3, 2, 1, 0],
    },
    next: ["dm7", "g7", "am7", "cmaj7"],
  },
  {
    id: "gmaj7",
    name: "Gmaj7",
    category: "Major 7th",
    shape: {
      strings: [3, 2, 0, 0, 0, 2],
      fingers: [3, 1, 0, 0, 0, 2],
    },
    next: ["am7", "d7", "em7", "cmaj7"],
  },

  {
    id: "asus2",
    name: "Asus2",
    category: "Sus",
    shape: {
      strings: [-1, 0, 2, 2, 0, 0],
      fingers: [0, 0, 1, 2, 0, 0],
    },
    next: ["a-major", "a-minor", "d-major"],
  },
  {
    id: "asus4",
    name: "Asus4",
    category: "Sus",
    shape: {
      strings: [-1, 0, 2, 2, 3, 0],
      fingers: [0, 0, 1, 2, 3, 0],
    },
    next: ["a-major", "d-major", "e-major"],
  },
  {
    id: "dsus2",
    name: "Dsus2",
    category: "Sus",
    shape: {
      strings: [-1, -1, 0, 2, 3, 0],
      fingers: [0, 0, 0, 1, 2, 0],
    },
    next: ["d-major", "d-minor", "g-major"],
  },
  {
    id: "dsus4",
    name: "Dsus4",
    category: "Sus",
    shape: {
      strings: [-1, -1, 0, 2, 3, 3],
      fingers: [0, 0, 0, 1, 2, 3],
    },
    next: ["d-major", "g-major", "a-major"],
  },
  {
    id: "esus4",
    name: "Esus4",
    category: "Sus",
    shape: {
      strings: [0, 2, 2, 2, 0, 0],
      fingers: [0, 1, 2, 3, 0, 0],
    },
    next: ["e-major", "a-major", "b7"],
  },

  // Drop D tuning (D A D G B e). The low string is tuned a whole step down,
  // so D-rooted chords get a low D in the bass and power chords on the bottom
  // three strings sit on a single fret.
  {
    id: "d-major-drop-d",
    name: "D",
    category: "Major",
    tuning: "drop-d",
    shape: {
      strings: [0, 0, 0, 2, 3, 2],
      fingers: [0, 0, 0, 1, 3, 2],
    },
    next: ["g-major-drop-d", "a-major-drop-d", "e-minor-drop-d", "dsus4-drop-d"],
  },
  {
    id: "d-minor-drop-d",
    name: "Dm",
    category: "Minor",
    tuning: "drop-d",
    shape: {
      strings: [0, 0, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
    },
    next: ["g-major-drop-d", "a-major-drop-d", "dsus2-drop-d"],
  },
  {
    id: "d7-drop-d",
    name: "D7",
    category: "7th",
    tuning: "drop-d",
    shape: {
      strings: [0, 0, 0, 2, 1, 2],
      fingers: [0, 0, 0, 2, 1, 3],
    },
    next: ["g-major-drop-d", "dmaj7-drop-d"],
  },
  {
    id: "dmaj7-drop-d",
    name: "Dmaj7",
    category: "Major 7th",
    tuning: "drop-d",
    shape: {
      strings: [0, 0, 0, 2, 2, 2],
      fingers: [0, 0, 0, 1, 1, 1],
    },
    next: ["e-minor-drop-d", "a-major-drop-d", "g-major-drop-d"],
  },
  {
    id: "dsus2-drop-d",
    name: "Dsus2",
    category: "Sus",
    tuning: "drop-d",
    shape: {
      strings: [0, 0, 0, 2, 3, 0],
      fingers: [0, 0, 0, 1, 2, 0],
    },
    next: ["d-major-drop-d", "d-minor-drop-d", "a-major-drop-d"],
  },
  {
    id: "dsus4-drop-d",
    name: "Dsus4",
    category: "Sus",
    tuning: "drop-d",
    shape: {
      strings: [0, 0, 0, 2, 3, 3],
      fingers: [0, 0, 0, 1, 2, 3],
    },
    next: ["d-major-drop-d", "g-major-drop-d", "a-major-drop-d"],
  },
  {
    id: "e-minor-drop-d",
    name: "Em",
    category: "Minor",
    tuning: "drop-d",
    shape: {
      strings: [2, 2, 2, 0, 0, 0],
      fingers: [1, 2, 3, 0, 0, 0],
      barre: { fret: 2, from: 0, to: 2 },
    },
    next: ["d-major-drop-d", "a-major-drop-d", "g-major-drop-d"],
  },
  {
    id: "g-major-drop-d",
    name: "G",
    category: "Major",
    tuning: "drop-d",
    shape: {
      strings: [5, 5, 5, 0, 0, 3],
      fingers: [1, 1, 1, 0, 0, 2],
      barre: { fret: 5, from: 0, to: 2 },
      baseFret: 3,
    },
    next: ["d-major-drop-d", "a-major-drop-d", "e-minor-drop-d"],
  },
  {
    id: "a-major-drop-d",
    name: "A",
    category: "Major",
    tuning: "drop-d",
    shape: {
      strings: [7, 7, 7, -1, -1, -1],
      fingers: [1, 1, 1, 0, 0, 0],
      barre: { fret: 7, from: 0, to: 2 },
      baseFret: 5,
    },
    next: ["d-major-drop-d", "d-minor-drop-d", "g-major-drop-d"],
  },
];
