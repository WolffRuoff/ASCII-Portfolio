import type { Helpers, LineParts } from "../Helpers";
import type { PageLine } from "../page/buildPage";

interface ButtonProps {
  helpers: Helpers;
  lines1: string[];
  url1: string;
  lines2?: string[];
  url2?: string;
}

const Button = ({
  helpers,
  lines1,
  url1,
  lines2,
  url2,
}: ButtonProps): PageLine[] => {
  let lines: LineParts[];
  if (!lines2) {
    lines = helpers.AddSpaces(lines1, false);
  } else {
    lines = helpers.AddSpacesForTwo(lines1, lines2, false);
  }
  if (lines[0].length === 3) {
    return lines.map((line) => [
      { text: line[0] },
      { text: line[1], href: url1 },
      { text: line[2] },
    ]);
  }
  return lines.map((line) => [
    { text: line[0] },
    { text: line[1], href: url1 },
    { text: line[2] },
    { text: line[3], href: url2 },
    { text: line[4] },
  ]);
};
export default Button;
