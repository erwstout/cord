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
  },
  {
    id: "d-major",
    name: "D",
    category: "Major",
    shape: {
      strings: [-1, -1, 0, 2, 3, 2],
      fingers: [0, 0, 0, 1, 3, 2],
    },
  },
  {
    id: "e-major",
    name: "E",
    category: "Major",
    shape: {
      strings: [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0],
    },
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
  },
  {
    id: "g-major",
    name: "G",
    category: "Major",
    shape: {
      strings: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, 0, 0, 0, 3],
    },
  },
  {
    id: "a-major",
    name: "A",
    category: "Major",
    shape: {
      strings: [-1, 0, 2, 2, 2, 0],
      fingers: [0, 0, 1, 2, 3, 0],
    },
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
  },

  {
    id: "a-minor",
    name: "Am",
    category: "Minor",
    shape: {
      strings: [-1, 0, 2, 2, 1, 0],
      fingers: [0, 0, 2, 3, 1, 0],
    },
  },
  {
    id: "d-minor",
    name: "Dm",
    category: "Minor",
    shape: {
      strings: [-1, -1, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
    },
  },
  {
    id: "e-minor",
    name: "Em",
    category: "Minor",
    shape: {
      strings: [0, 2, 2, 0, 0, 0],
      fingers: [0, 2, 3, 0, 0, 0],
    },
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
  },

  {
    id: "a7",
    name: "A7",
    category: "7th",
    shape: {
      strings: [-1, 0, 2, 0, 2, 0],
      fingers: [0, 0, 1, 0, 2, 0],
    },
  },
  {
    id: "b7",
    name: "B7",
    category: "7th",
    shape: {
      strings: [-1, 2, 1, 2, 0, 2],
      fingers: [0, 2, 1, 3, 0, 4],
    },
  },
  {
    id: "c7",
    name: "C7",
    category: "7th",
    shape: {
      strings: [-1, 3, 2, 3, 1, 0],
      fingers: [0, 3, 2, 4, 1, 0],
    },
  },
  {
    id: "d7",
    name: "D7",
    category: "7th",
    shape: {
      strings: [-1, -1, 0, 2, 1, 2],
      fingers: [0, 0, 0, 2, 1, 3],
    },
  },
  {
    id: "e7",
    name: "E7",
    category: "7th",
    shape: {
      strings: [0, 2, 0, 1, 0, 0],
      fingers: [0, 2, 0, 1, 0, 0],
    },
  },
  {
    id: "g7",
    name: "G7",
    category: "7th",
    shape: {
      strings: [3, 2, 0, 0, 0, 1],
      fingers: [3, 2, 0, 0, 0, 1],
    },
  },

  {
    id: "am7",
    name: "Am7",
    category: "Minor 7th",
    shape: {
      strings: [-1, 0, 2, 0, 1, 0],
      fingers: [0, 0, 2, 0, 1, 0],
    },
  },
  {
    id: "dm7",
    name: "Dm7",
    category: "Minor 7th",
    shape: {
      strings: [-1, -1, 0, 2, 1, 1],
      fingers: [0, 0, 0, 2, 1, 1],
    },
  },
  {
    id: "em7",
    name: "Em7",
    category: "Minor 7th",
    shape: {
      strings: [0, 2, 0, 0, 0, 0],
      fingers: [0, 2, 0, 0, 0, 0],
    },
  },

  {
    id: "cmaj7",
    name: "Cmaj7",
    category: "Major 7th",
    shape: {
      strings: [-1, 3, 2, 0, 0, 0],
      fingers: [0, 3, 2, 0, 0, 0],
    },
  },
  {
    id: "dmaj7",
    name: "Dmaj7",
    category: "Major 7th",
    shape: {
      strings: [-1, -1, 0, 2, 2, 2],
      fingers: [0, 0, 0, 1, 1, 1],
    },
  },
  {
    id: "fmaj7",
    name: "Fmaj7",
    category: "Major 7th",
    shape: {
      strings: [-1, -1, 3, 2, 1, 0],
      fingers: [0, 0, 3, 2, 1, 0],
    },
  },
  {
    id: "gmaj7",
    name: "Gmaj7",
    category: "Major 7th",
    shape: {
      strings: [3, 2, 0, 0, 0, 2],
      fingers: [3, 1, 0, 0, 0, 2],
    },
  },

  {
    id: "asus2",
    name: "Asus2",
    category: "Sus",
    shape: {
      strings: [-1, 0, 2, 2, 0, 0],
      fingers: [0, 0, 1, 2, 0, 0],
    },
  },
  {
    id: "asus4",
    name: "Asus4",
    category: "Sus",
    shape: {
      strings: [-1, 0, 2, 2, 3, 0],
      fingers: [0, 0, 1, 2, 3, 0],
    },
  },
  {
    id: "dsus2",
    name: "Dsus2",
    category: "Sus",
    shape: {
      strings: [-1, -1, 0, 2, 3, 0],
      fingers: [0, 0, 0, 1, 2, 0],
    },
  },
  {
    id: "dsus4",
    name: "Dsus4",
    category: "Sus",
    shape: {
      strings: [-1, -1, 0, 2, 3, 3],
      fingers: [0, 0, 0, 1, 2, 3],
    },
  },
  {
    id: "esus4",
    name: "Esus4",
    category: "Sus",
    shape: {
      strings: [0, 2, 2, 2, 0, 0],
      fingers: [0, 1, 2, 3, 0, 0],
    },
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
  },
];
