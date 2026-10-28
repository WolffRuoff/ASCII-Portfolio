import type { SectionName } from "../../page/buildPage";

/** A spot on the page, relative to one of its sections. */
export interface Anchor {
  /** The section to measure from. */
  section: SectionName;
  /** Rows from the section's top; negative reaches the blank lines above. */
  row?: number;
  /** Columns from the slot's left edge, or for other sections from `from`. */
  col?: number;
  /**
   * For sections other than slot: the frame's left edge, page centre or frame's
   * right edge.
   */
  from?: "left" | "center" | "right";
}

/** Lines of art drawn with their top-left at `at`. */
export interface Art {
  at: Anchor;
  lines: string[];
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
  /**
   * Where the ball starts. Defaults to the middle of the previous level's cup;
   * the first level must set one.
   */
  tee?: Anchor;
  /** Where the hole is (its left edge). */
  cup: Anchor;
}
