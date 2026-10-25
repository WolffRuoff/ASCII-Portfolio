import { useState, useEffect, useMemo, useRef } from "react";
import Line from "./components/Line";
import { buildPage } from "./page/buildPage";
import { useGolf } from "./golf/useGolf";
import { nearCup } from "./golf/physics";

// Fallback character width relative to font size, used if measuring fails.
const CHAR_ASPECT = 1229 / 2048;
const FONT_FAMILY = "'Courier New', Courier, monospace";
const MAX_FONT_SIZE = 12;
const MIN_FONT_SIZE = 1;

// Excludes the scrollbar, unlike window.innerWidth.
function viewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

// Measured with a hidden <pre> so it uses the same font as the page.
function charWidth(fontSize) {
  const probe = document.createElement("pre");
  probe.style.cssText =
    "position:absolute;visibility:hidden;margin:0;" +
    `font-size:${fontSize}px`;
  probe.textContent = "M".repeat(100);
  document.body.appendChild(probe);
  const measured = probe.getBoundingClientRect().width / 100;
  probe.remove();
  return measured || fontSize * CHAR_ASPECT;
}

// Columns that fit across the page at this font size.
function widthForFont(fontSize) {
  return Math.floor(viewportWidth() / charWidth(fontSize));
}

// Largest font size at which `requiredColumns` fit.
function fitSizing(requiredColumns) {
  for (let fontSize = MAX_FONT_SIZE; fontSize > MIN_FONT_SIZE; fontSize--) {
    const width = widthForFont(fontSize);
    if (width >= requiredColumns) return { fontSize, width };
  }
  return { fontSize: MIN_FONT_SIZE, width: widthForFont(MIN_FONT_SIZE) };
}

function App() {
  const longestLine = 101;
  const precursor = "  ||";
  const afterCursor = "||  ";
  // Widest block that can't wrap (the photo) plus its cursor margins.
  const requiredColumns =
    longestLine + precursor.length + afterCursor.length + 3;

  const [sizing, setSizing] = useState(() => fitSizing(requiredColumns));

  useEffect(() => {
    function handleResize() {
      setSizing(fitSizing(requiredColumns));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [requiredColumns]);

  const appStyle = {
    textAlign: "left",
    margin: 0,
    fontSize: sizing.fontSize + "px",
    fontFamily: FONT_FAMILY,
    wordBreak: "break-all",
    lineHeight: "1.1em",
  };

  const [flagPulled, setFlagPulled] = useState(false);
  const page = useMemo(
    () => buildPage(sizing, precursor, afterCursor, !flagPulled),
    [sizing, precursor, afterCursor, flagPulled]
  );
  const preRef = useRef(null);
  const golf = useGolf(page, preRef);

  // Pull the flag once the ball gets close; it stays out after that.
  const ballNearCup = golf.row >= 0 && nearCup(page, golf.row, golf.col);
  useEffect(() => {
    if (ballNearCup) setFlagPulled(true);
  }, [ballNearCup]);

  return (
    <div style={appStyle}>
      <pre ref={preRef}>
        {page.lines.map((segments, row) => (
          <Line
            key={row}
            segments={segments}
            ballCol={row === golf.row ? golf.col : -1}
            onBallDown={golf.onPointerDown}
            newline={row < page.lines.length - 1}
          />
        ))}
      </pre>
    </div>
  );
}

export default App;
