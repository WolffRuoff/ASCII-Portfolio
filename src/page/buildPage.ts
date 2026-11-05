import { headerLines } from "./sections/header";
import { footerLines } from "./sections/footer";
import { photoLines } from "./sections/photo";
import { blankLines } from "./sections/blankLines";
import { linkedArtLines } from "./sections/linkedArt";
import { Layout, joinParts } from "./layout";
import type { Sizing } from "./layout";
import { githubCat } from "../ascii/githubCat";
import { githubName } from "../ascii/githubName";

/** A run of text on one line, a link when `href` is set. */
export interface Segment {
  text: string;
  href?: string;
}

/** One line of the page. */
export type PageLine = Segment[];

/** The parts of the page levels can anchor to. */

export type SectionName =
  | "header"
  | "photo"
  | "bio"
  | "slot"
  | "buttons"
  | "footer";

/** Where a section starts and how many lines it takes. */
export interface Section {
  row: number;
  height: number;
}

/** Every section's position; the slot also records its left column. */
export type Sections = Record<Exclude<SectionName, "slot">, Section> & {
  slot: Section & { col: number };
};

/** The laid-out page, with where each part of it is. */
export interface Page {
  lines: PageLine[];
  /** Plain text of each line, for looking up cells. */
  grid: string[];
  sections: Sections;
  /** First column inside the left border. */
  left: number;
  /** Last column inside the right border. */
  right: number;
  /** The page's middle column. */
  center: number;
}

/** The empty space beside the bio, where levels draw their slot art. */
export const BLANK_SLOT: string[] = Array(25).fill(" ".repeat(58));

/**
 * Builds the whole page as lines of segments ({ text, href? }), and where each
 * section starts so levels can anchor to them.
 */
export function buildPage(
  sizing: Sizing,
  leftBorder: string,
  rightBorder: string
): Page {
  const slot = BLANK_SLOT;
  const layout = new Layout(sizing, leftBorder, rightBorder);
  const width = sizing.width;
  const gap = () => blankLines(3, width, leftBorder, rightBorder);

  const rows: (string | PageLine)[] = [];
  const add = (sectionRows: (string | PageLine)[]): Section => {
    const section = { row: rows.length, height: sectionRows.length };
    rows.push(...sectionRows);
    return section;
  };
  const header = add(headerLines(width, layout));
  add(gap());
  const photo = add(photoLines(layout));
  add(gap());
  const bioBlock = layout.sideBySide(
    [
      "Hello welcome to my page!                                       ",
      "My name is Ethan Ruoff and I am a Team Lead at Klaviyo. This    ",
      "entire website is responsive and dynamically made with ASCII    ",
      "characters. Try resizing and copying the page.                  ",
      "I hope you enjoy!                                               ",
      "                                                                ",
      "To tell you a bit more about me, I have a Master of Science     ",
      "from Columbia University and a Bachelor of Science in Computer  ",
      "Science and Business Administration from Muhlenberg College. I'm",
      "a third degree Black-Belt in karate and enjoy singing, playing  ",
      "boardgames, coding, and bookbinding in my free time.            ",
    ],
    slot,
    true
  );
  const bio = add(joinParts(bioBlock.lines));
  add(gap());
  const buttons = add(
    linkedArtLines(
      layout,
      { lines: githubCat, href: "https://github.com/WolffRuoff" },
      { lines: githubName, href: "https://github.com/WolffRuoff" }
    )
  );
  add(gap());
  const footer = add(footerLines(width));

  const lines = rows.map((row): PageLine =>
    typeof row === "string" ? [{ text: row }] : row
  );
  const grid = lines.map((segments) => segments.map((s) => s.text).join(""));

  // The slot's place within the bio, as page coordinates.
  const slotSection = {
    row: bio.row + bioBlock.right.row,
    col: bioBlock.right.col,
    height: slot.length,
  };

  return {
    lines,
    grid,
    sections: {
      header,
      photo,
      bio,
      buttons,
      footer,
      slot: slotSection,
    },
    left: leftBorder.length,
    right: width - rightBorder.length - 1,
    center: Math.floor(width / 2),
  };
}
