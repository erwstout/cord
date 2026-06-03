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
  Panel,
  SectionLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@buschschwick/uac-ui";
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" },
        gap: 3,
      }}
    >
      {/* Main progression view */}
      <Stack spacing={2} sx={{ gridColumn: { lg: "span 2" } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
        >
          <Input
            type="text"
            value={progression.title}
            onChange={(e) => setProgression({ ...progression, title: e.target.value })}
            placeholder="Progression title"
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
            <Button
              variant="outlined"
              size="small"
              onClick={() => exportProgression(progression)}
            >
              export
            </Button>
            <Button variant="outlined" size="small" onClick={resetProgression}>
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

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            border: 1,
            borderColor: "divider",
            px: 1.5,
            py: 1,
            color: "text.secondary",
            fontSize: 12,
          }}
        >
          <Box component="span" sx={{ fontWeight: 600 }}>
            {vibeLabel.genre}
          </Box>
          <Box component="span">·</Box>
          <Box component="span">{vibeLabel.mood}</Box>
        </Stack>

        {importError && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
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
            items={progression.blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <Stack spacing={1.5}>
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
            </Stack>
          </SortableContext>
        </DndContext>

        <Box>
          <Button variant="outlined" onClick={addBlock}>
            + section
          </Button>
        </Box>

        {progression.blocks.length === 0 && (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "text.secondary", py: 4 }}
          >
            no sections. add one to get started.
          </Typography>
        )}
      </Stack>

      {/* Generator sidebar */}
      <Panel sx={{ gridColumn: { lg: "span 1" } }}>
        <SectionLabel sx={{ display: "block", mb: 2 }}>Generator</SectionLabel>
        <ProgressionGenerator
          progression={progression}
          onGenerate={handleGenerateChords}
          onGenerateNew={handleGenerateNew}
          onDefaultsChange={handleDefaultsChange}
        />
      </Panel>
    </Box>
  );
}
