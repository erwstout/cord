import { useEffect, useMemo, useRef, useState } from "react";
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 z-50"
      onClick={onClose}
    >
      <div
        className="border border-white/30 bg-black p-4 sm:p-5 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search chords…"
            className="flex-1 bg-black border border-white/30 focus:border-white px-3 py-2 text-sm font-mono outline-none placeholder:text-white/40"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-white/60 hover:text-white text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-[60vh] overflow-auto">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onPick(c.id);
                setQuery("");
                inputRef.current?.focus();
              }}
              className="border border-white/20 hover:border-white px-2 py-2 text-sm font-mono text-left transition-colors"
            >
              <span>{c.name}</span>
              {c.tuning === "drop-d" && (
                <span className="ml-1 text-[9px] text-white/40 uppercase">
                  drop D
                </span>
              )}
            </button>
          ))}
          {results.length === 0 && (
            <p className="col-span-full text-center text-white/50 font-mono text-sm py-8">
              no chords match.
            </p>
          )}
        </div>
        <p className="mt-3 text-[10px] font-mono uppercase tracking-wider text-white/40">
          tap a chord to add · esc to close
        </p>
      </div>
    </div>
  );
}
