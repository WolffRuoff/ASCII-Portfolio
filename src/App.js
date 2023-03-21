import { useState, useEffect } from "react";
import Header from "./components/header";
import Photo from "./components/photo";
import BlankLines from "./components/BlankLines";
import Rocket from "./components/Rocket";

function App() {
  var longestLine = 0;
  const precurse = "  ||";
  const afterCurse = "||  ";

  const [fontSize, setFontSize] = useState(12);
  const [width, setWidth] = useState(
    window.innerWidth / (fontSize * (1229 / 2048))
  );
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth / (fontSize * (1229 / 2048)));
    }
    window.addEventListener("resize", handleResize);
    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const appStyle = {
    textAlign: "left",
    margin: 0,
    fontSize: fontSize + "px",
    fontFamily: "'Courier New', Courier, monospace",
    wordBreak: "break-all",
    lineHeight: "1.1em",
  };

  function handleFontSize(change) {
    if (fontSize >= 12 && change > 0) {
      return;
    }
    setFontSize((c) => c + change);
    setWidth(window.innerWidth / (fontSize * (1229 / 2048)));
  }
  function AddSpaces(lines, handleSizeChange = false) {
    const newLines = [];
    for (var i = 0; i < lines.length; i++) {
      const newWidth = (width - 1 - precurse.length - lines[i].length) / 2;
      if (handleSizeChange && newWidth <= 0) {
        handleFontSize(-1);
        console.log("yay");
        return " ";
      }
      const txt = precurse + " ".repeat(newWidth) + lines[i];
      const afterLength = width - txt.length - afterCurse.length;
      if (handleSizeChange && afterLength <= 0) {
        handleFontSize(-1);
        console.log("yay");
        return " ";
      }
      newLines.push(txt + " ".repeat(afterLength) + afterCurse);
      if (lines[i].length > longestLine) {
        longestLine = lines[i].length;
      }
    }
    if (handleSizeChange && longestLine < width / 2) {
      handleFontSize(1);
    }
    return newLines.join("\n");
  }

  function AddSpacesForTwo(lines1, lines2) {
    const newLines = [];
    // Make sure each lines only has 1 length
    const newWidth =
      (width - 1 - precurse.length - lines1[0].length - lines2[0].length) / 3;
    if (newWidth <= 0) {
      lines1.push(" ");
      return [AddSpaces(lines1),(AddSpaces(lines2))].join("\n");
    }
    const gap = " ".repeat(newWidth);
    const txt = precurse + gap + lines1[0] + gap + lines2[0];
    const afterLength = width - txt.length - afterCurse.length;
    if (afterLength <= 0) {
      lines1.push(" ");
      return [AddSpaces(lines1),AddSpaces(lines2)].join("\n");
    }
    newLines.push(txt + " ".repeat(afterLength) + afterCurse);

    if (lines1.length > lines2.length) {
      const filler = " ".repeat(lines2[0].length);
      while (lines1.length > lines2.length) {
        console.log("Growing");
        lines2.push(filler);
      }
    } else if (lines1.length < lines2.length) {
      const filler = " ".repeat(lines1[0].length);
      while (lines1.length < lines2.length) {
        lines1.push(filler);
      }
    }

    for (var i = 1; i < lines1.length; i++) {
      const txt = precurse + gap + lines1[i] + gap + lines2[i];
      newLines.push(txt + " ".repeat(afterLength) + afterCurse);
    }
    return newLines.join("\n");
  }

  return (
    <div style={appStyle}>
      <pre>
        <Header width={width} fontSize={fontSize} AddSpaces={AddSpaces} />
        <BlankLines
          width={width}
          amount={3}
          precurs={precurse}
          aftercurs={afterCurse}
        />
        <br />
        <Photo width={width} fontSize={fontSize} AddSpaces={AddSpaces} />
        <BlankLines
          width={width}
          amount={3}
          precurs={precurse}
          aftercurs={afterCurse}
        />
        <br />
        {AddSpacesForTwo(
          [
            "Hello welcome to my page!                                       ",
            "My name is Ethan Ruoff and I am a software engineer at Dow Jones",
            "This entire website is responsive and dynamically made with     ",
            "ASCII characters. Try resizing and copying the page. I hope you ",
            "enjoy!                                                          ",
            "                                                                ",
            "To tell you a bit more about me, I have of Master of Science    ",
            "from Columbia University and a Bachelor of Science in Computer  ",
            "Science and Business Administration from Muhlenberg College. I'm",
            "a third degree Black-Belt in karate and enjoy singing, playing  ",
            "boardgames, coding, and bookbinding in my free time.            "
          ],
          Rocket()
        )}
      </pre>
    </div>
  );
}

export default App;
