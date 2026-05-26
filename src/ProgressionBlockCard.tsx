import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { chords } from "./chords";
import ChordDiagram from "./ChordDiagram";
import ProgressionModifiersPanel from "./ProgressionModifiers";
import { chordNameById, getBlockModifiers, type DisplayMode, type ProgressionBlock, type ProgressionModifiers } from "./progressions";
import ChordPicker from "./ChordPicker";

type Props = {
  block: ProgressionBlock;
  display: DisplayMode;
  onChange: (block: ProgressionBlock) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  defaults: Partial<ProgressionModifiers>;
};

export default function ProgressionBlockCard({
  block,
  display,
  onChange,
  onDuplicate,
  onDelete,
  defaults,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [modifiersOpen, setModifiersOpen] = useState(false);

  const blockModifiers = getBlockModifiers(block, defaults);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const addChord = (chordId: string) => {
    onChange({ ...block, chordIds: [...block.chordIds, chordId] });
  };

  const removeChordAt = (index: number) => {
    onChange({
      ...block,
      chordIds: block.chordIds.filter((_, i) => i !== index),
    });
  };

  const updateModifiers = (modifiers: Partial<ProgressionModifiers>) => {
    onChange({
      ...block,
      modifiers,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-white/20 bg-black"
    >
      <div className="flex items-center gap-2 px-2 py-2 border-b border-white/10">
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag block"
          title="Drag to reorder"
          className="px-2 py-1 text-white/40 hover:text-white touch-none cursor-grab active:cursor-grabbing font-mono"
        >
          ⋮⋮
        </button>
        <input
          type="text"
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          placeholder="Section name"
          className="flex-1 bg-transparent border-0 px-2 py-1 text-sm font-mono outline-none focus:bg-white/5 placeholder:text-white/30"
        />
        <div className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-white/50">
          <span title="Repetition count">×{blockModifiers.repetitionCount}</span>
          {blockModifiers.capoPosition > 0 && (
            <span title="Capo position">capo {blockModifiers.capoPosition}</span>
          )}
          <span title="Tempo">{blockModifiers.tempo}bpm</span>
        </div>
        <button
          onClick={() => setModifiersOpen(true)}
          aria-label="Edit modifiers"
          title="Edit modifiers"
          className="px-2 py-1 text-xs font-mono text-white/60 hover:text-white border border-white/20 hover:border-white"
        >
          mod
        </button>
        <button
          onClick={onDuplicate}
          aria-label="Duplicate block"
          title="Duplicate"
          className="px-2 py-1 text-xs font-mono text-white/60 hover:text-white border border-white/20 hover:border-white"
        >
          dup
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete block"
          title="Delete"
          className="px-2 py-1 text-xs font-mono text-white/60 hover:text-white border border-white/20 hover:border-white"
        >
          ×
        </button>
      </div>

      <div className="p-3">
        {block.chordIds.length === 0 ? (
          <p className="text-xs font-mono text-white/40">no chords yet.</p>
        ) : display === "graphs" ? (
          <div className="flex flex-wrap gap-3">
            {block.chordIds.map((id, i) => {
              const chord = chords.find((c) => c.id === id);
              return (
                <div
                  key={`${id}-${i}`}
                  className="flex flex-col items-center gap-1 border border-white/15 p-2"
                >
                  {chord ? (
                    <ChordDiagram shape={chord.shape} size={96} showFingers={false} />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center text-white/40 font-mono text-xs">
                      ?
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">
                      {chord?.name ?? id}
                    </span>
                    <button
                      onClick={() => removeChordAt(i)}
                      aria-label={`Remove ${chord?.name ?? id}`}
                      className="text-white/40 hover:text-white text-sm leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {block.chordIds.map((id, i) => (
              <span
                key={`${id}-${i}`}
                className="inline-flex items-center gap-1.5 border border-white/20 px-2 py-1 font-mono text-sm"
              >
                {chordNameById(id)}
                <button
                  onClick={() => removeChordAt(i)}
                  aria-label={`Remove ${chordNameById(id)}`}
                  className="text-white/40 hover:text-white leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setPickerOpen(true)}
          className="mt-3 px-2.5 py-1 text-xs font-mono border border-white/30 hover:border-white text-white/70 hover:text-white"
        >
          + chord
        </button>
      </div>

      {pickerOpen && (
        <ChordPicker
          onPick={addChord}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {modifiersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setModifiersOpen(false)}
        >
          <div
            className="border border-white/30 bg-black p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-lg font-mono">{block.label} Modifiers</h2>
              <button
                onClick={() => setModifiersOpen(false)}
                aria-label="Close"
                className="font-mono text-white/60 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <ProgressionModifiersPanel
              modifiers={block.modifiers}
              onChange={updateModifiers}
              isBlockLevel
            />
          </div>
        </div>
      )}
    </div>
  );
}
