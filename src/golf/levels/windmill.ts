import {
  BLADE_LENGTH,
  HUB,
  WINDMILL,
  githubWindmill,
} from "../../ascii/githubName";
import type { Blades, Word } from "../../ascii/githubName";
import type { Level } from "./types";

/** The words on the left, top, right and bottom blades before turning. */
const WORDS: Word[] = ["git", "git", "hub", "hub"];

/** Frames drawn between each quarter turn. */
const STEPS = 3;

/** Fills the inside of blades: it looks blank but the ball can't pass. */
const SOLID = "\u00a0";

/** How wide a blade is, in columns (a row counts as two). */
const BLADE_WIDTH = (HUB.width + HUB.height * 2) / 2;

/** The words after `quarters` quarter turns clockwise. */
function turned(quarters: number): Blades {
  return WORDS.map((_, i) => WORDS[(i - quarters + 4) % 4]) as Blades;
}

/** Blade outlines turned `degrees` clockwise, for frames between quarters. */
function spinning(degrees: number): string[] {
  const grid = Array.from({ length: WINDMILL.height }, () =>
    Array(WINDMILL.width).fill(" ")
  );
  // Works in columns, with rows counted twice, from the hub's centre.
  const cx = HUB.col + HUB.width / 2;
  const cy = HUB.row * 2 + HUB.height;
  const start = Math.min(HUB.width, HUB.height * 2) / 2;
  WORDS.forEach((word, i) => {
    const angle = ((180 + 90 * i + degrees) * Math.PI) / 180;
    const [ux, uy] = [Math.cos(angle), Math.sin(angle)];
    const end = start + BLADE_LENGTH[word];
    const half = BLADE_WIDTH / 2;
    const corners = [
      [start, -half],
      [end, -half],
      [end, half],
      [start, half],
    ].map(([d, o]) => [cx + d * ux - o * uy, cy + d * uy + o * ux]);
    corners.forEach(([x1, y1], j) => {
      const [x2, y2] = corners[(j + 1) % 4];
      const slope = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      const tilt = (slope + 180) % 180;
      const ch =
        tilt < 22.5 || tilt >= 157.5
          ? "_"
          : tilt < 67.5
            ? "\\"
            : tilt < 112.5
              ? "|"
              : "/";
      // An underscore sits at the bottom of its cell.
      const lift = ch === "_" ? 1 : 0;
      const n = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 4);
      for (let k = 0; k <= n; k++) {
        const col = Math.floor(x1 + ((x2 - x1) * k) / n);
        const row = Math.floor((y1 + ((y2 - y1) * k) / n - lift) / 2);
        if (grid[row]?.[col] !== undefined) grid[row][col] = ch;
      }
    });
    // Fill cells whose centres fall inside the blade.
    grid.forEach((cells, row) =>
      cells.forEach((ch, col) => {
        const dx = col + 0.5 - cx;
        const dy = row * 2 + 1 - cy;
        const along = dx * ux + dy * uy;
        const across = Math.abs(dy * ux - dx * uy);
        const inside = along > start && along < end && across < half;
        if (inside && ch === " ") cells[col] = SOLID;
      })
    );
  });
  return grid.map((row) => row.join(""));
}

/** One full turn: each quarter's words, then outlines on the way round. */
const FRAMES = [0, 1, 2, 3].flatMap((quarter) => [
  githubWindmill(turned(quarter), SOLID),
  ...Array.from({ length: STEPS - 1 }, (_, step) =>
    spinning(90 * quarter + (90 * (step + 1)) / STEPS)
  ),
]);

/** Rows from the windmill's top to just below its longest blade. */
const BELOW = WINDMILL.height;

/**
 * Level 5: the GitHub windmill spins. The pen below it opens under the bottom
 * blade, except while "Hub" is there.
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
