import { LEVELS, LEVEL_HEIGHT, LEVEL_WIDTH } from ".";
import { reservedCells } from "./render";

// Cells reachable from the tee through whitespace.
function reachable(level) {
  const { art, tee } = level;
  const seen = new Set();
  const queue = [[tee.row, tee.col]];
  while (queue.length) {
    const [row, col] = queue.pop();
    const key = `${row},${col}`;
    if (seen.has(key) || art[row]?.[col] !== " ") continue;
    seen.add(key);
    queue.push([row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]);
  }
  return seen;
}

describe.each(LEVELS.map((level) => [level.name, level]))("%s", (_, level) => {
  test("fills the level block", () => {
    expect(level.art).toHaveLength(LEVEL_HEIGHT);
    for (const line of level.art) expect(line).toHaveLength(LEVEL_WIDTH);
  });

  test("leaves the tee, cup and flag cells blank", () => {
    for (const [row, col] of reservedCells(level)) {
      expect(level.art[row][col]).toBe(" ");
    }
  });

  test("can reach the cup from the tee", () => {
    const { cup } = level;
    const seen = reachable(level);
    expect(seen.has(`${cup.row},${cup.col}`)).toBe(true);
  });
});
