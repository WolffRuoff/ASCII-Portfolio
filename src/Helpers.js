function PreNameSpaces(width, lines) {
  const precurse = "  ||";
  const afterCurse = "||  ";
  return lines
    .map((line) => {
      const newWidth = (width - 1 - precurse.length - line.length) / 2;
      if (newWidth <= 0) {
        
      }
      const txt = precurse + " ".repeat(newWidth) + line;
      return (
        txt + " ".repeat(width - txt.length - afterCurse.length) + afterCurse
      );
    })
    .join("\n");
}

export { PreNameSpaces };
