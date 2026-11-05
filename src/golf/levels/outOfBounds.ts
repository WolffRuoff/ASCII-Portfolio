import { HUB } from "../../ascii/githubName";
import type { Level } from "./types";

/** Level 4: the green again, but out the top gap to a cup by the windmill. */
const outOfBounds: Level = {
  name: "Out of Bounds",
  slot: [
    `                                                          `,
    `                                                          `,
    `    _______________________    _______________________    `,
    `   /                                                  \\   `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `  |                                                    |  `,
    `   \\__________________________________________________/   `,
  ],
  // Right above the windmill, which turns in the next level.
  cup: {
    section: "name",
    row: -1,
    col: HUB.col + Math.floor(HUB.width / 2) - 1,
  },
};

export default outOfBounds;
