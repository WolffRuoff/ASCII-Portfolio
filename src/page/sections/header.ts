import { joinParts } from "../layout";
import type { Layout } from "../layout";

/** The page's top border and the name banner. */
export function headerLines(width: number, layout: Layout): string[] {
  const bar = "_".repeat(Math.max(0, width - 6));
  return [
    "   " + bar,
    "  |" + bar + "|  ",
    ...joinParts(
      layout.center(
        [
          `_______ __   __                  ______               ___   ___ `,
          `|    ___|  |_|  |--.---.-.-----. |   __ \\.--.--.-----.'  _|.'  _| `,
          `|    ___|   _|     |  _  |     | |      <|  |  |  _  |   _||   _| `,
          `|_______|____|__|__|___._|__|__| |___|__||_____|_____|__|  |__|   `,
        ]
      )
    ),
  ];
}
