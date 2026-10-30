import { LEVELS } from ".";
import { applyLevel } from "./apply";
import { BLANK_SLOT, buildPage } from "../../page/buildPage";
import { isCup } from "../physics";
import type { LevelPage } from "./apply";
import type { Level } from "./types";

/** Page widths to check, side by side and stacked (narrow window). */
const LAYOUTS: [string, number, boolean][] = [
  ["side by side, 112 columns", 112, false],
  ["side by side, 177 columns", 177, false],
  ["stacked", 112, true],
];

function build(
  level: Level,
  prev: Level | undefined,
  width: number,
  narrow: boolean
): LevelPage {
  const sizing = { fontSize: 12, width, narrow };
  const base = buildPage(sizing, "  ||", "||  ");
  return applyLevel(base, level, { prev });
}

/** Cells reachable from the tee, and whether the cup is one of them. */
function explore(page: LevelPage) {
  const seen = new Set<string>();
  let reachesCup = false;
  const queue: [number, number][] = [[page.tee.row, page.tee.col]];
  while (queue.length) {
    const [row, col] = queue.pop()!;
    if (isCup(page, row, col)) {
      reachesCup = true;
      continue;
    }
    const key = `${row},${col}`;
    if (seen.has(key) || page.grid[row]?.[col] !== " ") continue;
    seen.add(key);
    queue.push([row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]);
  }
  const cells = [...seen].map((key) => key.split(",").map(Number));
  return { reachesCup, cells };
}

const CASES = LEVELS.map((level, i): [string, Level, Level | undefined] => [
  level.name,
  level,
  LEVELS[i - 1],
]);

describe.each(CASES)("%s", (_, level, prev) => {
  test("slot fits the blank slot", () => {
    const slot = level.slot || [];
    expect(slot.length).toBeLessThanOrEqual(BLANK_SLOT.length);
    slot.forEach((line) =>
      expect(line.length).toBeLessThanOrEqual(BLANK_SLOT[0].length)
    );
  });

  test.each(LAYOUTS)("%s: all art fits on blank cells", (_, width, narrow) => {
    expect(build(level, prev, width, narrow).dropped).toBe(0);
  });

  test.each(LAYOUTS)("%s: cup is reachable from tee", (_, width, narrow) => {
    expect(explore(build(level, prev, width, narrow)).reachesCup).toBe(true);
  });

  test.each(LAYOUTS)("%s: ball can't leave the course", (_, width, narrow) => {
    const page = build(level, prev, width, narrow);
    const slot = page.sections.slot;
    for (const [row, col] of explore(page).cells) {
      expect(row).toBeGreaterThanOrEqual(slot.row);
      expect(row).toBeLessThan(slot.row + slot.height);
      expect(col).toBeGreaterThanOrEqual(slot.col);
      expect(col).toBeLessThan(slot.col + BLANK_SLOT[0].length);
    }
  });
});

test("each level after the first starts where the last cup was", () => {
  LEVELS.slice(1).forEach((level, i) => {
    const page = build(level, LEVELS[i], 112, false);
    const last = build(LEVELS[i], LEVELS[i - 1], 112, false).cup;
    expect(page.tee).toEqual({ row: last.row, col: last.col + 1 });
  });
});
