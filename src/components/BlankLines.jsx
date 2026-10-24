const BlankLines = ({ width, amount, precursor, afterCursor }) => {
  const numbOfSpaces = Math.max(0, width - precursor.length - afterCursor.length);
  const lines = (precursor + " ".repeat(numbOfSpaces) + afterCursor + "\n").repeat(amount).slice(0, -1);
  return <>{lines}</>;
};

export default BlankLines;
