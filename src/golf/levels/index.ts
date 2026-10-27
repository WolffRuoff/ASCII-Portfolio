import bumpers from "./bumpers";
import corner from "./corner";
import green from "./green";
import type { Level } from "./types";

// A level is plain data; every field but name and cup is optional.
//
//   name      Shown nowhere yet, but names the level in tests.
//   slot      Art beside the bio, in place of the old rocket. At most 58
//             columns by 25 rows, the rocket's size, so the layout doesn't
//             move between levels.
//   art       [{ at, lines }] drawn anywhere on the page.
//   cup       Where the hole is (its left edge).
//   tee       Where the ball starts. Defaults to the middle of the previous
//             level's cup, so the ball carries on from where it sank. The
//             first level must set one.
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
export const LEVELS: Level[] = [green, corner, bumpers];
