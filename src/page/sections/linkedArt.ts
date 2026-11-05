import type { Layout, Placement } from "../layout";
import type { PageLine } from "../buildPage";

/** Lines of art that link to `href`, if set. */
export interface LinkedArt {
  lines: string[];
  href?: string;
}

/** Two blocks of linked art side by side (stacked if narrow). */
export function linkedArtLines(
  layout: Layout,
  left: LinkedArt,
  right: LinkedArt
): { lines: PageLine[]; right: Placement } {
  const placed = layout.sideBySide(left.lines, right.lines);
  const lines = placed.lines.map((line, i): PageLine => {
    if (line.length === 3) {
      // Stacked: the left art's lines come first.
      const href = i >= left.lines.length ? right.href : left.href;
      return [{ text: line[0] }, { text: line[1], href }, { text: line[2] }];
    }
    return [
      { text: line[0] },
      { text: line[1], href: left.href },
      { text: line[2] },
      { text: line[3], href: right.href },
      { text: line[4] },
    ];
  });
  return { lines, right: placed.right };
}
