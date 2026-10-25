interface BlankLinesProps {
  width: number;
  amount: number;
  precursor: string;
  afterCursor: string;
}

const BlankLines = ({
  width,
  amount,
  precursor,
  afterCursor,
}: BlankLinesProps): string[] => {
  const numbOfSpaces = Math.max(0, width - precursor.length - afterCursor.length);
  return Array(amount).fill(precursor + " ".repeat(numbOfSpaces) + afterCursor);
};

export default BlankLines;
