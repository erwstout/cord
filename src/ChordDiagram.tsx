import type { ChordShape } from "./chords";

type Props = {
  shape: ChordShape;
  size?: number;
  showFingers?: boolean;
};

const STRINGS = 6;
const FRETS_VISIBLE = 5;

const LEFT = 15;
const RIGHT = 95;
const TOP = 22;
const FRET_HEIGHT = 16;
const STRING_SPACING = (RIGHT - LEFT) / (STRINGS - 1);
const BOTTOM = TOP + FRETS_VISIBLE * FRET_HEIGHT;

function stringX(i: number) {
  return LEFT + i * STRING_SPACING;
}

function fretY(relativeFret: number) {
  // returns the y position of the dot for a fret rendered at slot `relativeFret` (1..5)
  return TOP + (relativeFret - 0.5) * FRET_HEIGHT;
}

export default function ChordDiagram({
  shape,
  size = 220,
  showFingers = true,
}: Props) {
  const baseFret = shape.baseFret ?? 1;
  const isOpenPosition = baseFret === 1;

  const dots: { x: number; y: number; finger?: number; barre?: boolean }[] = [];

  shape.strings.forEach((fret, i) => {
    if (fret > 0) {
      const relativeFret = fret - baseFret + 1;
      if (relativeFret >= 1 && relativeFret <= FRETS_VISIBLE) {
        dots.push({
          x: stringX(i),
          y: fretY(relativeFret),
          finger: shape.fingers?.[i],
        });
      }
    }
  });

  return (
    <svg
      viewBox="-12 0 122 120"
      width={size}
      height={size * (120 / 122)}
      style={{ display: "block" }}
      role="img"
    >
      {/* string labels: O for open, X for muted */}
      {shape.strings.map((fret, i) => {
        const x = stringX(i);
        if (fret === -1) {
          return (
            <g key={`mark-${i}`} stroke="white" strokeWidth={1.4}>
              <line x1={x - 3} y1={9} x2={x + 3} y2={15} />
              <line x1={x + 3} y1={9} x2={x - 3} y2={15} />
            </g>
          );
        }
        if (fret === 0) {
          return (
            <circle
              key={`mark-${i}`}
              cx={x}
              cy={12}
              r={3}
              fill="none"
              stroke="white"
              strokeWidth={1.2}
            />
          );
        }
        return null;
      })}

      {/* nut (thick top line if open position) */}
      {isOpenPosition && (
        <line
          x1={LEFT - 1}
          y1={TOP}
          x2={RIGHT + 1}
          y2={TOP}
          stroke="white"
          strokeWidth={3}
        />
      )}

      {/* fret position label */}
      {!isOpenPosition && (
        <text
          x={LEFT - 4}
          y={TOP + FRET_HEIGHT / 2 + 3}
          textAnchor="end"
          fontSize={9}
          fill="white"
          fontFamily="ui-monospace, monospace"
        >
          {baseFret}fr
        </text>
      )}

      {/* fret lines */}
      {Array.from({ length: FRETS_VISIBLE + 1 }).map((_, idx) => {
        if (idx === 0 && isOpenPosition) return null;
        const y = TOP + idx * FRET_HEIGHT;
        return (
          <line
            key={`fret-${idx}`}
            x1={LEFT}
            y1={y}
            x2={RIGHT}
            y2={y}
            stroke="white"
            strokeWidth={idx === 0 ? 2 : 1}
            opacity={idx === 0 ? 1 : 0.7}
          />
        );
      })}

      {/* strings */}
      {Array.from({ length: STRINGS }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={stringX(i)}
          y1={TOP}
          x2={stringX(i)}
          y2={BOTTOM}
          stroke="white"
          strokeWidth={1}
          opacity={0.85}
        />
      ))}

      {/* barre */}
      {shape.barre && (() => {
        const rel = shape.barre.fret - baseFret + 1;
        if (rel < 1 || rel > FRETS_VISIBLE) return null;
        const y = fretY(rel);
        const x1 = stringX(shape.barre.from);
        const x2 = stringX(shape.barre.to);
        return (
          <rect
            x={Math.min(x1, x2) - 5}
            y={y - 4}
            width={Math.abs(x2 - x1) + 10}
            height={8}
            rx={4}
            ry={4}
            fill="white"
          />
        );
      })()}

      {/* dots */}
      {dots.map((d, i) => (
        <g key={`dot-${i}`}>
          <circle cx={d.x} cy={d.y} r={5} fill="white" />
          {showFingers && d.finger ? (
            <text
              x={d.x}
              y={d.y + 2.6}
              textAnchor="middle"
              fontSize={7}
              fill="black"
              fontFamily="ui-monospace, monospace"
              fontWeight={700}
            >
              {d.finger}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
