import { AIM_LENGTH, MAX_DRAG, MIN_DRAG } from "./constants";
import { isOpen } from "./physics";
import type { Ball, Course, Metrics } from "./physics";

/** One dot of the aim line. */
export interface AimCell {
  row: number;
  col: number;
  char: string;
}

// Braille dot bits by [row][column] within a cell's 4x2 grid.
const BRAILLE_DOTS = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
];

/** The Braille character with one dot nearest (x, y) in its cell, 0 to 1. */
function brailleDot(x: number, y: number): string {
  const bit = BRAILLE_DOTS[Math.min(3, Math.floor(y * 4))][x < 0.5 ? 0 : 1];
  return String.fromCharCode(0x2800 + bit);
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
    cells.push({ row, col, char: brailleDot(x - col, y - row) });
  }
  return cells;
}
