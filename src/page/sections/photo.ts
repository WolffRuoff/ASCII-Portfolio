import { portrait } from "../../ascii/portrait";
import { joinParts } from "../layout";
import type { Layout } from "../layout";

/** The ASCII portrait, centred. */
export function photoLines(layout: Layout): string[] {
  return joinParts(layout.center(portrait));
}
