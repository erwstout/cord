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
import SongBlockCard from "./SongBlock";
import {
  emptySong,
  exportSong,
  loadSong,
  newId,
  saveSong,
  validateCollection,
  type DisplayMode,
  type SongBlock,
  type SongCollection,
} from "./songs";

export default function Songs() {
  const [song, setSong] = useState<SongCollection>(() => loadSong());
  const [display, setDisplay] = useState<DisplayMode>("names");
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveSong(song);
  }, [song]);

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
    const oldIndex = song.blocks.findIndex((b) => b.id === active.id);
    const newIndex = song.blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setSong({ ...song, blocks: arrayMove(song.blocks, oldIndex, newIndex) });
  };

  const addBlock = () => {
    setSong({
      ...song,
      blocks: [
        ...song.blocks,
        { id: newId(), label: "Section", chordIds: [] },
      ],
    });
  };

  const updateBlock = (id: string, next: SongBlock) => {
    setSong({
      ...song,
      blocks: song.blocks.map((b) => (b.id === id ? next : b)),
    });
  };

  const duplicateBlock = (id: string) => {
    const idx = song.blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const original = song.blocks[idx];
    const copy: SongBlock = {
      ...original,
      id: newId(),
      label: `${original.label} copy`,
      chordIds: [...original.chordIds],
    };
    const next = [...song.blocks];
    next.splice(idx + 1, 0, copy);
    setSong({ ...song, blocks: next });
  };

  const deleteBlock = (id: string) => {
    setSong({ ...song, blocks: song.blocks.filter((b) => b.id !== id) });
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
        setImportError("That JSON doesn't look like a cord song.");
        return;
      }
      setSong(validated);
    } catch {
      setImportError("Couldn't parse that file.");
    }
  };

  const resetSong = () => {
    if (
      window.confirm(
        "Clear the current song? Export first if you want to keep it.",
      )
    ) {
      setSong(emptySong());
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={song.title}
          onChange={(e) => setSong({ ...song, title: e.target.value })}
          placeholder="Song title"
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
            onClick={() => exportSong(song)}
            className="px-2.5 py-1 text-xs font-mono border border-white/30 hover:border-white text-white/70 hover:text-white"
          >
            export
          </button>
          <button
            onClick={resetSong}
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

      {importError && (
        <p className="mt-3 text-xs font-mono text-red-300 border border-red-300/40 px-3 py-2">
          {importError}
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={song.blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {song.blocks.map((b) => (
              <SongBlockCard
                key={b.id}
                block={b}
                display={display}
                onChange={(next) => updateBlock(b.id, next)}
                onDuplicate={() => duplicateBlock(b.id)}
                onDelete={() => deleteBlock(b.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={addBlock}
        className="mt-4 px-3 py-2 text-sm font-mono border border-white/30 hover:border-white text-white/80 hover:text-white"
      >
        + block
      </button>

      {song.blocks.length === 0 && (
        <p className="mt-6 text-center text-white/50 font-mono text-sm py-8">
          no blocks. add one to get started.
        </p>
      )}
    </div>
  );
}
