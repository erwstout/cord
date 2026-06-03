import { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Tabs,
  Tab,
  Input,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  SectionLabel,
  Modal,
  Divider,
} from "@buschschwick/uac-ui";
import { chords, tuningLabels, type Chord } from "./chords";
import ChordDiagram from "./ChordDiagram";
import Songs from "./Songs";
import Progressions from "./Progressions";

const categories: Chord["category"][] = [
  "Major",
  "Minor",
  "7th",
  "Minor 7th",
  "Major 7th",
  "Sus",
];

type Tab = "chords" | "songs" | "progressions";

const SHELL_SX = { width: "100%", maxWidth: 1024, mx: "auto", px: 3 } as const;

export default function App() {
  const [tab, setTab] = useState<Tab>("chords");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    Chord["category"] | "All"
  >("All");
  const [includeDropD, setIncludeDropD] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chords.filter((c) => {
      const isDropD = c.tuning === "drop-d";
      if (isDropD && !includeDropD) return false;
      if (activeCategory !== "All" && c.category !== activeCategory)
        return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (isDropD && "drop d".includes(q))
      );
    });
  }, [query, activeCategory, includeDropD]);

  const selected = selectedId
    ? chords.find((c) => c.id === selectedId) ?? null
    : null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Box component="header" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ ...SHELL_SX, py: 3, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <Typography variant="h1">cord</Typography>
          <SectionLabel>guitar chords</SectionLabel>
        </Box>
        <Box sx={{ ...SHELL_SX }}>
          <Tabs
            value={tab}
            onChange={(_, v: Tab) => setTab(v)}
            aria-label="Sections"
          >
            <Tab value="chords" label="chords" />
            <Tab value="songs" label="songs" />
            <Tab value="progressions" label="progressions" />
          </Tabs>
        </Box>
      </Box>

      <Box component="main" sx={{ ...SHELL_SX, py: 4 }}>
        {tab === "songs" ? (
          <Songs />
        ) : tab === "progressions" ? (
          <Progressions />
        ) : (
          <>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
            >
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search chords…"
                sx={{ width: "100%", maxWidth: { sm: 384 } }}
              />
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap alignItems="center">
                <ToggleButtonGroup
                  exclusive
                  value={activeCategory}
                  onChange={(_, v) => v && setActiveCategory(v)}
                  sx={{ flexWrap: "wrap", gap: 0.75 }}
                >
                  {(["All", ...categories] as const).map((c) => (
                    <ToggleButton key={c} value={c}>
                      {c}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <ToggleButton
                  value="drop-d"
                  selected={includeDropD}
                  onChange={() => setIncludeDropD((v) => !v)}
                  title="Include drop D tuning chords (D A D G B e)"
                  sx={{ ml: 0.5 }}
                >
                  Drop D
                </ToggleButton>
              </Stack>
            </Stack>

            <Box
              component="section"
              sx={{
                mt: 4,
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(5, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {filtered.map((c) => (
                <Box
                  key={c.id}
                  component="button"
                  onClick={() => setSelectedId(c.id)}
                  sx={{
                    position: "relative",
                    border: 1,
                    borderColor: "divider",
                    bgcolor: "background.default",
                    color: "text.primary",
                    cursor: "pointer",
                    p: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    transition: "border-color .15s",
                    "&:hover": { borderColor: "text.primary" },
                  }}
                >
                  {c.tuning === "drop-d" && (
                    <Box
                      component="span"
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        px: 0.75,
                        py: 0.25,
                        fontSize: 9,
                        fontFamily: "monospace",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        border: 1,
                        borderColor: "text.secondary",
                        color: "text.secondary",
                      }}
                    >
                      Drop D
                    </Box>
                  )}
                  <ChordDiagram shape={c.shape} size={120} showFingers={false} />
                  <Box sx={{ display: "flex", width: "100%", alignItems: "baseline", justifyContent: "space-between" }}>
                    <Typography component="span" variant="body2">{c.name}</Typography>
                    <Typography
                      component="span"
                      sx={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}
                    >
                      {c.category}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {filtered.length === 0 && (
                <Typography
                  sx={{ gridColumn: "1 / -1", textAlign: "center", color: "text.secondary", py: 6 }}
                  variant="body2"
                >
                  no chords match.
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>

      <Modal open={selected != null} onClose={() => setSelectedId(null)} maxWidth="xs" fullWidth>
        {selected && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: 30, fontFamily: "monospace" }}>{selected.name}</Typography>
                <SectionLabel sx={{ mt: 0.5 }}>
                  {selected.category}
                  {selected.tuning === "drop-d" && " · Drop D"}
                </SectionLabel>
              </Box>
              <IconButton aria-label="Close" onClick={() => setSelectedId(null)} sx={{ fontSize: 24, lineHeight: 1 }}>
                ×
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ChordDiagram shape={selected.shape} size={280} />
            </Box>

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3, color: "text.secondary" }}>
              {tuningLabels[selected.tuning ?? "standard"].map((label, i) => (
                <Typography key={i} component="span" variant="caption">{label}</Typography>
              ))}
            </Stack>
            {selected.tuning === "drop-d" && (
              <Typography
                sx={{ mt: 1.5, textAlign: "center", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}
              >
                tuning: D A D G B e
              </Typography>
            )}

            {(() => {
              const suggestions = (selected.next ?? [])
                .map((id) => chords.find((c) => c.id === id))
                .filter((c): c is Chord => Boolean(c));
              if (suggestions.length === 0) return null;
              return (
                <Box sx={{ mt: 4, pt: 3 }}>
                  <Divider sx={{ mb: 3 }} />
                  <SectionLabel sx={{ mb: 1.5, display: "block" }}>next</SectionLabel>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    {suggestions.map((s) => (
                      <Button key={s.id} variant="outlined" onClick={() => setSelectedId(s.id)}>
                        {s.name}
                        {s.tuning === "drop-d" && " · Drop D"}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              );
            })()}
          </Box>
        )}
      </Modal>

      <Box component="footer" sx={{ ...SHELL_SX, py: 5, textAlign: "center", color: "text.secondary" }}>
        {tab === "chords" ? (
          <Typography variant="caption">
            {chords.filter((c) => includeDropD || c.tuning !== "drop-d").length}{" "}
            chords · open and barre shapes
            {includeDropD ? " · drop D included" : ""}
          </Typography>
        ) : (
          <Typography variant="caption">local-only · import / export JSON to save your work</Typography>
        )}
      </Box>
    </Box>
  );
}
