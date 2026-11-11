import { AIM_LENGTH, MAX_DRAG, MIN_DRAG } from "./constants";
import { isOpen } from "./physics";
import type { Ball, Course, Metrics } from "./physics";

/** One dot of the aim line. */
export interface AimCell {
  row: number;
  col: number;
  /** How far the dot sits from the cell's middle, in cells. */
  dx: number;
  dy: number;
}

/**
 * Dots showing where a drag of (dx, dy) px would send the ball, one cell apart
 * along the line, longer for a harder putt and cut short at a wall or the cup.
 */
export function aimLine(
  ball: Ball,
  page: Course,
  dx: number,
  dy: number,
  { charWidth, lineHeight }: Metrics
): AimCell[] {
  const dist = Math.hypot(dx, dy);
  if (dist < MIN_DRAG) return [];
  // The ball goes opposite the drag; this is its direction in cells per px.
  const cx = -dx / dist / charWidth;
  const cy = -dy / dist / lineHeight;
  // Px between dots, so each dot moves one cell along the line's main axis.
  const spacing = 1 / Math.max(Math.abs(cx), Math.abs(cy));
  const length = (Math.min(dist, MAX_DRAG) / MAX_DRAG) * AIM_LENGTH * charWidth;
  const cells: AimCell[] = [];
  for (let d = spacing; d <= length; d += spacing) {
    const x = ball.x + cx * d;
    const y = ball.y + cy * d;
    const row = Math.floor(y);
    const col = Math.floor(x);
    if (!isOpen(page, row, col)) break;
    cells.push({ row, col, dx: x - col - 0.5, dy: y - row - 0.5 });
  }
  return cells;
}
