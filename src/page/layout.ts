/** Font size and how many characters fit across the page. */
export interface Sizing {
  fontSize: number;
  width: number;
}

/** One laid-out line, split into padding and content pieces. */
export type LineParts = string[];

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
  sideBySide(left: string[], right: string[], spacer = false): LineParts[] {
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
    if (gapWidth <= 1 || window.innerWidth < 500 || rightPad <= 0) {
      return [
        ...this.center(spacer ? [...left, " "] : left),
        ...this.center(right),
      ];
    }

    const [tallLeft, tallRight] = padToSameHeight(left, right);
    return tallLeft.map((line, i) => [
      this.leftBorder + gap,
      line,
      gap,
      tallRight[i],
      " ".repeat(rightPad) + this.rightBorder,
    ]);
  }
}

/** Pads the shorter block with blank lines, alternating bottom and top. */
function padToSameHeight(a: string[], b: string[]): [string[], string[]] {
  const pad = (block: string[], height: number) => {
    const padded = [...block];
    const blank = " ".repeat(block[0].length);
    while (padded.length < height) {
      if (padded.length % 2) padded.push(blank);
      else padded.unshift(blank);
    }
    return padded;
  };
  const height = Math.max(a.length, b.length);
  return [pad(a, height), pad(b, height)];
}

/** Joins each line's parts into one string. */
export function joinParts(lines: LineParts[]): string[] {
  return lines.map((parts) => parts.join(""));
}
