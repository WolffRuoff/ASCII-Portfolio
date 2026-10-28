import { useState, useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import Line from "./components/Line";
import { buildPage } from "./page/buildPage";
import { useGolf } from "./golf/useGolf";
import { useTween } from "./hooks/useTween";
import { nearCup } from "./golf/physics";
import { LEVELS } from "./golf/levels";
import { applyLevel, BLANK_SLOT } from "./golf/levels/apply";
import type { ApplyOptions } from "./golf/levels/apply";
import type { Sizing } from "./Helpers";

/** Fallback character width relative to font size, used if measuring fails. */
const CHAR_ASPECT = 1229 / 2048;
const FONT_FAMILY = "'Courier New', Courier, monospace";
const MAX_FONT_SIZE = 12;
const MIN_FONT_SIZE = 1;
// Level transition timings, in ms.
const SINK_PAUSE = 400;
const SHRINK_TIME = 500;
const GROW_TIME = 700;

type Reveal = NonNullable<ApplyOptions["reveal"]>;

/** Excludes the scrollbar, unlike window.innerWidth. */
function viewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

/** Measured with a hidden <pre> so it uses the same font as the page. */
function charWidth(fontSize: number): number {
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

/** Columns that fit across the page at this font size. */
function widthForFont(fontSize: number): number {
  return Math.floor(viewportWidth() / charWidth(fontSize));
}

/** Largest font size at which `requiredColumns` fit. */
function fitSizing(requiredColumns: number): Sizing {
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

  const appStyle: CSSProperties = {
    textAlign: "left",
    margin: 0,
    fontSize: sizing.fontSize + "px",
    fontFamily: FONT_FAMILY,
    wordBreak: "break-all",
    lineHeight: "1.1em",
  };

  const [levelIndex, setLevelIndex] = useState(0);
  const [flagPulled, setFlagPulled] = useState(false);
  // Set while a level shrinks away or grows in.
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const level = LEVELS[levelIndex];
  const prevLevel = LEVELS[levelIndex - 1];
  const basePage = useMemo(
    () => buildPage(sizing, precursor, afterCursor, BLANK_SLOT),
    [sizing, precursor, afterCursor]
  );
  const page = useMemo(
    () =>
      applyLevel(basePage, level, {
        prev: prevLevel,
        withFlag: !flagPulled,
        reveal: reveal || undefined,
      }),
    [basePage, level, prevLevel, flagPulled, reveal]
  );
  const preRef = useRef<HTMLPreElement>(null);
  const golf = useGolf(page, preRef, levelIndex);

  // The flag is out while the ball is close to the cup or in it.
  const ballNearCup = golf.row >= 0 && nearCup(page, golf.row, golf.col);
  useEffect(() => {
    setFlagPulled(ballNearCup || golf.sunk);
  }, [ballNearCup, golf.sunk]);

  // After a sink, shrink the level into its hole, then switch levels.
  const hasNextLevel = levelIndex + 1 < LEVELS.length;
  useTween(golf.sunk && hasNextLevel ? levelIndex : null, {
    delay: SINK_PAUSE,
    duration: SHRINK_TIME,
    onFrame: (t) => setReveal({ around: "cup", amount: 1 - t }),
    onDone: () => {
      setReveal({ around: "tee", amount: 0 });
      setLevelIndex((i) => i + 1);
      setFlagPulled(false);
    },
  });

  // Grow the new level out from the ball, which sits where the last hole was.
  useTween(levelIndex > 0 ? levelIndex : null, {
    duration: GROW_TIME,
    onFrame: (t) => setReveal({ around: "tee", amount: t }),
    onDone: () => setReveal(null),
  });

  return (
    <div style={appStyle}>
      <pre ref={preRef}>
        {page.lines.map((segments, row) => (
          <Line
            key={row}
            segments={segments}
            ballCol={row === golf.row ? golf.col : -1}
            onBallDown={reveal ? undefined : golf.onPointerDown}
            newline={row < page.lines.length - 1}
          />
        ))}
      </pre>
    </div>
  );
}

export default App;
