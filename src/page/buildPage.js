import Header from "../components/Header";
import Footer from "../components/Footer";
import Photo from "../components/Photo";
import BlankLines from "../components/BlankLines";
import Button from "../components/Button";
import Green, { TEE, CUP } from "../components/Green";
import { Helpers, toLines } from "../Helpers";
import { GithubName } from "../ascii/GithubName";
import { GithubCat } from "../ascii/GithubCat";

// Builds the whole page as lines of segments ({ text, href? }).
export function buildPage(sizing, precursor, afterCursor) {
  const helpers = new Helpers(sizing, precursor, afterCursor);
  const width = sizing.width;
  const gap = () => BlankLines({ width, amount: 3, precursor, afterCursor });

  const rows = [
    ...Header({ width, helpers }),
    ...gap(),
    ...Photo({ helpers }),
    ...gap(),
    ...toLines(
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
        Green()
      )
    ),
    ...gap(),
    ...Button({
      helpers,
      lines1: GithubCat,
      url1: "https://github.com/WolffRuoff",
      lines2: GithubName,
      url2: "https://github.com/WolffRuoff",
    }),
    ...gap(),
    ...Footer({ width }),
  ];

  const lines = rows.map((row) =>
    typeof row === "string" ? [{ text: row }] : row
  );
  const grid = lines.map((segments) => segments.map((s) => s.text).join(""));

  const teeRow = grid.findIndex((line) => line.includes(TEE));
  const tee = { row: teeRow, col: grid[teeRow].indexOf(TEE) };
  const cup = {
    row: teeRow,
    col: grid[teeRow].indexOf(CUP, tee.col),
    width: CUP.length,
  };
  lines[teeRow] = lines[teeRow].map((s) => ({
    ...s,
    text: s.text.replace(TEE, " "),
  }));
  grid[teeRow] = grid[teeRow].replace(TEE, " ");

  return { lines, grid, tee, cup, center: Math.floor(width / 2) };
}
