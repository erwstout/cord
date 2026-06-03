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
import {
  Box,
  Stack,
  Input,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@buschschwick/uac-ui";
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
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Input
          type="text"
          value={song.title}
          onChange={(e) => setSong({ ...song, title: e.target.value })}
          placeholder="Song title"
          sx={{ width: "100%", maxWidth: { sm: 384 } }}
        />
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap alignItems="center">
          <ToggleButtonGroup
            exclusive
            value={display}
            onChange={(_, v: DisplayMode | null) => v && setDisplay(v)}
            aria-label="Display mode"
          >
            <ToggleButton value="names">names</ToggleButton>
            <ToggleButton value="graphs">graphs</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="outlined" size="small" onClick={onImportClick}>
            import
          </Button>
          <Button variant="outlined" size="small" onClick={() => exportSong(song)}>
            export
          </Button>
          <Button variant="outlined" size="small" onClick={resetSong}>
            new
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={onFileChosen}
          />
        </Stack>
      </Stack>

      {importError && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1.5,
            color: "error.main",
            border: 1,
            borderColor: "error.main",
            px: 1.5,
            py: 1,
          }}
        >
          {importError}
        </Typography>
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
          <Box
            sx={{
              mt: 3,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 1.5,
            }}
          >
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
          </Box>
        </SortableContext>
      </DndContext>

      <Button variant="outlined" onClick={addBlock} sx={{ mt: 2 }}>
        + block
      </Button>

      {song.blocks.length === 0 && (
        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "text.secondary", py: 4 }}
        >
          no blocks. add one to get started.
        </Typography>
      )}
    </Box>
  );
}
