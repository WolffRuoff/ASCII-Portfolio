import { LEVELS } from ".";
import { applyLevel, BLANK_SLOT } from "./apply";
import { buildPage } from "../../page/buildPage";
import { isCup } from "../physics";

// Page widths to check, side by side and stacked (narrow window).
const LAYOUTS = [
  ["side by side, 112 columns", 112, 1024],
  ["side by side, 177 columns", 177, 1600],
  ["stacked", 112, 400],
];

function build(level, width, innerWidth) {
  Object.defineProperty(window, "innerWidth", {
    value: innerWidth,
    configurable: true,
  });
  const sizing = { fontSize: 12, width };
  const base = buildPage(sizing, "  ||", "||  ", level.slot || BLANK_SLOT);
  return applyLevel(base, level);
}

// Whether the cup can be reached from the tee through blank cells.
function cupReachable(page) {
  const seen = new Set();
  const queue = [[page.tee.row, page.tee.col]];
  while (queue.length) {
    const [row, col] = queue.pop();
    if (isCup(page, row, col)) return true;
    const key = `${row},${col}`;
    if (seen.has(key) || page.grid[row]?.[col] !== " ") continue;
    seen.add(key);
    queue.push([row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]);
  }
  return false;
}

describe.each(LEVELS.map((level) => [level.name, level]))("%s", (_, level) => {
  test.each(LAYOUTS)("%s: all art fits on blank cells", (_, width, inner) => {
    expect(build(level, width, inner).dropped).toBe(0);
  });

  test.each(LAYOUTS)("%s: cup is reachable from tee", (_, width, inner) => {
    expect(cupReachable(build(level, width, inner))).toBe(true);
  });
});
