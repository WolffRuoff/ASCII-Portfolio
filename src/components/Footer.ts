const Footer = ({ width }: { width: number }): string[] => {
  const footBar = "_".repeat(Math.max(0, width - 6));
  return ["  |" + footBar + "|  "];
};
export default Footer;
