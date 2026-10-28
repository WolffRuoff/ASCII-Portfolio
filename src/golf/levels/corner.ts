import type { Level } from "./types";

/** Level 2: the green bent into a right angle, cup top-left. */
const corner: Level = {
  name: "The Corner",
  slot: [
    `  _________________________________________________       `,
    ` /                                                 \\      `,
    `|                                                   \\     `,
    `|                                                    \\    `,
    `|                                                     \\   `,
    `|                                                      \\  `,
    `|                                                       \\ `,
    `|                                                        |`,
    `|                                                        |`,
    ` \\__________________________                             |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                            |                            |`,
    `                             \\__________________________/ `,
  ],
  cup: { section: "slot", row: 5, col: 6 },
};

export default corner;
