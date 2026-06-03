import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Stack,
  Input,
  IconButton,
  Typography,
  SectionLabel,
  Modal,
} from "@buschschwick/uac-ui";
import { chords } from "./chords";

type Props = {
  onPick: (chordId: string) => void;
  onClose: () => void;
};

export default function ChordPicker({ onPick, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chords.slice(0, 24);
    return chords
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      )
      .slice(0, 36);
  }, [query]);

  return (
    <Modal open onClose={onClose} maxWidth="sm" fullWidth>
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Input
            inputRef={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search chords…"
            sx={{ flex: 1 }}
          />
          <IconButton
            aria-label="Close"
            onClick={onClose}
            sx={{ fontSize: 24, lineHeight: 1 }}
          >
            ×
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(4, 1fr)" },
            gap: 0.75,
            maxHeight: "60vh",
            overflow: "auto",
          }}
        >
          {results.map((c) => (
            <Box
              key={c.id}
              component="button"
              onClick={() => {
                onPick(c.id);
                setQuery("");
                inputRef.current?.focus();
              }}
              sx={{
                border: 1,
                borderColor: "divider",
                bgcolor: "background.default",
                color: "text.primary",
                cursor: "pointer",
                px: 1,
                py: 1,
                textAlign: "left",
                transition: "border-color .15s",
                "&:hover": { borderColor: "text.primary" },
              }}
            >
              <Typography component="span" variant="body2">
                {c.name}
              </Typography>
              {c.tuning === "drop-d" && (
                <Typography
                  component="span"
                  sx={{
                    ml: 0.5,
                    fontSize: 9,
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  drop D
                </Typography>
              )}
            </Box>
          ))}
          {results.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "text.secondary",
                py: 4,
              }}
            >
              no chords match.
            </Typography>
          )}
        </Box>
        <SectionLabel sx={{ mt: 1.5, display: "block" }}>
          tap a chord to add · esc to close
        </SectionLabel>
      </Box>
    </Modal>
  );
}
