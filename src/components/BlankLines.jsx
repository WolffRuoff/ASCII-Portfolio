const BlankLines = ({ width, amount, precurs, aftercurs }) => {
  const numbOfSpaces = width - precurs.length - aftercurs.length;
  const lines = (precurs + " ".repeat(numbOfSpaces) + aftercurs + "\n").repeat(amount).slice(0,-2);
  return <>{lines}</>;
};

export default BlankLines;
