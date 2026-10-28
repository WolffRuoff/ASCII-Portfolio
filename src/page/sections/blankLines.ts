/** `count` empty lines between the page's borders. */
export function blankLines(
  count: number,
  width: number,
  leftBorder: string,
  rightBorder: string
): string[] {
  const inner = Math.max(0, width - leftBorder.length - rightBorder.length);
  return Array(count).fill(leftBorder + " ".repeat(inner) + rightBorder);
}
