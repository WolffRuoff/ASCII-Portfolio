/** Font size and how many characters fit across the page. */
export interface Sizing {
  fontSize: number;
  width: number;
  /** The window is too narrow for blocks side by side. */
  narrow: boolean;
}

/** One laid-out line, split into padding and content pieces. */
export type LineParts = string[];

/** Where a block's top-left landed, from the first laid-out line. */
export interface Placement {
  row: number;
  col: number;
}

/** Two blocks laid out, with where each one landed. */
export interface Placed {
  lines: LineParts[];
  left: Placement;
  right: Placement;
}

/** Pads art to the page width, between the page's left and right borders. */
export class Layout {
  constructor(
    public sizing: Sizing,
    public leftBorder: string,
    public rightBorder: string
  ) {}

  /** Centres each line as [border + padding, line, padding + border]. */
  center(lines: string[]): LineParts[] {
    return lines.map((line) => {
      const leftPad = Math.max(
        0,
        Math.floor(
          (this.sizing.width - 1 - this.leftBorder.length - line.length) / 2
        )
      );
      const before = this.leftBorder + " ".repeat(leftPad);
      const rightPad = Math.max(
        0,
        Math.floor(
          this.sizing.width -
            (before.length + line.length) -
            this.rightBorder.length
        )
      );
      return [before, line, " ".repeat(rightPad) + this.rightBorder];
    });
  }

  /**
   * Places two blocks side by side, or stacks them when the page is narrow.
   * `spacer` adds a blank line between them when stacked.
   */
  sideBySide(left: string[], right: string[], spacer = false): Placed {
    const gapWidth = Math.floor(
      (this.sizing.width -
        1 -
        this.leftBorder.length -
        left[0].length -
        right[0].length) /
        3
    );
    const gap = " ".repeat(Math.max(0, gapWidth));
    const firstLine = this.leftBorder + gap + left[0] + gap + right[0];
    const rightPad = Math.floor(
      this.sizing.width - firstLine.length - this.rightBorder.length
    );
    // Too narrow for two columns.
    if (gapWidth <= 1 || this.sizing.narrow || rightPad <= 0) {
      const top = this.center(spacer ? [...left, " "] : left);
      const bottom = this.center(right);
      return {
        lines: [...top, ...bottom],
        left: { row: 0, col: top[0][0].length },
        right: { row: top.length, col: bottom[0][0].length },
      };
    }

    const [tallLeft, tallRight] = padToSameHeight(left, right);
    const leftCol = this.leftBorder.length + gap.length;
    return {
      lines: tallLeft.lines.map((line, i) => [
        this.leftBorder + gap,
        line,
        gap,
        tallRight.lines[i],
        " ".repeat(rightPad) + this.rightBorder,
      ]),
      left: { row: tallLeft.top, col: leftCol },
      right: {
        row: tallRight.top,
        col: leftCol + left[0].length + gap.length,
      },
    };
  }
}

/** A block padded with blank lines, and how many were added on top. */
interface Padded {
  lines: string[];
  top: number;
}

/** Pads the shorter block with blank lines, alternating bottom and top. */
function padToSameHeight(a: string[], b: string[]): [Padded, Padded] {
  const pad = (block: string[], height: number) => {
    const lines = [...block];
    const blank = " ".repeat(block[0].length);
    let top = 0;
    while (lines.length < height) {
      if (lines.length % 2) lines.push(blank);
      else {
        lines.unshift(blank);
        top++;
      }
    }
    return { lines, top };
  };
  const height = Math.max(a.length, b.length);
  return [pad(a, height), pad(b, height)];
}

/** Joins each line's parts into one string. */
export function joinParts(lines: LineParts[]): string[] {
  return lines.map((parts) => parts.join(""));
}
