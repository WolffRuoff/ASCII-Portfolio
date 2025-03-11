const BlankLines = ({ width, amount, precursor, afterCursor }) => {
  const numbOfSpaces = width - precursor.length - afterCursor.length;
  const lines = (precursor + " ".repeat(numbOfSpaces) + afterCursor + "\n").repeat(amount).slice(0,-2);
  return <>{lines}</>;
};

export default BlankLines;
