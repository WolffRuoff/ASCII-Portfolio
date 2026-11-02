import type { Layout } from "../layout";
import type { PageLine } from "../buildPage";

/** Lines of art that link to `href`. */
export interface LinkedArt {
  lines: string[];
  href: string;
}

/**
 * One block of linked art centred, or two side by side. When stacked,
 * `spacer` blank lines go between them.
 */
export function linkedArtLines(
  layout: Layout,
  left: LinkedArt,
  right?: LinkedArt,
  spacer = 0
): PageLine[] {
  const parts = right
    ? layout.sideBySide(left.lines, right.lines, spacer)
    : layout.center(left.lines);
  return parts.map((line, i) => {
    if (line.length === 3) {
      // Centred or stacked: the left art, the spacer, then the right art.
      const href =
        i < left.lines.length
          ? left.href
          : i >= left.lines.length + spacer
            ? right?.href
            : undefined;
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
