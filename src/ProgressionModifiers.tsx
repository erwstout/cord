import { useState } from "react";
import {
  type ProgressionModifiers,
  type RepetitionCount,
  type CapoPosition,
  type SusResolution,
  type IntensityLevel,
  type RelativeKey,
  type TimeSignature,
  type InversionMode,
  type ArpeggioPattern,
  type TensionCurve,
} from "./progressions";

type Props = {
  modifiers: Partial<ProgressionModifiers>;
  onChange: (modifiers: Partial<ProgressionModifiers>) => void;
  isBlockLevel?: boolean;
};

export default function ProgressionModifiers({ modifiers, onChange, isBlockLevel = false }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateModifier = <K extends keyof ProgressionModifiers>(
    key: K,
    value: ProgressionModifiers[K]
  ) => {
    onChange({ ...modifiers, [key]: value });
  };

  const repetitionCounts: RepetitionCount[] = [1, 2, 4, 8];
  const capoPositions: CapoPosition[] = [0, 2, 3, 5, 7, 9, 12];
  const timeSignatures: TimeSignature[] = ["4/4", "3/4", "6/8", "5/4", "7/4"];
  const inversions: InversionMode[] = ["root", "first", "second"];
  const arpeggiations: ArpeggioPattern[] = ["block", "arpeggio"];
  const tensions: TensionCurve[] = ["ascending", "descending", "plateau", "wave"];

  const currentRep = (modifiers.repetitionCount ?? 2) as RepetitionCount;
  const currentCapo = (modifiers.capoPosition ?? 0) as CapoPosition;
  const currentIntensity = (modifiers.intensityLevel ?? "medium") as IntensityLevel;
  const currentSusRes = (modifiers.susResolution ?? "major") as SusResolution;
  const currentKey = (modifiers.relativeKey ?? "minor") as RelativeKey;
  const currentTempo = (modifiers.tempo ?? 100) as number;
  const currentTime = (modifiers.timeSignature ?? "4/4") as TimeSignature;
  const currentInv = (modifiers.inversionMode ?? "root") as InversionMode;
  const currentArp = (modifiers.arpeggiation ?? "block") as ArpeggioPattern;
  const currentTension = (modifiers.tensionCurve ?? "ascending") as TensionCurve;

  const intensityDescriptions = {
    quiet: "Fingerpicked, muted",
    medium: "Standard strumming",
    loud: "Full distortion, heavy",
  };

  const capoLabels = {
    0: "No capo",
    2: "Capo 2",
    3: "Capo 3",
    5: "Capo 5",
    7: "Capo 7",
    9: "Capo 9",
    12: "Capo 12 (Octave)",
  };

  const inversionLabels = {
    root: "Root position",
    first: "1st inversion",
    second: "2nd inversion",
  };

  return (
    <div className="space-y-4">
      {/* TIER 1 MODIFIERS */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-white/60">
          Core Modifiers
        </h3>

        {/* Repetition Count */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">
            Repetition (beats per chord)
          </label>
          <div className="flex gap-1">
            {repetitionCounts.map((count) => (
              <button
                key={count}
                onClick={() => updateModifier("repetitionCount", count)}
                className={`flex-1 px-2 py-1 text-xs font-mono border ${
                  currentRep === count
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white"
                }`}
              >
                {count}x
              </button>
            ))}
          </div>
        </div>

        {/* Capo Position */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">Capo Position</label>
          <select
            value={currentCapo}
            onChange={(e) => updateModifier("capoPosition", parseInt(e.target.value) as CapoPosition)}
            className="w-full bg-black border border-white/30 px-2 py-1 text-xs font-mono text-white outline-none focus:border-white"
          >
            {capoPositions.map((pos) => (
              <option key={pos} value={pos}>
                {capoLabels[pos as CapoPosition]}
              </option>
            ))}
          </select>
        </div>

        {/* Intensity Level */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">Intensity</label>
          <div className="grid grid-cols-3 gap-1">
            {(["quiet", "medium", "loud"] as const).map((level) => (
              <button
                key={level}
                onClick={() => updateModifier("intensityLevel", level)}
                className={`px-2 py-2 text-xs font-mono border text-center transition-colors ${
                  currentIntensity === level
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white"
                }`}
              >
                <div className="font-semibold capitalize">{level}</div>
                <div className="text-[9px] opacity-60">
                  {intensityDescriptions[level]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sus Resolution */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">Sus Resolution</label>
          <div className="flex gap-1">
            {(["major", "minor", "none"] as const).map((res) => (
              <button
                key={res}
                onClick={() => updateModifier("susResolution", res)}
                className={`flex-1 px-2 py-1 text-xs font-mono border capitalize ${
                  currentSusRes === res
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white"
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Relative Key */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">Key</label>
          <div className="flex gap-1">
            {(["major", "minor"] as const).map((key) => (
              <button
                key={key}
                onClick={() => updateModifier("relativeKey", key)}
                className={`flex-1 px-2 py-1 text-xs font-mono border capitalize ${
                  currentKey === key
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TIER 2 MODIFIERS - Collapsible */}
      <div className="border-t border-white/10 pt-3">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors py-2"
        >
          <span>Advanced Settings</span>
          <span className="text-white/40">{showAdvanced ? "−" : "+"}</span>
        </button>

        {showAdvanced && (
          <div className="space-y-3 mt-3">

        {/* Tempo */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">
            Tempo: {currentTempo} BPM
          </label>
          <input
            type="range"
            min="40"
            max="180"
            step="10"
            value={currentTempo}
            onChange={(e) => updateModifier("tempo", parseInt(e.target.value))}
            className="w-full h-1 bg-white/20 rounded accent-white"
          />
          <div className="flex justify-between text-[9px] text-white/40 font-mono">
            <span>40 BPM (Doom)</span>
            <span>180 BPM (Industrial)</span>
          </div>
        </div>

        {/* Time Signature */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">Time Signature</label>
          <div className="grid grid-cols-5 gap-1">
            {timeSignatures.map((ts) => (
              <button
                key={ts}
                onClick={() => updateModifier("timeSignature", ts)}
                className={`px-2 py-1 text-xs font-mono border ${
                  currentTime === ts
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white"
                }`}
              >
                {ts}
              </button>
            ))}
          </div>
        </div>

        {/* Inversion */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">Inversion</label>
          <div className="grid grid-cols-3 gap-1">
            {inversions.map((inv) => (
              <button
                key={inv}
                onClick={() => updateModifier("inversionMode", inv)}
                className={`px-2 py-2 text-xs font-mono border text-center ${
                  currentInv === inv
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white"
                }`}
              >
                <div className="font-semibold capitalize">{inv}</div>
                <div className="text-[9px] opacity-60">
                  {inversionLabels[inv as InversionMode]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Arpeggiation */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">Arpeggiation</label>
          <div className="flex gap-1">
            {arpeggiations.map((arp) => (
              <button
                key={arp}
                onClick={() => updateModifier("arpeggiation", arp)}
                className={`flex-1 px-2 py-1 text-xs font-mono border capitalize ${
                  currentArp === arp
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white"
                }`}
              >
                {arp}
              </button>
            ))}
          </div>
        </div>

        {/* Tension Curve */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-white/50">Tension Curve</label>
          <div className="grid grid-cols-2 gap-1">
            {tensions.map((tension) => (
              <button
                key={tension}
                onClick={() => updateModifier("tensionCurve", tension)}
                className={`px-2 py-1 text-xs font-mono border capitalize ${
                  currentTension === tension
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white"
                }`}
              >
                {tension}
              </button>
            ))}
          </div>
        </div>
          </div>
        )}
      </div>

      {isBlockLevel && (
        <p className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-3">
          Leave blank to use progression defaults
        </p>
      )}
    </div>
  );
}
