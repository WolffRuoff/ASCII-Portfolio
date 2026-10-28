import type { Level } from "./types";

/** Level 3: two rooms with corner bumpers and two bars guarding the cup. */
const bumpers: Level = {
  name: "Bumpers",
  slot: [
    `  __________________________________                      `,
    ` /                              \\   |                     `,
    `|                                \\  |                     `,
    `|                                 \\ |                     `,
    `|                                  \\|                     `,
    `|                                   |                     `,
    `|                                   |                     `,
    `|                                   |                     `,
    `|                                   |                     `,
    ` \\_________________                 |____________________ `,
    `                   |                                 \\   |`,
    `                   |                                  \\  |`,
    `                   |                                   \\ |`,
    `                   |                                    \\|`,
    `                   |                                     |`,
    `                   |                                     |`,
    `                   |     [=======]         [=======]     |`,
    `                   |                                     |`,
    `                   |                                     |`,
    `                   |                                     |`,
    `                   |                                     |`,
    `                   |\\                                   /|`,
    `                   | \\                                 / |`,
    `                   |  \\                               /  |`,
    `                    _____________________________________ `,
  ],
  cup: { section: "slot", row: 20, col: 38 },
};

export default bumpers;
