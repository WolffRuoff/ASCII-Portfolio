import type { Level } from "./types";

/** Level 5: the GitHub "t" spins; slip past it to the cup below the name. */
const windmill: Level = {
  name: "Windmill",
  art: [
    {
      at: { section: "name", row: 4, col: 11 },
      lines: [
        `|       |`,
        `|\\     /|`,
        `|_______|`,
      ],
    },
  ],
  cup: { section: "name", row: 5, col: 14 },
  flag: false,
  animation: {
    at: { section: "name", row: 0, col: 12 },
    frames: [
      [
        `  ___  `,
        `_|   |_`,
        `_     _`,
        ` |   | `,
      ],
      [
        ` \\   / `,
        `  \\_/  `,
        `  / \\  `,
        ` /   \\ `,
      ],
    ],
  },
};

export default windmill;
