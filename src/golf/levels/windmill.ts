import type { Level } from "./types";

/** Level 5: putt through the door of the GitHub "t" while its sails turn. */
const windmill: Level = {
  name: "Windmill",
  cup: { section: "name", row: 3, col: 14 },
  animation: {
    at: { section: "name", row: -2, col: 8 },
    frames: [
      [
        `      |=|      `,
        `      |=|      `,
        ``,
        ``,
        ``,
        ``,
        `      |=|      `,
        `      |=|      `,
      ],
      [
        `\\\\           //`,
        `  \\\\       //  `,
        ``,
        ``,
        ``,
        ``,
        `  //       \\\\  `,
        `//           \\\\`,
      ],
    ],
  },
};

export default windmill;
