import type { Layout } from "../layout";
import type { PageLine } from "../buildPage";

/** Lines of art that link to `href`. */
export interface LinkedArt {
  lines: string[];
  href: string;
}

/** One block of linked art centred, or two side by side (stacked if narrow). */
export function linkedArtLines(
  layout: Layout,
  left: LinkedArt,
  right?: LinkedArt
): PageLine[] {
  const parts = right
    ? layout.sideBySide(left.lines, right.lines)
    : layout.center(left.lines);
  return parts.map((line, i) => {
    if (line.length === 3) {
      // Centred or stacked: the left art's lines come first.
      const href = right && i >= left.lines.length ? right.href : left.href;
      return [{ text: line[0] }, { text: line[1], href }, { text: line[2] }];
    }
    return [
      { text: line[0] },
      { text: line[1], href: left.href },
      { text: line[2] },
      { text: line[3], href: right?.href },
      { text: line[4] },
    ];
  });
}
