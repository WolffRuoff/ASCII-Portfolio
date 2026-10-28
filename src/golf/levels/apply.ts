import type { Page, PageLine } from "../../page/buildPage";
import type { Cell, Course } from "../physics";
import type { Anchor, Art, Level } from "./types";

/** A built page with a level drawn on it. */
export interface LevelPage extends Page, Course {
  /** Art characters that couldn't be drawn; levels should have none. */
  dropped: number;
}

/** Every level's slot art draws over this, so the layout stays put. */
export const BLANK_SLOT: string[] = Array(25).fill(" ".repeat(58));

/** Turns an anchor into a page row and column. */
export function resolveAnchor(
  page: Page,
  { section, row = 0, col = 0, from = "left" }: Anchor
): Cell {
  if (section === "slot") {
    const s = page.sections.slot;
    return { row: s.row + row, col: s.col + col };
  }
  const s = page.sections[section];
  const base =
    from === "center" ? page.center : from === "right" ? page.right : page.left;
  return { row: s.row + row, col: base + col };
}

/** Writes one character into both the lines and the grid. */
function setChar(
  lines: PageLine[],
  grid: string[],
  row: number,
  col: number,
  ch: string
) {
  let offset = 0;
  lines[row] = lines[row].map((segment) => {
    const at = col - offset;
    offset += segment.text.length;
    if (at < 0 || at >= segment.text.length) return segment;
    const text = segment.text.slice(0, at) + ch + segment.text.slice(at + 1);
    return { ...segment, text };
  });
  grid[row] = grid[row].slice(0, col) + ch + grid[row].slice(col + 1);
}

export interface ApplyLevelOptions {
  /** The level played before this one; its cup is this level's default tee. */
  prev?: Level;
  /** Draws the flag in the cup; defaults to true. */
  withFlag?: boolean;
  /**
   * Draws only the art within this share (0 to 1) of the way out from the tee
   * or the cup, for the level transition.
   */
  reveal?: { around: "tee" | "cup"; amount: number };
}

/** Where a level's tee is, falling back to the previous level's cup. */
function resolveTee(page: Page, level: Level, prev?: Level): Cell {
  if (level.tee) return resolveAnchor(page, level.tee);
  if (!prev) throw new Error(`${level.name} needs a tee`);
  const cup = resolveAnchor(page, prev.cup);
  return { row: cup.row, col: cup.col + 1 };
}

/** Draws a level's art, cup and flag onto a built page. */
export function applyLevel(
  page: Page,
  level: Level,
  { prev, withFlag = true, reveal }: ApplyLevelOptions = {}
): LevelPage {
  const lines = [...page.lines];
  const grid = [...page.grid];
  const chars: (Cell & { ch: string })[] = [];
  let dropped = 0;

  const draw = (row: number, col: number, text: string) => {
    [...text].forEach((ch, i) => {
      const c = col + i;
      if (ch === " ") return;
      const inFrame = c >= page.left && c <= page.right;
      if (!inFrame || grid[row]?.[c] !== " ") {
        dropped++;
        return;
      }
      chars.push({ row, col: c, ch });
    });
  };

  const art: Art[] = [...(level.art || [])];
  if (level.slot) art.unshift({ at: { section: "slot" }, lines: level.slot });
  for (const { at, lines: rows } of art) {
    const origin = resolveAnchor(page, at);
    rows.forEach((line, i) => draw(origin.row + i, origin.col, line));
  }

  const tee = resolveTee(page, level, prev);
  const cup = resolveAnchor(page, level.cup);
  if (grid[tee.row]?.[tee.col] !== " ") dropped++;
  draw(cup.row, cup.col, "(_)");
  if (withFlag) {
    draw(cup.row - 2, cup.col + 1, "|>");
    draw(cup.row - 1, cup.col + 1, "|");
  } else {
    // Without the pole the hole gets its top edge.
    draw(cup.row - 1, cup.col + 1, "_");
  }

  let shown = chars;
  if (reveal) {
    const center = reveal.around === "tee" ? tee : { ...cup, col: cup.col + 1 };
    // Rows count twice since cells are about twice as tall as wide.
    const dist = (c: Cell) =>
      Math.hypot(c.col - center.col, (c.row - center.row) * 2);
    const extent = Math.max(0, ...chars.map(dist));
    shown = chars.filter((c) => dist(c) <= reveal.amount * extent);
  }
  for (const { row, col, ch } of shown) setChar(lines, grid, row, col, ch);

  return { ...page, lines, grid, tee, cup: { ...cup, width: 3 }, dropped };
}
