import { useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import Line from "./components/Line";
import { buildPage } from "./page/buildPage";
import { useFitSizing } from "./hooks/useFitSizing";
import { useMinigolf } from "./golf/useMinigolf";
import { BLANK_SLOT } from "./golf/levels/apply";

const FONT_FAMILY = "'Courier New', Courier, monospace";

function App() {
  const longestLine = 101;
  const precursor = "  ||";
  const afterCursor = "||  ";
  // Widest block that can't wrap (the photo) plus its cursor margins.
  const requiredColumns =
    longestLine + precursor.length + afterCursor.length + 3;

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
    () => buildPage(sizing, precursor, afterCursor, BLANK_SLOT),
    [sizing, precursor, afterCursor]
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
