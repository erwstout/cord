import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ProgressionBlockCard from "./ProgressionBlockCard";
import {
  emptyProgression,
  exportProgression,
  loadProgression,
  newId,
  saveProgression,
  validateCollection,
  vibeLabels,
  type DisplayMode,
  type ProgressionBlock,
  type ProgressionCollection,
  type ProgressionModifiers,
  type VibeType,
} from "./progressions";
import ProgressionGenerator from "./ProgressionGenerator";

export default function Progressions() {
  const [progression, setProgression] = useState<ProgressionCollection>(() => {
    const loaded = loadProgression();
    return loaded ?? emptyProgression("post-rock");
  });
  const [display, setDisplay] = useState<DisplayMode>("names");
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveProgression(progression);
  }, [progression]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = progression.blocks.findIndex((b) => b.id === active.id);
    const newIndex = progression.blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setProgression({
      ...progression,
      blocks: arrayMove(progression.blocks, oldIndex, newIndex),
    });
  };

  const addBlock = () => {
    setProgression({
      ...progression,
      blocks: [
        ...progression.blocks,
        { id: newId(), label: "Section", chordIds: [], modifiers: {} },
      ],
    });
  };

  const updateBlock = (id: string, next: ProgressionBlock) => {
    setProgression({
      ...progression,
      blocks: progression.blocks.map((b) => (b.id === id ? next : b)),
    });
  };

  const duplicateBlock = (id: string) => {
    const idx = progression.blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const original = progression.blocks[idx];
    const copy: ProgressionBlock = {
      ...original,
      id: newId(),
      label: `${original.label} copy`,
      chordIds: [...original.chordIds],
    };
    const next = [...progression.blocks];
    next.splice(idx + 1, 0, copy);
    setProgression({ ...progression, blocks: next });
  };

  const deleteBlock = (id: string) => {
    setProgression({
      ...progression,
      blocks: progression.blocks.filter((b) => b.id !== id),
    });
  };

  const onImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const onFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validated = validateCollection(parsed);
      if (!validated) {
        setImportError("That JSON doesn't look like a chord progression.");
        return;
      }
      setProgression(validated);
    } catch {
      setImportError("Couldn't parse that file.");
    }
  };

  const resetProgression = () => {
    if (
      window.confirm(
        "Clear the current progression? Export first if you want to keep it.",
      )
    ) {
      setProgression(emptyProgression(progression.vibe));
    }
  };

  const handleGenerateChords = (newChordIds: string[], blockId: string) => {
    setProgression({
      ...progression,
      blocks: progression.blocks.map((b) =>
        b.id === blockId ? { ...b, chordIds: newChordIds } : b
      ),
    });
  };

  const handleGenerateNew = (vibe: VibeType) => {
    setProgression(emptyProgression(vibe));
  };

  const handleDefaultsChange = (defaults: Partial<ProgressionModifiers>) => {
    setProgression({
      ...progression,
      defaults,
    });
  };

  const vibeLabel = vibeLabels[progression.vibe];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main progression view */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={progression.title}
            onChange={(e) => setProgression({ ...progression, title: e.target.value })}
            placeholder="Progression title"
            className="w-full sm:max-w-sm bg-black border border-white/30 focus:border-white px-3 py-2 text-sm font-mono outline-none placeholder:text-white/40"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <div
              role="group"
              aria-label="Display mode"
              className="flex border border-white/30"
            >
              <button
                onClick={() => setDisplay("names")}
                aria-pressed={display === "names"}
                className={
                  "px-2.5 py-1 text-xs font-mono " +
                  (display === "names"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white")
                }
              >
                names
              </button>
              <button
                onClick={() => setDisplay("graphs")}
                aria-pressed={display === "graphs"}
                className={
                  "px-2.5 py-1 text-xs font-mono border-l border-white/30 " +
                  (display === "graphs"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white")
                }
              >
                graphs
              </button>
            </div>
            <button
              onClick={onImportClick}
              className="px-2.5 py-1 text-xs font-mono border border-white/30 hover:border-white text-white/70 hover:text-white"
            >
              import
            </button>
            <button
              onClick={() => exportProgression(progression)}
              className="px-2.5 py-1 text-xs font-mono border border-white/30 hover:border-white text-white/70 hover:text-white"
            >
              export
            </button>
            <button
              onClick={resetProgression}
              className="px-2.5 py-1 text-xs font-mono border border-white/30 hover:border-white text-white/70 hover:text-white"
            >
              new
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={onFileChosen}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-white/60 border border-white/20 px-3 py-2">
          <span className="font-semibold">{vibeLabel.genre}</span>
          <span>·</span>
          <span className="text-white/40">{vibeLabel.mood}</span>
        </div>

        {importError && (
          <p className="text-xs font-mono text-red-300 border border-red-300/40 px-3 py-2">
            {importError}
          </p>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={progression.blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {progression.blocks.map((b) => (
                <ProgressionBlockCard
                  key={b.id}
                  block={b}
                  display={display}
                  onChange={(next) => updateBlock(b.id, next)}
                  onDuplicate={() => duplicateBlock(b.id)}
                  onDelete={() => deleteBlock(b.id)}
                  defaults={progression.defaults}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={addBlock}
          className="px-3 py-2 text-sm font-mono border border-white/30 hover:border-white text-white/80 hover:text-white"
        >
          + section
        </button>

        {progression.blocks.length === 0 && (
          <p className="text-center text-white/50 font-mono text-sm py-8">
            no sections. add one to get started.
          </p>
        )}
      </div>

      {/* Generator sidebar */}
      <div className="lg:col-span-1 border border-white/20 bg-black/50 p-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-4">
          Generator
        </h2>
        <ProgressionGenerator
          progression={progression}
          onGenerate={handleGenerateChords}
          onGenerateNew={handleGenerateNew}
          onDefaultsChange={handleDefaultsChange}
        />
      </div>
    </div>
  );
}
