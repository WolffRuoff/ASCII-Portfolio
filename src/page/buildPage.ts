import { headerLines } from "./sections/header";
import { footerLines } from "./sections/footer";
import { photoLines } from "./sections/photo";
import { blankLines } from "./sections/blankLines";
import { linkedArtLines } from "./sections/linkedArt";
import { Layout, joinParts } from "./layout";
import type { Sizing } from "./layout";
import { GithubName } from "../ascii/GithubName";
import { GithubCat } from "../ascii/GithubCat";

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

/** Marks the slot's top-left cell so it can be found after layout. */
const SLOT_MARK = "\u0001";

/**
 * Builds the whole page as lines of segments ({ text, href? }). `slot` is the
 * art shown beside the bio. Also returns where each section starts so levels
 * can anchor to them.
 */
export function buildPage(
  sizing: Sizing,
  leftBorder: string,
  rightBorder: string,
  slot: string[]
): Page {
  const layout = new Layout(sizing, leftBorder, rightBorder);
  const width = sizing.width;
  const gap = () => blankLines(3, width, leftBorder, rightBorder);
  const marked = [SLOT_MARK + slot[0].slice(1), ...slot.slice(1)];

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
  const bio = add(
    joinParts(
      layout.sideBySide(
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
        marked,
        true
      )
    )
  );
  add(gap());
  const buttons = add(
    linkedArtLines(
      layout,
      { lines: GithubCat, href: "https://github.com/WolffRuoff" },
      { lines: GithubName, href: "https://github.com/WolffRuoff" }
    )
  );
  add(gap());
  const footer = add(footerLines(width));

  const lines = rows.map((row): PageLine =>
    typeof row === "string" ? [{ text: row }] : row
  );
  const grid = lines.map((segments) => segments.map((s) => s.text).join(""));

  // Find the slot, then put back the character the mark replaced.
  const slotRow = grid.findIndex((line) => line.includes(SLOT_MARK));
  const slotCol = grid[slotRow].indexOf(SLOT_MARK);
  lines[slotRow] = lines[slotRow].map((s) => ({
    ...s,
    text: s.text.replace(SLOT_MARK, slot[0][0]),
  }));
  grid[slotRow] = grid[slotRow].replace(SLOT_MARK, slot[0][0]);

  return {
    lines,
    grid,
    sections: {
      header,
      photo,
      bio,
      buttons,
      footer,
      slot: { row: slotRow, col: slotCol, height: slot.length },
    },
    left: leftBorder.length,
    right: width - rightBorder.length - 1,
    center: Math.floor(width / 2),
  };
}
