import { useEffect, useState } from "react";
import type { Sizing } from "../Helpers";

/** Fallback character width relative to font size, used if measuring fails. */
const CHAR_ASPECT = 1229 / 2048;
const MAX_FONT_SIZE = 12;
const MIN_FONT_SIZE = 1;

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

/** Font size and page width that fit `requiredColumns`, updated on resize. */
export function useFitSizing(requiredColumns: number): Sizing {
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

  return sizing;
}
