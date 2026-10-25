import Header from "../components/Header";
import Footer from "../components/Footer";
import Photo from "../components/Photo";
import BlankLines from "../components/BlankLines";
import Button from "../components/Button";
import { Helpers, toLines } from "../Helpers";
import { GithubName } from "../ascii/GithubName";
import { GithubCat } from "../ascii/GithubCat";

// Marks the slot's top-left cell so it can be found after layout.
const SLOT_MARK = "\u0001";

// Builds the whole page as lines of segments ({ text, href? }). `slot` is the
// art shown beside the bio. Also returns where each section starts so levels
// can anchor to them.
export function buildPage(sizing, precursor, afterCursor, slot) {
  const helpers = new Helpers(sizing, precursor, afterCursor);
  const width = sizing.width;
  const gap = () => BlankLines({ width, amount: 3, precursor, afterCursor });
  const marked = [SLOT_MARK + slot[0].slice(1), ...slot.slice(1)];

  const rows = [];
  const sections = {};
  const add = (name, sectionRows) => {
    if (name) sections[name] = { row: rows.length, height: sectionRows.length };
    rows.push(...sectionRows);
  };
  add("header", Header({ width, helpers }));
  add(null, gap());
  add("photo", Photo({ helpers }));
  add(null, gap());
  add(
    "bio",
    toLines(
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
        marked
      )
    )
  );
  add(null, gap());
  add(
    "buttons",
    Button({
      helpers,
      lines1: GithubCat,
      url1: "https://github.com/WolffRuoff",
      lines2: GithubName,
      url2: "https://github.com/WolffRuoff",
    })
  );
  add(null, gap());
  add("footer", Footer({ width }));

  const lines = rows.map((row) =>
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
  sections.slot = { row: slotRow, col: slotCol, height: slot.length };

  return {
    lines,
    grid,
    sections,
    left: precursor.length,
    right: width - afterCursor.length - 1,
    center: Math.floor(width / 2),
  };
}
