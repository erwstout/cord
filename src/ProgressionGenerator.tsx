import { useState } from "react";
import {
  generateProgression,
  vibeLabels,
  type ProgressionCollection,
  type ProgressionModifiers,
  type VibeType,
} from "./progressions";
import ProgressionModifiersPanel from "./ProgressionModifiers";
import ChordDiagram from "./ChordDiagram";
import { chords } from "./chords";

const chordRoots = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const vibes: VibeType[] = ["post-rock", "industrial", "noise-rock", "post-punk", "stoner-doom"];

type Props = {
  progression: ProgressionCollection;
  onGenerate: (newChordIds: string[], blockId: string) => void;
  onGenerateNew: (vibe: VibeType) => void;
  onDefaultsChange: (defaults: Partial<ProgressionModifiers>) => void;
};

export default function ProgressionGenerator({
  progression,
  onGenerate,
  onGenerateNew,
  onDefaultsChange,
}: Props) {
  const [selectedRoot, setSelectedRoot] = useState("C");
  const [selectedVibe, setSelectedVibe] = useState<VibeType>(progression.vibe);
  const [selectedChordId, setSelectedChordId] = useState<string | null>(null);

  const handleGenerateForBlock = (blockId: string) => {
    const newChordIds = generateProgression(progression.vibe, selectedRoot);
    if (newChordIds.length > 0) {
      onGenerate(newChordIds, blockId);
    }
  };

  const handleChangeVibe = (newVibe: VibeType) => {
    setSelectedVibe(newVibe);
    onGenerateNew(newVibe);
  };

  const selectedChord = selectedChordId
    ? chords.find((c) => c.id === selectedChordId) ?? null
    : null;

  return (
    <div className="space-y-6">
      {/* Vibe Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider text-white/60">
          Vibe
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {vibes.map((vibe) => {
            const label = vibeLabels[vibe];
            const isActive = selectedVibe === vibe;
            return (
              <button
                key={vibe}
                onClick={() => handleChangeVibe(vibe)}
                className={`px-3 py-2 text-xs font-mono border text-left transition-colors ${
                  isActive
                    ? "border-white bg-white text-black"
                    : "border-white/30 text-white/70 hover:border-white hover:text-white"
                }`}
              >
                <div className="font-semibold">{label.genre}</div>
                <div className="text-[9px] opacity-70">{label.mood}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Root Note Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider text-white/60">
          Root Note
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
          {chordRoots.map((root) => (
            <button
              key={root}
              onClick={() => setSelectedRoot(root)}
              className={`px-2 py-1.5 text-xs font-mono border ${
                selectedRoot === root
                  ? "border-white bg-white text-black"
                  : "border-white/30 text-white/70 hover:border-white hover:text-white"
              }`}
            >
              {root}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Buttons for Each Block */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider text-white/60">
          Generate Chords
        </label>
        <div className="space-y-2">
          {progression.blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => handleGenerateForBlock(block.id)}
              className="w-full px-3 py-2 text-xs font-mono border border-white/30 hover:border-white text-white/70 hover:text-white transition-colors text-left"
            >
              Generate for "{block.label}"
            </button>
          ))}
        </div>
      </div>

      {/* Modifiers */}
      <div className="pt-6 border-t border-white/15">
        <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-4">
          Progression Settings
        </h3>
        <ProgressionModifiersPanel
          modifiers={progression.defaults}
          onChange={onDefaultsChange}
        />
      </div>

      {/* Chord Viewer */}
      <div className="pt-6 border-t border-white/15">
        <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-4">
          Quick Reference
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {chords.slice(0, 24).map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChordId(c.id)}
              className="group relative border border-white/20 hover:border-white p-2 flex flex-col items-center gap-1.5 transition-colors"
            >
              <ChordDiagram shape={c.shape} size={80} showFingers={false} />
              <span className="font-mono text-xs text-white/70 group-hover:text-white">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chord Detail Modal */}
      {selectedChord && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedChordId(null)}
        >
          <div
            className="border border-white/30 bg-black p-6 sm:p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-3xl font-mono">{selectedChord.name}</h2>
                <p className="text-xs font-mono text-white/50 uppercase tracking-wider mt-1">
                  {selectedChord.category}
                </p>
              </div>
              <button
                onClick={() => setSelectedChordId(null)}
                aria-label="Close"
                className="font-mono text-white/60 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex justify-center">
              <ChordDiagram shape={selectedChord.shape} size={280} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
