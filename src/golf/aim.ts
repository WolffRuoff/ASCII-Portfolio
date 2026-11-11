import { AIM_LENGTH, MAX_DRAG, MIN_DRAG } from "./constants";
import { isOpen } from "./physics";
import type { Ball, Course, Metrics } from "./physics";

/** One character of the aim line. */
export interface AimCell {
  row: number;
  col: number;
  char: string;
}

/** Step along the aim line between cell checks, in columns. */
const STEP = 0.25;

/** The line character closest to a direction given in px, y pointing down. */
function lineChar(ux: number, uy: number): string {
  const deg = ((Math.atan2(-uy, ux) * 180) / Math.PI + 180) % 180;
  if (deg < 22.5 || deg >= 157.5) return "-";
  if (deg < 67.5) return "/";
  if (deg < 112.5) return "|";
  return "\\";
}

/**
 * Cells of the line showing where a drag of (dx, dy) px would send the ball,
 * longer for a harder putt and cut short at the first wall or the cup.
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
  // The ball goes opposite the drag.
  const ux = -dx / dist;
  const uy = -dy / dist;
  const char = lineChar(ux, uy);
  const length = (Math.min(dist, MAX_DRAG) / MAX_DRAG) * AIM_LENGTH * charWidth;
  const startRow = Math.floor(ball.y);
  const startCol = Math.floor(ball.x);
  const cells: AimCell[] = [];
  for (let d = STEP * charWidth; d <= length; d += STEP * charWidth) {
    const row = Math.floor(ball.y + (uy * d) / lineHeight);
    const col = Math.floor(ball.x + (ux * d) / charWidth);
    if (row === startRow && col === startCol) continue;
    const last = cells[cells.length - 1];
    if (last && last.row === row && last.col === col) continue;
    if (!isOpen(page, row, col)) break;
    cells.push({ row, col, char });
  }
  return cells;
}
