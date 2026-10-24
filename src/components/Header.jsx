import { toLines } from "../Helpers";

const Header = ({ width, helpers }) => {
  const headBarAbsolute = `   ` + "_".repeat(Math.max(0, width - 6));
  return [
    headBarAbsolute,
    "  |" + headBarAbsolute.slice(3) + "|  ",
    ...toLines(
      helpers.AddSpaces(
        [
          `_______ __   __                  ______               ___   ___ `,
          `|    ___|  |_|  |--.---.-.-----. |   __ \\.--.--.-----.'  _|.'  _| `,
          `|    ___|   _|     |  _  |     | |      <|  |  |  _  |   _||   _| `,
          `|_______|____|__|__|___._|__|__| |___|__||_____|_____|__|  |__|   `,
        ]
      )
    ),
  ];
};
export default Header;
