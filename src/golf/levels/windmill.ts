import { HUB, githubWindmill } from "../../ascii/githubName";
import type { Blades } from "../../ascii/githubName";
import type { Level } from "./types";

/** The words turning clockwise, one blade per frame. */
const TURNS: Blades[] = [
  ["git", "git", "hub", "hub"],
  ["hub", "git", "git", "hub"],
  ["hub", "hub", "git", "git"],
  ["git", "hub", "hub", "git"],
];

/** Rows from the windmill's top to just below its longest blade. */
const BELOW = HUB.row * 2 + HUB.height;

/**
 * Level 5: the GitHub windmill spins. The pen below it opens under the bottom
 * blade, but only while that blade is the shorter "Git".
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
    frames: TURNS.map(githubWindmill),
  },
};

export default windmill;
