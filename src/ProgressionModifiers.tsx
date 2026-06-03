import { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  SectionLabel,
  Divider,
  Collapse,
  Slider,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@buschschwick/uac-ui";
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

  const fieldLabelSx = {
    display: "block",
    color: "text.secondary",
    fontSize: 12,
  } as const;

  return (
    <Stack spacing={2}>
      {/* TIER 1 MODIFIERS */}
      <Stack spacing={1.5}>
        <SectionLabel>Core Modifiers</SectionLabel>

        {/* Repetition Count */}
        <Stack spacing={0.75}>
          <Typography component="label" sx={fieldLabelSx}>
            Repetition (beats per chord)
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={currentRep}
            onChange={(_, v: RepetitionCount | null) =>
              v != null && updateModifier("repetitionCount", v)
            }
            fullWidth
          >
            {repetitionCounts.map((count) => (
              <ToggleButton key={count} value={count} sx={{ flex: 1 }}>
                {count}x
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {/* Capo Position */}
        <Stack spacing={0.75}>
          <Typography component="label" sx={fieldLabelSx}>
            Capo Position
          </Typography>
          <Select
            value={currentCapo}
            onChange={(e) =>
              updateModifier("capoPosition", Number(e.target.value) as CapoPosition)
            }
            size="small"
            fullWidth
          >
            {capoPositions.map((pos) => (
              <MenuItem key={pos} value={pos}>
                {capoLabels[pos as CapoPosition]}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {/* Intensity Level */}
        <Stack spacing={0.75}>
          <Typography component="label" sx={fieldLabelSx}>
            Intensity
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={currentIntensity}
            onChange={(_, v: IntensityLevel | null) =>
              v && updateModifier("intensityLevel", v)
            }
            sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.5 }}
          >
            {(["quiet", "medium", "loud"] as const).map((level) => (
              <ToggleButton key={level} value={level} sx={{ flexDirection: "column" }}>
                <Box sx={{ fontWeight: 600, textTransform: "capitalize" }}>{level}</Box>
                <Box sx={{ fontSize: 9, opacity: 0.6 }}>
                  {intensityDescriptions[level]}
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {/* Sus Resolution */}
        <Stack spacing={0.75}>
          <Typography component="label" sx={fieldLabelSx}>
            Sus Resolution
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={currentSusRes}
            onChange={(_, v: SusResolution | null) =>
              v && updateModifier("susResolution", v)
            }
            fullWidth
          >
            {(["major", "minor", "none"] as const).map((res) => (
              <ToggleButton key={res} value={res} sx={{ flex: 1, textTransform: "capitalize" }}>
                {res}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {/* Relative Key */}
        <Stack spacing={0.75}>
          <Typography component="label" sx={fieldLabelSx}>
            Key
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={currentKey}
            onChange={(_, v: RelativeKey | null) => v && updateModifier("relativeKey", v)}
            fullWidth
          >
            {(["major", "minor"] as const).map((key) => (
              <ToggleButton key={key} value={key} sx={{ flex: 1, textTransform: "capitalize" }}>
                {key}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {/* TIER 2 MODIFIERS - Collapsible */}
      <Box>
        <Divider sx={{ mb: 1 }} />
        <Button
          variant="text"
          onClick={() => setShowAdvanced(!showAdvanced)}
          sx={{ width: "100%", justifyContent: "space-between" }}
        >
          <SectionLabel>Advanced Settings</SectionLabel>
          <Box component="span" sx={{ color: "text.secondary" }}>
            {showAdvanced ? "−" : "+"}
          </Box>
        </Button>

        <Collapse in={showAdvanced}>
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            {/* Tempo */}
            <Stack spacing={0.75}>
              <Typography component="label" sx={fieldLabelSx}>
                Tempo: {currentTempo} BPM
              </Typography>
              <Slider
                value={currentTempo}
                onChange={(_, v) => updateModifier("tempo", v as number)}
                min={40}
                max={180}
                step={10}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "text.secondary" }}>
                <Box component="span">40 BPM (Doom)</Box>
                <Box component="span">180 BPM (Industrial)</Box>
              </Box>
            </Stack>

            {/* Time Signature */}
            <Stack spacing={0.75}>
              <Typography component="label" sx={fieldLabelSx}>
                Time Signature
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={currentTime}
                onChange={(_, v: TimeSignature | null) =>
                  v && updateModifier("timeSignature", v)
                }
                sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0.5 }}
              >
                {timeSignatures.map((ts) => (
                  <ToggleButton key={ts} value={ts}>
                    {ts}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>

            {/* Inversion */}
            <Stack spacing={0.75}>
              <Typography component="label" sx={fieldLabelSx}>
                Inversion
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={currentInv}
                onChange={(_, v: InversionMode | null) =>
                  v && updateModifier("inversionMode", v)
                }
                sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.5 }}
              >
                {inversions.map((inv) => (
                  <ToggleButton key={inv} value={inv} sx={{ flexDirection: "column" }}>
                    <Box sx={{ fontWeight: 600, textTransform: "capitalize" }}>{inv}</Box>
                    <Box sx={{ fontSize: 9, opacity: 0.6 }}>
                      {inversionLabels[inv as InversionMode]}
                    </Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>

            {/* Arpeggiation */}
            <Stack spacing={0.75}>
              <Typography component="label" sx={fieldLabelSx}>
                Arpeggiation
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={currentArp}
                onChange={(_, v: ArpeggioPattern | null) =>
                  v && updateModifier("arpeggiation", v)
                }
                fullWidth
              >
                {arpeggiations.map((arp) => (
                  <ToggleButton key={arp} value={arp} sx={{ flex: 1, textTransform: "capitalize" }}>
                    {arp}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>

            {/* Tension Curve */}
            <Stack spacing={0.75}>
              <Typography component="label" sx={fieldLabelSx}>
                Tension Curve
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={currentTension}
                onChange={(_, v: TensionCurve | null) =>
                  v && updateModifier("tensionCurve", v)
                }
                sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0.5 }}
              >
                {tensions.map((tension) => (
                  <ToggleButton key={tension} value={tension} sx={{ textTransform: "capitalize" }}>
                    {tension}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </Collapse>
      </Box>

      {isBlockLevel && (
        <Box>
          <Divider sx={{ mb: 1.5 }} />
          <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
            Leave blank to use progression defaults
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
