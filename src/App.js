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


// Width of a monospace character relative to the font size (Courier New).
const CHAR_ASPECT = 1229 / 2048;
const MAX_FONT_SIZE = 12;
const MIN_FONT_SIZE = 1;

// Columns available at a given font size for the current window width.
function widthForFont(fontSize) {
  return window.innerWidth / (fontSize * CHAR_ASPECT);
}

// Largest font size (<= MAX) at which `requiredColumns` still fit on screen.
// Clamped to [MIN, MAX], so width is always finite and never overflows.
function fitFontSize(requiredColumns) {
  const ideal = Math.floor(window.innerWidth / (requiredColumns * CHAR_ASPECT));
  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, ideal));
}

function App() {
  const longestLine = 101;
  const precursor = "  ||";
  const afterCursor = "||  ";
  // Widest block that can't wrap (the photo) plus its cursor margins.
  const requiredColumns =
    longestLine + precursor.length + afterCursor.length + 3;

  const [sizing, setSizing] = useState(() => {
    const fontSize = fitFontSize(requiredColumns);
    return { fontSize, width: widthForFont(fontSize) };
  });

  useEffect(() => {
    function handleResize() {
      const fontSize = fitFontSize(requiredColumns);
      setSizing({ fontSize, width: widthForFont(fontSize) });
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
    fontFamily: "'Courier New', Courier, monospace",
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
            "My name is Ethan Ruoff and I am a senior software engineer at   ",
            "Klaviyo. This entire website is responsive and dynamically made ",
            "with ASCII characters. Try resizing and copying the page.       ",
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
