import { Markup } from "interweave";
const Button = ({ helpers, lines1, url1, lines2, url2 }) => {
  let lines;
  if (!lines2) {
    lines = helpers.AddSpaces(lines1, false, false, false);
  } else {
    lines = helpers.AddSpacesForTwo(lines1, lines2, false);
  }
  if (lines[0].length === 3) {
    lines = lines.map((line) => {
      return `${line[0]}<a href=${url1}>${line[1]}</a>${line[2]}`;
    });
  } else {
    lines = lines.map((line) => {
      return `${line[0]}<a href=${url1}>${line[1]}</a>${line[2]}<a href=${url2}>${line[3]}</a>${line[4]}`;
    });
  }
  return (
    <>
      <Markup content={lines.join("\n")} />
    </>
  );
};
export default Button;
