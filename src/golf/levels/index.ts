import green from "./green";
import type { Level } from "./types";

// A level is plain data; every field but name, tee and cup is optional.
//
//   name      Shown nowhere yet, but names the level in tests.
//   slot      Art beside the bio, in place of the old rocket. Defaults to
//             blank space the same size, so the layout doesn't move.
//   art       [{ at, lines }] drawn anywhere on the page.
//   tee, cup  Where the ball starts and where the hole is.
//
// Positions ("at", tee, cup) are anchors: { section, row, col, from }.
//   section   header, photo, bio, slot, buttons or footer. row counts from
//             the section's first line and can be negative to reach the
//             blank lines above it.
//   col       For slot, counts from the slot's left edge. Otherwise counts
//             from the frame's left edge, or from the page centre or the
//             frame's right edge when from is "center" or "right".
//
// Art only draws over blank cells inside the frame, so it can't cover page
// text. Any non-space character is a wall.

// Play order. To add a level, write its file and list it here.
export const LEVELS: Level[] = [green];
