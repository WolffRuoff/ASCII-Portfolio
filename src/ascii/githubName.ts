// "Git" and "Hub" in block letters, across and turned on end.
const GIT_ACROSS = [
  " _______ __ __   ",
  "|     __|__|  |_ ",
  "|    |  |  |   _|",
  "|_______|__|____|",
];
const HUB_ACROSS = [
  " _______         __    ",
  "|   |   |.--.--.|  |--.",
  "|       ||  |  ||  _  |",
  "|___|___||_____||_____|",
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
  "|     |",
  "|_   _|",
  "|     |",
  "|_____|",
  " ____. ",
  "|    : ",
  "|  _ . ",
  "|    : ",
  "|____. ",
  " _____ ",
  "|    _|",
  "|  | : ",
  "|____. ",
];

export type Word = "git" | "hub";

/** Words on the left, top, right and bottom blades. */
export type Blades = [Word, Word, Word, Word];

const ACROSS = { git: GIT_ACROSS, hub: HUB_ACROSS };
const DOWN = { git: GIT_DOWN, hub: HUB_DOWN };
const ARM_WIDTH = Math.max(GIT_ACROSS[0].length, HUB_ACROSS[0].length);
const ARM_HEIGHT = Math.max(GIT_DOWN.length, HUB_DOWN.length);

/** The blank square the blades turn around, from the art's top-left. */
export const HUB = {
  row: ARM_HEIGHT,
  col: ARM_WIDTH,
  width: GIT_DOWN[0].length,
  height: GIT_ACROSS.length,
};

/** The GitHub windmill with the given words on its blades. */
export function githubWindmill([left, top, right, bottom]: Blades): string[] {
  const width = ARM_WIDTH * 2 + HUB.width;
  const height = ARM_HEIGHT * 2 + HUB.height;
  const grid = Array.from({ length: height }, () => Array(width).fill(" "));
  const put = (row: number, col: number, lines: string[]) =>
    lines.forEach((line, i) =>
      [...line].forEach((ch, j) => {
        if (ch !== " ") grid[row + i][col + j] = ch;
      })
    );
  put(HUB.row, HUB.col - ACROSS[left][0].length, ACROSS[left]);
  put(HUB.row, HUB.col + HUB.width, ACROSS[right]);
  put(HUB.row - DOWN[top].length, HUB.col, DOWN[top]);
  put(HUB.row + HUB.height, HUB.col, DOWN[bottom]);
  return grid.map((row) => row.join(""));
}

/** "GitHub" as a windmill: "Git" on the left and top, "Hub" right and below. */
export const githubName: string[] = githubWindmill(["git", "git", "hub", "hub"]);
