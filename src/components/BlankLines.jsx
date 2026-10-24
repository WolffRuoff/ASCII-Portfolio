const BlankLines = ({ width, amount, precursor, afterCursor }) => {
  const numbOfSpaces = Math.max(0, width - precursor.length - afterCursor.length);
  return Array(amount).fill(precursor + " ".repeat(numbOfSpaces) + afterCursor);
};

export default BlankLines;
