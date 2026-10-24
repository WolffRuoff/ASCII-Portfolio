import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Photo from "./components/Photo";
import BlankLines from "./components/BlankLines";
import Rocket from "./components/Rocket";
import { Helpers } from "./Helpers";
import Button from "./components/Button";
import { GithubName } from "./ascii/GithubName";
import { GithubCat } from "./ascii/GithubCat";


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

  const helpers = new Helpers(sizing, precursor, afterCursor);

  return (
    <div style={appStyle}>
      <pre>
        <Header width={sizing.width} helpers={helpers} />
        <BlankLines
          width={sizing.width}
          amount={3}
          precursor={precursor}
          afterCursor={afterCursor}
        />
        <br />
        <Photo
          width={sizing.width}
          fontSize={sizing.fontSize}
          helpers={helpers}
        />
        <BlankLines
          width={sizing.width}
          amount={3}
          precursor={precursor}
          afterCursor={afterCursor}
        />
        <br />
        {helpers.AddSpacesForTwo(
          [
            "Hello welcome to my page!                                       ",
            "My name is Ethan Ruoff and I am a Team Lead at Klaviyo. This    ",
            "entire website is responsive and dynamically made with ASCII    ",
            "characters. Try resizing and copying the page.                  ",
            "I hope you enjoy!                                               ",
            "                                                                ",
            "To tell you a bit more about me, I have a Master of Science     ",
            "from Columbia University and a Bachelor of Science in Computer  ",
            "Science and Business Administration from Muhlenberg College. I'm",
            "a third degree Black-Belt in karate and enjoy singing, playing  ",
            "boardgames, coding, and bookbinding in my free time.            ",
          ],
          Rocket()
        )}
        <BlankLines
          width={sizing.width}
          amount={3}
          precursor={precursor}
          afterCursor={afterCursor}
        />
        <br />
        <Button
          helpers={helpers}
          lines1={GithubCat}
          url1="https://github.com/WolffRuoff"
          lines2={GithubName}
          url2="https://github.com/WolffRuoff"
        />
        <BlankLines
          width={sizing.width}
          amount={3}
          precursor={precursor}
          afterCursor={afterCursor}
        />
        <br />
        <Footer width={sizing.width} />
      </pre>
    </div>
  );
}

export default App;
