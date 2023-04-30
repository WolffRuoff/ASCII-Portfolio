export class Helpers {
  constructor(sizing, setSizing, longestLine, precurse, afterCurse) {
    this.sizing = sizing;
    this.setSizing = setSizing;
    this.longestLine = longestLine;
    this.precurse = precurse;
    this.afterCurse = afterCurse;
  }

  handleFontSize(change) {
    if (this.sizing.fontSize >= 12 && change > 0) {
      return;
    }
    this.setSizing({
      fontSize: this.sizing.fontSize + change,
      width:
        window.innerWidth / ((this.sizing.fontSize + change) * (1229 / 2048)),
    });
  }

  AddSpaces(lines, handleShrink = false, handleGrow = false) {
    const newLines = [];
    for (var i = 0; i < lines.length; i++) {
      const newWidth =
        (this.sizing.width - 1 - this.precurse.length - lines[i].length) / 2;
      if (handleShrink && newWidth < 0) {
        this.handleFontSize(-1);
        console.log(
          `1Shrinking fontsize from ${this.sizing.fontSize} with ${newWidth}`
        );
        return " ";
      }
      const txt = this.precurse + " ".repeat(newWidth) + lines[i];
      const afterLength =
        this.sizing.width - txt.length - this.afterCurse.length;
      if (handleShrink && afterLength < 0) {
        this.handleFontSize(-1);
        console.log(
          `2Shrinking fontsize from ${this.sizing.fontSize} with ${newWidth}`
        );
        return " ";
      }
      newLines.push(txt + " ".repeat(afterLength) + this.afterCurse);
    }
    if (handleGrow && this.longestLine < this.sizing.width / 2) {
      console.log(this.longestLine);
      this.handleFontSize(1);
    }
    newLines.push("");
    return newLines.join("\n");
  }

  AddSpacesForTwo(lines1, lines2) {
    const newLines = [];
    // Make sure each lines only has 1 length
    const newWidth =
      (this.sizing.width -
        1 -
        this.precurse.length -
        lines1[0].length -
        lines2[0].length) /
      3;
    // If window is two small default to only 1 column
    if (newWidth <= 1 || window.innerWidth < 500) {
      lines1.push(" ");
      return this.AddSpaces(lines1, true).concat(this.AddSpaces(lines2, true));
    }

    const gap = " ".repeat(newWidth);
    const txt = this.precurse + gap + lines1[0] + gap + lines2[0];
    const afterLength = this.sizing.width - txt.length - this.afterCurse.length;
    if (afterLength <= 0) {
      lines1.push(" ");
      return this.AddSpaces(lines1, true).concat(this.AddSpaces(lines2, true));
    }
    newLines.push(txt + " ".repeat(afterLength) + this.afterCurse);

    if (lines1.length > lines2.length) {
      const filler = " ".repeat(lines2[0].length);
      while (lines1.length > lines2.length) {
        console.log("Growing");
        lines2.push(filler);
      }
    } else if (lines1.length < lines2.length) {
      const filler = " ".repeat(lines1[0].length);
      while (lines1.length < lines2.length) {
        lines1.push(filler);
      }
    }

    for (var i = 1; i < lines1.length; i++) {
      const txt = this.precurse + gap + lines1[i] + gap + lines2[i];
      newLines.push(txt + " ".repeat(afterLength) + this.afterCurse);
    }
    newLines.push("");
    return newLines.join("\n");
  }
}
