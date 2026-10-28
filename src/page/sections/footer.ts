/** The page's bottom border. */
export function footerLines(width: number): string[] {
  const bar = "_".repeat(Math.max(0, width - 6));
  return ["  |" + bar + "|  "];
}
