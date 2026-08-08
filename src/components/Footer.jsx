const Footer = ({ width }) => {
  const footBar = "_".repeat(width - 6);
  return (
    <>
      {"  |" + footBar + "|  "}
    </>
  );
};
export default Footer;
