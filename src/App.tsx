import { useMemo, useState } from "react";
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
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/15">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold tracking-tight font-mono">
            cord
          </h1>
          <p className="text-xs text-white/50 font-mono">guitar chords</p>
        </div>
        <nav
          aria-label="Sections"
          className="mx-auto max-w-5xl px-6 -mb-px flex gap-1"
        >
          {(["chords", "songs", "progressions"] as const).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                aria-pressed={active}
                className={
                  "px-3 py-2 text-xs font-mono uppercase tracking-wider border-b-2 " +
                  (active
                    ? "border-white text-white"
                    : "border-transparent text-white/50 hover:text-white")
                }
              >
                {t}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {tab === "songs" ? (
          <Songs />
        ) : tab === "progressions" ? (
          <Progressions />
        ) : (
        <>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search chords…"
            className="w-full sm:max-w-sm bg-black border border-white/30 focus:border-white px-3 py-2 text-sm font-mono outline-none placeholder:text-white/40"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {(["All", ...categories] as const).map((c) => {
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={
                    "px-2.5 py-1 text-xs font-mono border " +
                    (active
                      ? "bg-white text-black border-white"
                      : "border-white/30 text-white/70 hover:border-white hover:text-white")
                  }
                >
                  {c}
                </button>
              );
            })}
            <button
              onClick={() => setIncludeDropD((v) => !v)}
              aria-pressed={includeDropD}
              title="Include drop D tuning chords (D A D G B e)"
              className={
                "px-2.5 py-1 text-xs font-mono border ml-1 " +
                (includeDropD
                  ? "bg-white text-black border-white"
                  : "border-white/30 text-white/70 hover:border-white hover:text-white")
              }
            >
              Drop D
            </button>
          </div>
        </div>

        <section className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className="group relative border border-white/20 hover:border-white p-3 flex flex-col items-center gap-2 transition-colors"
            >
              {c.tuning === "drop-d" && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider border border-white/40 text-white/70">
                  Drop D
                </span>
              )}
              <ChordDiagram shape={c.shape} size={120} showFingers={false} />
              <div className="flex w-full items-baseline justify-between">
                <span className="font-mono text-sm">{c.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {c.category}
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-white/50 font-mono text-sm py-12">
              no chords match.
            </p>
          )}
        </section>
        </>
        )}
      </main>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="border border-white/30 bg-black p-6 sm:p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-3xl font-mono">{selected.name}</h2>
                <p className="text-xs font-mono text-white/50 uppercase tracking-wider mt-1">
                  {selected.category}
                  {selected.tuning === "drop-d" && (
                    <span className="ml-2 text-white/70">· Drop D</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="font-mono text-white/60 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex justify-center">
              <ChordDiagram shape={selected.shape} size={280} />
            </div>

            <div className="mt-6 flex justify-between gap-2 text-xs font-mono text-white/60">
              {tuningLabels[selected.tuning ?? "standard"].map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
            {selected.tuning === "drop-d" && (
              <p className="mt-3 text-center text-[10px] font-mono uppercase tracking-wider text-white/40">
                tuning: D A D G B e
              </p>
            )}

            {(() => {
              const suggestions = (selected.next ?? [])
                .map((id) => chords.find((c) => c.id === id))
                .filter((c): c is Chord => Boolean(c));
              if (suggestions.length === 0) return null;
              return (
                <div className="mt-8 pt-6 border-t border-white/15">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-3">
                    next
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedId(s.id)}
                        className="px-2.5 py-1 text-xs font-mono border border-white/20 hover:border-white text-white/80 hover:text-white transition-colors"
                      >
                        {s.name}
                        {s.tuning === "drop-d" && (
                          <span className="ml-1.5 text-white/40">· Drop D</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <footer className="mx-auto max-w-5xl px-6 py-10 text-center text-xs font-mono text-white/40">
        {tab === "chords" ? (
          <p>
            {chords.filter((c) => includeDropD || c.tuning !== "drop-d").length}{" "}
            chords · open and barre shapes
            {includeDropD ? " · drop D included" : ""}
          </p>
        ) : (
          <p>local-only · import / export JSON to save your work</p>
        )}
      </footer>
    </div>
  );
}
