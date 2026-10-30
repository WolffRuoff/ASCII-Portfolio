import { nameBanner } from "../../ascii/nameBanner";
import { joinParts } from "../layout";
import type { Layout } from "../layout";

/** The page's top border and the name banner. */
export function headerLines(width: number, layout: Layout): string[] {
  const bar = "_".repeat(Math.max(0, width - 6));
  return [
    "   " + bar,
    "  |" + bar + "|  ",
    ...joinParts(layout.center(nameBanner)),
  ];
}
