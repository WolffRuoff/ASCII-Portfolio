import { LEVELS } from ".";
import { applyLevel } from "./apply";
import { BLANK_SLOT, buildPage } from "../../page/buildPage";
import { WINDMILL } from "../../ascii/githubName";
import { isCup } from "../physics";
import type { LevelPage } from "./apply";
import type { Level } from "./types";

/** Page widths to check, side by side and stacked (narrow window). */
const LAYOUTS: [string, number, boolean][] = [
  ["side by side, 138 columns", 138, false],
  ["side by side, 177 columns", 177, false],
  ["stacked", 112, true],
];

function build(
  level: Level,
  prev: Level | undefined,
  width: number,
  narrow: boolean,
  frame = 0
): LevelPage {
  const sizing = { fontSize: 12, width, narrow };
  const base = buildPage(sizing, "  ||", "||  ");
  return applyLevel(base, level, { prev, frame });
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
    const frames = level.animation?.frames.length || 1;
    const reachable = Array.from({ length: frames }, (_, frame) =>
      explore(build(level, prev, width, narrow, frame))
    ).some(({ reachesCup }) => reachesCup);
    expect(reachable).toBe(true);
  });

  test.each(LAYOUTS)("%s: ball can't leave the course", (_, width, narrow) => {
    const page = build(level, prev, width, narrow);
    const slot = page.sections.slot;
    const slotRight = slot.col + BLANK_SLOT[0].length - 1;
    const inSlot = (row: number, col: number) =>
      row >= slot.row &&
      row < slot.row + slot.height &&
      col >= slot.col &&
      col <= slotRight;
    // A cup outside the slot means the ball may roam the page's blank cells.
    const bounds = inSlot(page.cup.row, page.cup.col)
      ? inSlot
      : (row: number, col: number) =>
          row > page.sections.header.row &&
          row < page.sections.footer.row + page.sections.footer.height &&
          col >= page.left &&
          col <= page.right;
    for (const [row, col] of explore(page).cells) {
      expect(bounds(row, col)).toBe(true);
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

test.each(LAYOUTS)(
  "%s: windmill pen is shut while a blade is over it",
  (_, width, narrow) => {
    const index = LEVELS.findIndex((level) => level.name === "Windmill");
    const level = LEVELS[index];
    const frames = level.animation!.frames.length;
    const reaches = Array.from(
      { length: frames },
      (_, frame) =>
        explore(build(level, LEVELS[index - 1], width, narrow, frame))
          .reachesCup
    );
    // Every fourth of the turn a blade points straight down.
    const quarter = frames / 4;
    reaches.forEach((open, frame) => {
      if (frame % quarter === 0) expect(open).toBe(false);
    });
    expect(reaches).toContain(true);
  }
);

test.each(LAYOUTS)(
  "%s: the windmill isn't a link, but the cat still is",
  (_, width, narrow) => {
    const index = LEVELS.findIndex((level) => level.name === "Windmill");
    const page = build(LEVELS[index], LEVELS[index - 1], width, narrow);
    const { row, col, height } = page.sections.name;
    page.lines.slice(row, row + height).forEach((segments) => {
      let start = 0;
      for (const { text, href } of segments) {
        const end = start + text.length;
        if (href)
          expect(end <= col || start >= col + WINDMILL.width).toBe(true);
        start = end;
      }
    });
    expect(page.lines.flat().some((s) => s.href)).toBe(true);
  }
);
