export const TEE = "\u0001";
export const CUP = "(_)";

// Rocket-sized putting green; the border is a wall like any other character.
const Green = () => [
  `     .----------------------------------------------.     `,
  `  .-'                                                '-.  `,
  ` /                                                      \\ `,
  `|   ${TEE}                                                    |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                        |`,
  `|                                                  |>    |`,
  `|                                                  |     |`,
  `|                                                 ${CUP}    |`,
  ` \\                                                      / `,
  `  '-.                                                .-'  `,
  `     '----------------------------------------------'     `,
];

export default Green;
