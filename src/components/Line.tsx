import { memo } from "react";
import type { PointerEventHandler, ReactElement, ReactNode } from "react";
import type { PageLine, Segment } from "../page/buildPage";
import type { AimCell } from "../golf/aim";

const BALL = "○";

/** A segment as a link if it has an href, otherwise a span. */
function renderSegment(segment: Segment, children: ReactNode, key: string) {
  return segment.href ? (
    <a key={key} href={segment.href}>
      {children}
    </a>
  ) : (
    <span key={key}>{children}</span>
  );
}

interface LineProps {
  segments: PageLine;
  /** -1 when the ball isn't on this row. */
  ballCol: number;
  /** The aim line's cells on this row. */
  aim: AimCell[];
  /** Left out while the ball can't be hit. */
  onBallDown?: PointerEventHandler<HTMLElement>;
  newline: boolean;
}

/** One row of the page, with the ball and aim line drawn over it. */
const Line = memo(({ segments, ballCol, aim, onBallDown, newline }: LineProps) => {
  // What to draw in place of the page's text, by column.
  const marks = new Map<number, ReactElement>();
  for (const { col, char } of aim) {
    marks.set(
      col,
      <span key={`aim${col}`} className="golf-aim">
        {char}
      </span>
    );
  }
  if (ballCol >= 0) {
    marks.set(
      ballCol,
      <span key="ball" className="golf-ball" onPointerDown={onBallDown}>
        {BALL}
      </span>
    );
  }
  const cols = [...marks.keys()].sort((a, b) => a - b);

  let offset = 0;
  const parts = segments.flatMap((segment, i) => {
    const start = offset;
    offset += segment.text.length;
    const inside = cols.filter((col) => col >= start && col < offset);
    if (!inside.length) return [renderSegment(segment, segment.text, `${i}`)];
    const out: ReactElement[] = [];
    let at = 0;
    for (const col of inside) {
      const text = segment.text.slice(at, col - start);
      if (text) out.push(renderSegment(segment, text, `${i}-${at}`));
      out.push(marks.get(col)!);
      at = col - start + 1;
    }
    const rest = segment.text.slice(at);
    if (rest) out.push(renderSegment(segment, rest, `${i}-${at}`));
    return out;
  });
  return (
    <>
      {parts}
      {newline && "\n"}
    </>
  );
});

export default Line;
