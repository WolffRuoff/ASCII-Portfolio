import type { Page, PageLine } from "../../page/buildPage";
import type { Cell, Cup } from "../physics";
import type { Anchor, Level } from "./types";

export interface LevelPage extends Page {
  tee: Cell;
  cup: Cup;
  dropped: number;
}

// Same size as the old rocket, so a level without a slot keeps the layout.
export const BLANK_SLOT: string[] = Array(25).fill(" ".repeat(58));

// Turns an anchor into a page row and column.
export function resolve(
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

// Draws a level's art, cup and flag onto a built page. `dropped` counts
// characters that landed outside the frame or on non-blank cells.
export function applyLevel(
  page: Page,
  level: Level,
  withFlag = true
): LevelPage {
  const lines = [...page.lines];
  const grid = [...page.grid];
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
      setChar(lines, grid, row, c, ch);
    });
  };

  for (const { at, lines: art } of level.art || []) {
    const origin = resolve(page, at);
    art.forEach((line, i) => draw(origin.row + i, origin.col, line));
  }

  const tee = resolve(page, level.tee);
  const cup = resolve(page, level.cup);
  if (grid[tee.row]?.[tee.col] !== " ") dropped++;
  draw(cup.row, cup.col, "(_)");
  if (withFlag) {
    draw(cup.row - 2, cup.col + 1, "|>");
    draw(cup.row - 1, cup.col + 1, "|");
  } else {
    // Without the pole the hole gets its top edge.
    draw(cup.row - 1, cup.col + 1, "_");
  }

  return { ...page, lines, grid, tee, cup: { ...cup, width: 3 }, dropped };
}
