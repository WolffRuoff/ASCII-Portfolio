const Header = ({ width, helpers }) => {
  const headBarAbsolute = `   ` + "_".repeat(width - 6);
  return (
    <>
      {headBarAbsolute}
      <br />
      {"  |" + headBarAbsolute.slice(3) + "|  "}
      <br />
      {helpers.AddSpaces(
        [
          `_______ __   __                  ______               ___   ___ `,
          `|    ___|  |_|  |--.---.-.-----. |   __ \\.--.--.-----.'  _|.'  _| `,
          `|    ___|   _|     |  _  |     | |      <|  |  |  _  |   _||   _| `,
          `|_______|____|__|__|___._|__|__| |___|__||_____|_____|__|  |__|   `,
        ],
        false
      )}
    </>
  );
};
export default Header;
