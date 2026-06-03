import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Stack,
  Input,
  Button,
  IconButton,
  Typography,
  Panel,
} from "@buschschwick/uac-ui";
import { chords } from "./chords";
import ChordDiagram from "./ChordDiagram";
import { chordNameById, type DisplayMode, type SongBlock } from "./songs";
import ChordPicker from "./ChordPicker";

type Props = {
  block: SongBlock;
  display: DisplayMode;
  onChange: (block: SongBlock) => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export default function SongBlockCard({
  block,
  display,
  onChange,
  onDuplicate,
  onDelete,
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

  return (
    <Panel ref={setNodeRef} style={style} padding={0}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ px: 1, py: 1, borderBottom: 1, borderColor: "divider" }}
      >
        <Box
          component="span"
          {...attributes}
          {...listeners}
          aria-label="Drag block"
          title="Drag to reorder"
          sx={{
            px: 1,
            py: 0.5,
            color: "text.secondary",
            touchAction: "none",
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
          }}
        >
          ⋮⋮
        </Box>
        <Input
          type="text"
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          placeholder="Section name"
          variant="standard"
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={onDuplicate}
          aria-label="Duplicate block"
          title="Duplicate"
        >
          dup
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onDelete}
          aria-label="Delete block"
          title="Delete"
        >
          ×
        </Button>
      </Stack>

      <Box sx={{ p: 1.5 }}>
        {block.chordIds.length === 0 ? (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            no chords yet.
          </Typography>
        ) : display === "graphs" ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {block.chordIds.map((id, i) => {
              const chord = chords.find((c) => c.id === id);
              return (
                <Box
                  key={`${id}-${i}`}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    border: 1,
                    borderColor: "divider",
                    p: 1,
                  }}
                >
                  {chord ? (
                    <ChordDiagram shape={chord.shape} size={96} showFingers={false} />
                  ) : (
                    <Box
                      sx={{
                        width: 96,
                        height: 96,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        fontSize: 12,
                      }}
                    >
                      ?
                    </Box>
                  )}
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Typography component="span" variant="caption">
                      {chord?.name ?? id}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeChordAt(i)}
                      aria-label={`Remove ${chord?.name ?? id}`}
                      sx={{ fontSize: 14, lineHeight: 1, color: "text.secondary" }}
                    >
                      ×
                    </IconButton>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {block.chordIds.map((id, i) => (
              <Box
                key={`${id}-${i}`}
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  border: 1,
                  borderColor: "divider",
                  px: 1,
                  py: 0.5,
                }}
              >
                <Typography component="span" variant="body2">
                  {chordNameById(id)}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeChordAt(i)}
                  aria-label={`Remove ${chordNameById(id)}`}
                  sx={{ lineHeight: 1, color: "text.secondary" }}
                >
                  ×
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Button
          variant="outlined"
          size="small"
          onClick={() => setPickerOpen(true)}
          sx={{ mt: 1.5 }}
        >
          + chord
        </Button>
      </Box>

      {pickerOpen && (
        <ChordPicker
          onPick={addChord}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </Panel>
  );
}
