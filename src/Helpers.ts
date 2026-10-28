export interface Sizing {
  fontSize: number;
  width: number;
}

/** One laid-out line, split into padding and content pieces. */
export type LineParts = string[];

export class Helpers {
  constructor(
    public sizing: Sizing,
    public precursor: string,
    public afterCursor: string
  ) {}

  AddSpaces(lines: string[]): LineParts[] {
    return lines.map((line) => {
      const leftPad = Math.max(
        0,
        Math.floor(
          (this.sizing.width - 1 - this.precursor.length - line.length) / 2
        )
      );
      const newPrecursor = this.precursor + " ".repeat(leftPad);
      const rightPad = Math.max(
        0,
        Math.floor(
          this.sizing.width -
            (newPrecursor.length + line.length) -
            this.afterCursor.length
        )
      );
      return [newPrecursor, line, " ".repeat(rightPad) + this.afterCursor];
    });
  }

  // `spacer` adds a blank line between the columns when they're stacked.
  AddSpacesForTwo(
    lines1: string[],
    lines2: string[],
    spacer = false
  ): LineParts[] {
    // Make sure each lines only has 1 length
    const gapWidth = Math.floor(
      (this.sizing.width -
        1 -
        this.precursor.length -
        lines1[0].length -
        lines2[0].length) /
        3
    );
    const gap = " ".repeat(Math.max(0, gapWidth));
    const header = this.precursor + gap + lines1[0] + gap + lines2[0];
    const afterLength = Math.floor(
      this.sizing.width - header.length - this.afterCursor.length
    );
    // If window is too small default to only 1 column
    if (gapWidth <= 1 || window.innerWidth < 500 || afterLength <= 0) {
      return [
        ...this.AddSpaces(spacer ? [...lines1, " "] : lines1),
        ...this.AddSpaces(lines2),
      ];
    }

    if (lines1.length > lines2.length) {
      const filler = " ".repeat(lines2[0].length);
      while (lines1.length > lines2.length) {
        if (lines2.length % 2) {
          lines2.push(filler);
        } else {
          lines2.unshift(filler);
        }
      }
    } else if (lines1.length < lines2.length) {
      const filler = " ".repeat(lines1[0].length);
      while (lines1.length < lines2.length) {
        if (lines1.length % 2) {
          lines1.push(filler);
        } else {
          lines1.unshift(filler);
        }
      }
    }

    return lines1.map((line, j) => [
      this.precursor + gap,
      line,
      gap,
      lines2[j],
      " ".repeat(afterLength) + this.afterCursor,
    ]);
  }
}

export function joinParts(lines: LineParts[]): string[] {
  return lines.map((parts) => parts.join(""));
}
