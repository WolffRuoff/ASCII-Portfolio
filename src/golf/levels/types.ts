import type { SectionName } from "../../page/buildPage";

/** A spot on the page, relative to one of its sections. */
export interface Anchor {
  /** The section to measure from. */
  section: SectionName;
  /** Rows from the section's top; negative reaches the blank lines above. */
  row?: number;
  /**
   * Columns from the left edge of the slot or GitHub name, or for other
   * sections from `from`.
   */
  col?: number;
  /**
   * For sections other than slot and name: the frame's left edge, page centre
   * or frame's right edge.
   */
  from?: "left" | "center" | "right";
}

/** Lines of art drawn with their top-left at `at`. */
export interface Art {
  at: Anchor;
  lines: string[];
}

/**
 * How an animation's walls move, so they can knock the ball. A spin turns
 * clockwise about `center`, once every `frames` frames.
 */
export type Motion = { kind: "spin"; center: Anchor; frames: number };

/** Art that cycles through frames, each replacing every cell in its box. */
export interface Animation {
  at: Anchor;
  frames: string[][];
  /** How the walls move, for art that pushes the ball. */
  motion?: Motion;
}

/**
 * A level is plain data. Art only draws over blank cells inside the frame,
 * so it can't cover page text, and any non-space character is a wall.
 */
export interface Level {
  /** Names the level in tests. */
  name: string;
  /** Art beside the bio, at most 58 by 25 so the layout never moves. */
  slot?: string[];
  /** More art, drawn anywhere on the page. */
  art?: Art[];
  /** Moving walls, such as a windmill. */
  animation?: Animation;
  /**
   * Where the ball starts. Defaults to the middle of the previous level's cup;
   * the first level must set one.
   */
  tee?: Anchor;
  /** Where the hole is (its left edge). */
  cup: Anchor;
}
