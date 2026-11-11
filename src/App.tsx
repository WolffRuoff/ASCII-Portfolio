import { useCallback, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import Line from "./components/Line";
import { buildPage } from "./page/buildPage";
import type { BuildOptions } from "./page/buildPage";
import { useFitSizing } from "./hooks/useFitSizing";
import { useMinigolf } from "./golf/useMinigolf";
import type { AimCell } from "./golf/aim";

const NO_AIM: AimCell[] = [];

function App() {
  const photoWidth = 101;
  const leftBorder = "  ||";
  const rightBorder = "||  ";
  // Widest block that can't wrap (the photo) plus the borders.
  const requiredColumns =
    photoWidth + leftBorder.length + rightBorder.length + 3;

  const sizing = useFitSizing(requiredColumns);

  const appStyle: CSSProperties = {
    textAlign: "left",
    margin: 0,
    fontSize: sizing.fontSize + "px",
    wordBreak: "break-all",
    lineHeight: "1.1em",
  };

  const buildBase = useCallback(
    (options: BuildOptions) =>
      buildPage(sizing, leftBorder, rightBorder, options),
    [sizing, leftBorder, rightBorder]
  );
  const preRef = useRef<HTMLPreElement>(null);
  const { page, ball, aim, onBallDown } = useMinigolf(buildBase, preRef);
  // The aim line's cells, grouped by row so untouched rows keep their props.
  const aimByRow = useMemo(() => {
    const rows = new Map<number, AimCell[]>();
    for (const cell of aim) rows.set(cell.row, [...(rows.get(cell.row) || []), cell]);
    return rows;
  }, [aim]);

  return (
    <div style={appStyle}>
      <pre ref={preRef}>
        {page.lines.map((segments, row) => (
          <Line
            key={row}
            segments={segments}
            ballCol={row === ball.row ? ball.col : -1}
            aim={aimByRow.get(row) || NO_AIM}
            onBallDown={onBallDown}
            newline={row < page.lines.length - 1}
          />
        ))}
      </pre>
    </div>
  );
}

export default App;
