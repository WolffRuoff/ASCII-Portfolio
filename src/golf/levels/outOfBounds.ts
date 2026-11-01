import type { Level } from "./types";

/** Level 4: the green again, but out the top gap to a cup below it. */
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
  cup: { section: "slot", row: 27, col: 27 },
};

export default outOfBounds;
