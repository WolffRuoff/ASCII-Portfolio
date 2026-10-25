export const TEE = "\u0001";
export const CUP = "(_)";

// Rocket-sized putting green; the border is a wall like any other character.
// withFlag false pulls the pin, leaving just the cup.
const Green = (withFlag = true) => {
  const flag = withFlag ? "|>" : "  ";
  const pole = withFlag ? "|" : " ";
  return [
    `  ______________________________________________________  `,
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
    `|                                                        |`,
    `|                                                        |`,
    `|                                                  ${flag}    |`,
    `|                                                  ${pole}     |`,
    `|                                                 ${CUP}    |`,
    `|                                                        |`,
    ` \\______________________________________________________/ `,
  ];
};

export default Green;
