import "./styles.css";

const Header = ({ width, AddSpaces }) => {
  // const headBarRelative = "-".repeat(100 / (1 * (1229 / 2048)));
  const headBarAbsolute = `   ` + "_".repeat(width - 6);
  // const preNameSpace = " ".repeat((width - 1) * 0.33);
  return (
    <>
      {headBarAbsolute}
      <br />
      {"  |" + headBarAbsolute.slice(3) + "|  "}
      <br />
      {AddSpaces(
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
