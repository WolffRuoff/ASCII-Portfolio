export class Helpers {
  constructor(sizing, precursor, afterCursor) {
    this.sizing = sizing;
    this.precursor = precursor;
    this.afterCursor = afterCursor;
  }

  AddSpaces(lines, combine = true) {
    const newLines = [];
    for (var i = 0; i < lines.length; i++) {
      const leftPad = Math.max(
        0,
        Math.floor(
          (this.sizing.width - 1 - this.precursor.length - lines[i].length) / 2
        )
      );
      const newPrecursor = this.precursor + " ".repeat(leftPad);
      const rightPad = Math.max(
        0,
        Math.floor(
          this.sizing.width -
            (newPrecursor.length + lines[i].length) -
            this.afterCursor.length
        )
      );
      if (combine) {
        newLines.push(
          newPrecursor + lines[i] + " ".repeat(rightPad) + this.afterCursor
        );
      } else {
        newLines.push([
          newPrecursor,
          lines[i],
          " ".repeat(rightPad) + this.afterCursor,
        ]);
      }
    }
    if (combine) newLines.push("");
    return combine ? newLines.join("\n") : newLines;
  }

  AddSpacesForTwo(lines1, lines2, combine = true) {
    const newLines = [];
    // Make sure each lines only has 1 length
    const gapWidth = Math.floor(
      (this.sizing.width -
        1 -
        this.precursor.length -
        lines1[0].length -
        lines2[0].length) /
        3
    );
    // If window is too small default to only 1 column
    if (gapWidth <= 1 || window.innerWidth < 500) {
      if (combine) lines1.push(" ");
      return this.AddSpaces(lines1, combine).concat(
        this.AddSpaces(lines2, combine)
      );
    }
    const gap = " ".repeat(gapWidth);
    const header = this.precursor + gap + lines1[0] + gap + lines2[0];
    const afterLength = Math.floor(
      this.sizing.width - header.length - this.afterCursor.length
    );
    if (afterLength <= 0) {
      if (combine) lines1.push(" ");
      return this.AddSpaces(lines1, combine).concat(
        this.AddSpaces(lines2, combine)
      );
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

    for (var j = 0; j < lines1.length; j++) {
      let txt;
      if (combine) {
        txt =
          this.precursor +
          gap +
          lines1[j] +
          gap +
          lines2[j] +
          " ".repeat(afterLength) +
          this.afterCursor;
      } else {
        txt = [
          this.precursor + gap,
          lines1[j],
          gap,
          lines2[j],
          " ".repeat(afterLength) + this.afterCursor,
        ];
      }
      newLines.push(txt);
    }
    if (combine) newLines.push("");
    return combine ? newLines.join("\n") : newLines;
  }
}

// Splits combined AddSpaces output into lines, dropping the trailing newline.
export function toLines(text) {
  const lines = text.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}
