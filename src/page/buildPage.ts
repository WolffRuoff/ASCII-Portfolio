import Header from "../components/Header";
import Footer from "../components/Footer";
import Photo from "../components/Photo";
import BlankLines from "../components/BlankLines";
import Button from "../components/Button";
import { Helpers, joinParts } from "../Helpers";
import type { Sizing } from "../Helpers";
import { GithubName } from "../ascii/GithubName";
import { GithubCat } from "../ascii/GithubCat";

export interface Segment {
  text: string;
  href?: string;
}

export type PageLine = Segment[];

export type SectionName =
  | "header"
  | "photo"
  | "bio"
  | "slot"
  | "buttons"
  | "footer";

export interface Section {
  row: number;
  height: number;
}

export type Sections = Record<Exclude<SectionName, "slot">, Section> & {
  slot: Section & { col: number };
};

export interface Page {
  lines: PageLine[];
  /** Plain text of each line, for looking up cells. */
  grid: string[];
  sections: Sections;
  left: number;
  right: number;
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
  precursor: string,
  afterCursor: string,
  slot: string[]
): Page {
  const helpers = new Helpers(sizing, precursor, afterCursor);
  const width = sizing.width;
  const gap = () => BlankLines({ width, amount: 3, precursor, afterCursor });
  const marked = [SLOT_MARK + slot[0].slice(1), ...slot.slice(1)];

  const rows: (string | PageLine)[] = [];
  const add = (sectionRows: (string | PageLine)[]): Section => {
    const section = { row: rows.length, height: sectionRows.length };
    rows.push(...sectionRows);
    return section;
  };
  const header = add(Header({ width, helpers }));
  add(gap());
  const photo = add(Photo({ helpers }));
  add(gap());
  const bio = add(
    joinParts(
      helpers.AddSpacesForTwo(
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
    Button({
      helpers,
      lines1: GithubCat,
      url1: "https://github.com/WolffRuoff",
      lines2: GithubName,
      url2: "https://github.com/WolffRuoff",
    })
  );
  add(gap());
  const footer = add(Footer({ width }));

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
    left: precursor.length,
    right: width - afterCursor.length - 1,
    center: Math.floor(width / 2),
  };
}
