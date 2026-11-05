import { buildPage } from "./buildPage";

const sizing = { fontSize: 12, width: 180, narrow: false };

/** The link on each GitHub art line, from the top of the name section. */
function nameLinks(linkName: boolean): (string | undefined)[] {
  const page = buildPage(sizing, "  ||", "||  ", { linkName });
  const { row, col, height } = page.sections.name;
  return page.lines.slice(row, row + height).map((segments) => {
    let start = 0;
    for (const { text, href } of segments) {
      if (start <= col && col < start + text.length) return href;
      start += text.length;
    }
  });
}

test("links the GitHub name unless asked not to", () => {
  expect(nameLinks(true).every(Boolean)).toBe(true);
  expect(nameLinks(false).some(Boolean)).toBe(false);
});

test("keeps the cat linked either way", () => {
  const page = buildPage(sizing, "  ||", "||  ", { linkName: false });
  expect(page.lines.flat().some((s) => s.href)).toBe(true);
});
