import { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  SectionLabel,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Modal,
} from "@buschschwick/uac-ui";
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
    <Stack spacing={3}>
      {/* Vibe Selector */}
      <Stack spacing={1.5}>
        <SectionLabel>Vibe</SectionLabel>
        <ToggleButtonGroup
          exclusive
          value={selectedVibe}
          onChange={(_, v: VibeType | null) => v && handleChangeVibe(v)}
          orientation="vertical"
          sx={{ "& .MuiToggleButton-root": { justifyContent: "flex-start", textAlign: "left" } }}
        >
          {vibes.map((vibe) => {
            const label = vibeLabels[vibe];
            return (
              <ToggleButton key={vibe} value={vibe}>
                <Box>
                  <Box sx={{ fontWeight: 600 }}>{label.genre}</Box>
                  <Box sx={{ fontSize: 9, opacity: 0.7 }}>{label.mood}</Box>
                </Box>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Stack>

      {/* Root Note Selector */}
      <Stack spacing={1.5}>
        <SectionLabel>Root Note</SectionLabel>
        <ToggleButtonGroup
          exclusive
          value={selectedRoot}
          onChange={(_, v: string | null) => v && setSelectedRoot(v)}
          sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(4, 1fr)", sm: "repeat(6, 1fr)" }, gap: 0.75 }}
        >
          {chordRoots.map((root) => (
            <ToggleButton key={root} value={root}>
              {root}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {/* Generate Buttons for Each Block */}
      <Stack spacing={1.5}>
        <SectionLabel>Generate Chords</SectionLabel>
        <Stack spacing={1}>
          {progression.blocks.map((block) => (
            <Button
              key={block.id}
              variant="outlined"
              onClick={() => handleGenerateForBlock(block.id)}
              sx={{ justifyContent: "flex-start" }}
            >
              Generate for "{block.label}"
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* Modifiers */}
      <Box sx={{ pt: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <SectionLabel sx={{ display: "block", mb: 2 }}>
          Progression Settings
        </SectionLabel>
        <ProgressionModifiersPanel
          modifiers={progression.defaults}
          onChange={onDefaultsChange}
        />
      </Box>

      {/* Chord Viewer */}
      <Box sx={{ pt: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <SectionLabel sx={{ display: "block", mb: 2 }}>
          Quick Reference
        </SectionLabel>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(4, 1fr)", md: "repeat(6, 1fr)" },
            gap: 1,
          }}
        >
          {chords.slice(0, 24).map((c) => (
            <Box
              key={c.id}
              component="button"
              onClick={() => setSelectedChordId(c.id)}
              sx={{
                border: 1,
                borderColor: "divider",
                bgcolor: "background.default",
                color: "text.primary",
                cursor: "pointer",
                p: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.75,
                transition: "border-color .15s",
                "&:hover": { borderColor: "text.primary" },
              }}
            >
              <ChordDiagram shape={c.shape} size={80} showFingers={false} />
              <Typography component="span" variant="caption">
                {c.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Chord Detail Modal */}
      <Modal
        open={selectedChord != null}
        onClose={() => setSelectedChordId(null)}
        maxWidth="xs"
        fullWidth
      >
        {selectedChord && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: 30, fontFamily: "monospace" }}>
                  {selectedChord.name}
                </Typography>
                <SectionLabel sx={{ mt: 0.5 }}>{selectedChord.category}</SectionLabel>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ChordDiagram shape={selectedChord.shape} size={280} />
            </Box>
          </Box>
        )}
      </Modal>
    </Stack>
  );
}
