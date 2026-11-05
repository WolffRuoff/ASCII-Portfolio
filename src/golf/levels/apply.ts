import type { Page, PageLine } from "../../page/buildPage";
import type { Cell, Course } from "../physics";
import type { Anchor, Art, Level } from "./types";

/** How long each frame of a level's animation shows, in ms. */
export const FRAME_TIME = 200;

/** A built page with a level drawn on it. */
export interface LevelPage extends Page, Course {
  /** Art characters that couldn't be drawn; levels should have none. */
  dropped: number;
}

/** Turns an anchor into a page row and column. */
export function resolveAnchor(
  page: Page,
  { section, row = 0, col = 0, from = "left" }: Anchor
): Cell {
  if (section === "slot" || section === "name") {
    const s = page.sections[section];
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
  /** Which frame of the level's animation to draw. */
  frame?: number;
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
  { prev, withFlag = true, frame = 0, reveal }: ApplyLevelOptions = {}
): LevelPage {
  const lines = [...page.lines];
  const grid = [...page.grid];
  const chars: (Cell & { ch: string })[] = [];
  let dropped = 0;

  const isFree = (row: number, col: number) =>
    col >= page.left && col <= page.right && grid[row]?.[col] === " ";

  const draw = (row: number, col: number, text: string) => {
    [...text].forEach((ch, i) => {
      const c = col + i;
      if (ch === " ") return;
      if (isFree(row, c)) chars.push({ row, col: c, ch });
      else dropped++;
    });
  };

  const art: Art[] = [...(level.art || [])];
  if (level.slot) art.unshift({ at: { section: "slot" }, lines: level.slot });
  for (const { at, lines: rows } of art) {
    const origin = resolveAnchor(page, at);
    rows.forEach((line, i) => draw(origin.row + i, origin.col, line));
  }

  if (level.animation) {
    const { at, frames } = level.animation;
    const origin = resolveAnchor(page, at);
    frames[frame % frames.length].forEach((line, i) =>
      [...line].forEach((ch, j) => {
        const col = origin.col + j;
        if (col < page.left || col > page.right) dropped++;
        else chars.push({ row: origin.row + i, col, ch });
      })
    );
  }

  const tee = resolveTee(page, level, prev);
  const cup = resolveAnchor(page, level.cup);
  if (grid[tee.row]?.[tee.col] !== " ") dropped++;
  draw(cup.row, cup.col, "(_)");
  if (withFlag && level.flag !== false) {
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

  const spinning = level.animation?.spin;
  const center = spinning && resolveAnchor(page, spinning.center);
  const spin = center && {
    x: center.col,
    y: center.row,
    rate: (2 * Math.PI * 1000) / (spinning.frames * FRAME_TIME),
  };
  const course = { tee, cup: { ...cup, width: 3 }, spin };
  return { ...page, ...course, lines, grid, dropped };
}
