import { useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import Line from "./components/Line";
import { buildPage } from "./page/buildPage";
import { useFitSizing } from "./hooks/useFitSizing";
import { useMinigolf } from "./golf/useMinigolf";
import { BLANK_SLOT } from "./golf/levels/apply";

const FONT_FAMILY = "'Courier New', Courier, monospace";

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
    fontFamily: FONT_FAMILY,
    wordBreak: "break-all",
    lineHeight: "1.1em",
  };

  const basePage = useMemo(
    () => buildPage(sizing, leftBorder, rightBorder, BLANK_SLOT),
    [sizing, leftBorder, rightBorder]
  );
  const preRef = useRef<HTMLPreElement>(null);
  const { page, ball, onBallDown } = useMinigolf(basePage, preRef);

  return (
    <div style={appStyle}>
      <pre ref={preRef}>
        {page.lines.map((segments, row) => (
          <Line
            key={row}
            segments={segments}
            ballCol={row === ball.row ? ball.col : -1}
            onBallDown={onBallDown}
            newline={row < page.lines.length - 1}
          />
        ))}
      </pre>
    </div>
  );
}

export default App;
