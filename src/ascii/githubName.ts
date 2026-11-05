// "Git" and "Hub" in block letters, across and turned on end.
const GIT_ACROSS = [
  " _______ __ __   ",
  "|     __|__|  |_ ",
  "|    |  |  |   _|",
  "|_______|__|____|",
];
const HUB_ACROSS = [
  " _____     __    ",
  "|  |  |-.-|  |--.",
  "|     | | |  _  |",
  "|__|__|___|_____|",
];
const GIT_DOWN = [
  " _____ ",
  "|     |",
  "|     |",
  "|  _  |",
  "|___|_|",
  "|   | |",
  "|___|_|",
  "|    _|",
  "|_|_|  ",
];
const HUB_DOWN = [
  " _____ ",
  "|_   _|",
  "|     |",
  "|_____|",
  "|  _ : ",
  "|_____|",
  "|    _|",
  "|  | : ",
  "|____. ",
];

export type Word = "git" | "hub";

/** Words on the left, top, right and bottom blades; null leaves one off. */
export type Blades = [Word | null, Word | null, Word | null, Word | null];

const ACROSS = { git: GIT_ACROSS, hub: HUB_ACROSS };
const DOWN = { git: GIT_DOWN, hub: HUB_DOWN };
const ARM_WIDTH = Math.max(GIT_ACROSS[0].length, HUB_ACROSS[0].length);
const ARM_HEIGHT = Math.max(GIT_DOWN.length, HUB_DOWN.length);

/** Blade lengths from the hub, in columns (a row counts as two). */
export const BLADE_LENGTH = {
  git: (GIT_ACROSS[0].length + GIT_DOWN.length * 2) / 2,
  hub: (HUB_ACROSS[0].length + HUB_DOWN.length * 2) / 2,
};

/** The blank square the blades turn around, from the art's top-left. */
export const HUB = {
  row: ARM_HEIGHT,
  col: ARM_WIDTH,
  width: GIT_DOWN[0].length,
  height: GIT_ACROSS.length,
};

/** Size of the windmill art, with room for its blades to turn. */
export const WINDMILL = {
  width: ARM_WIDTH * 2 + HUB.width,
  height: ARM_HEIGHT * 2 + HUB.height,
};

/**
 * The GitHub windmill with the given words on its blades. Blank cells inside
 * each blade's box become `fill`.
 */
export function githubWindmill(
  [left, top, right, bottom]: Blades,
  fill = " "
): string[] {
  const grid = Array.from({ length: WINDMILL.height }, () =>
    Array(WINDMILL.width).fill(" ")
  );
  const put = (row: number, col: number, lines: string[]) =>
    lines.forEach((line, i) =>
      [...line].forEach((ch, j) => {
        grid[row + i][col + j] = ch === " " ? fill : ch;
      })
    );
  if (left) put(HUB.row, HUB.col - ACROSS[left][0].length, ACROSS[left]);
  if (right) put(HUB.row, HUB.col + HUB.width, ACROSS[right]);
  if (top) put(HUB.row - DOWN[top].length, HUB.col, DOWN[top]);
  if (bottom) put(HUB.row + HUB.height, HUB.col, DOWN[bottom]);
  return grid.map((row) => row.join(""));
}

/** "GitHub" in one piece, centred where the windmill turns on level 5. */
export const githubName: string[] = (() => {
  const art = githubWindmill([null, null, null, null]);
  // "Git" ends on the wall that starts "Hub".
  const word = GIT_ACROSS.map((line, i) => line.slice(0, -1) + HUB_ACROSS[i]);
  const col = Math.floor((WINDMILL.width - word[0].length) / 2);
  word.forEach((line, i) => {
    const row = art[HUB.row + i];
    art[HUB.row + i] = row.slice(0, col) + line + row.slice(col + line.length);
  });
  return art;
})();
