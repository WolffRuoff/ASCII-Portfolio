import { joinParts } from "../Helpers";
import type { Helpers } from "../Helpers";

interface HeaderProps {
  width: number;
  helpers: Helpers;
}

const Header = ({ width, helpers }: HeaderProps): string[] => {
  const headBarAbsolute = `   ` + "_".repeat(Math.max(0, width - 6));
  return [
    headBarAbsolute,
    "  |" + headBarAbsolute.slice(3) + "|  ",
    ...joinParts(
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
