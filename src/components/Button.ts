import type { Helpers } from "../Helpers";
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
  const lines = lines2
    ? helpers.AddSpacesForTwo(lines1, lines2)
    : helpers.AddSpaces(lines1);
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
