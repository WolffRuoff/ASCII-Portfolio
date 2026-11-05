import { HUB, WINDMILL, githubWindmill } from "../../ascii/githubName";
import type { Blades, Word } from "../../ascii/githubName";
import type { Level } from "./types";

/** The words on the left, top, right and bottom blades before turning. */
const WORDS: Word[] = ["git", "git", "hub", "hub"];

/** Frames drawn between each quarter turn. */
const STEPS = 3;

/** Fills the inside of blades: it looks blank but the ball can't pass. */
const SOLID = "\u00a0";

/** The words after `quarters` quarter turns clockwise. */
function turned(quarters: number): Blades {
  return WORDS.map((_, i) => WORDS[(i - quarters + 4) % 4]) as Blades;
}

/** Each letter's first and last column in "Git" and "Hub" across. */
const LETTERS: Record<Word, [number, number][]> = {
  git: [
    [0, 8],
    [8, 11],
    [11, 16],
  ],
  hub: [
    [0, 6],
    [6, 10],
    [10, 16],
  ],
};

/**
 * A quarter's windmill slanted `degrees` clockwise about the hub. Blades are
 * sheared rather than turned so their letters stay readable: side blades
 * step each letter up or down, and the others shift each row sideways.
 */
function tilted(quarters: number, degrees: number): string[] {
  const blades = turned(quarters);
  const art = githubWindmill(blades, SOLID);
  const grid = art.map((row) => Array(row.length).fill(" "));
  const slope = Math.tan((degrees * Math.PI) / 180);
  // Distances from the hub's centre, in columns with rows counted twice.
  const cx = HUB.col + HUB.width / 2;
  const cy = HUB.row * 2 + HUB.height;
  const put = (row: number, col: number, ch: string) => {
    // Fill never covers a letter's wall.
    if (grid[row]?.[col] === undefined) return;
    if (ch !== SOLID || grid[row][col] === " ") grid[row][col] = ch;
  };
  art.forEach((line, row) => {
    if (row >= HUB.row && row < HUB.row + HUB.height) return;
    const shift = Math.round((row * 2 + 1 - cy) * slope);
    [...line].forEach((ch, col) => {
      if (ch !== " ") put(row, col - shift, ch);
    });
  });
  for (const [word, left] of [
    [blades[0], true],
    [blades[2], false],
  ] as const) {
    if (!word) continue;
    const letters = LETTERS[word];
    const length = letters[letters.length - 1][1] + 1;
    const start = left ? HUB.col - length : HUB.col + HUB.width;
    for (const [first, last] of letters) {
      const middle = start + (first + last + 1) / 2;
      const shift = Math.round(((middle - cx) * slope) / 2);
      for (let row = HUB.row; row < HUB.row + HUB.height; row++) {
        for (let col = start + first; col <= start + last; col++) {
          if (art[row][col] !== " ") put(row + shift, col, art[row][col]);
        }
      }
    }
  }
  return grid.map((row) => row.join(""));
}

/** One full turn: each quarter's words, then turned towards the next. */
const FRAMES = [0, 1, 2, 3].flatMap((quarter) => [
  githubWindmill(turned(quarter), SOLID),
  tilted(quarter, 90 / STEPS),
  tilted(quarter + 1, -90 / STEPS),
]);

/** Rows from the windmill's top to just below its bottom blade. */
const BELOW = WINDMILL.height;

/**
 * Level 5: the GitHub windmill spins. The pen below it opens under the bottom
 * blade, so get in while the blades are turning past.
 */
const windmill: Level = {
  name: "Windmill",
  art: [
    {
      at: { section: "name", row: BELOW, col: HUB.col - 8 },
      lines: [
        ` _______      ________ `,
        `|                     |`,
        `|                     |`,
      ],
    },
  ],
  cup: { section: "name", row: BELOW + 2, col: HUB.col + 1 },
  flag: false,
  animation: {
    at: { section: "name" },
    frames: FRAMES,
    spin: {
      center: {
        section: "name",
        row: HUB.row + HUB.height / 2,
        col: HUB.col + HUB.width / 2,
      },
      frames: FRAMES.length,
    },
  },
};

export default windmill;
