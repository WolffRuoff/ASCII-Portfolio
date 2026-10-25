// Markers buildPage looks for to place the ball and the cup on the page.
export const TEE = "\u0001";
export const CUP = "\u0002";

// Cells drawn over a level's art for the cup and flag, as [row, col].
export function reservedCells({ tee, cup }) {
  return [
    [tee.row, tee.col],
    [cup.row, cup.col],
    [cup.row, cup.col + 1],
    [cup.row, cup.col + 2],
    [cup.row - 1, cup.col + 1],
    [cup.row - 2, cup.col + 1],
    [cup.row - 2, cup.col + 2],
  ];
}

// A level's art with the tee, the cup and (unless pulled) the flag drawn in.
export function renderLevel(level, withFlag = true) {
  const rows = [...level.art];
  const put = (row, col, text) => {
    const line = rows[row];
    rows[row] = line.slice(0, col) + text + line.slice(col + text.length);
  };
  const { tee, cup } = level;
  put(tee.row, tee.col, TEE);
  put(cup.row, cup.col, CUP + "_)");
  if (withFlag) {
    put(cup.row - 2, cup.col + 1, "|>");
    put(cup.row - 1, cup.col + 1, "|");
  } else {
    // Without the pole the hole gets its top edge.
    put(cup.row - 1, cup.col + 1, "_");
  }
  return rows;
}
