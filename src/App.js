import "./App.css";
import { useState, useEffect } from "react";
import Header from "./components/header";
import Photo from "./components/photo";
import BlankLines from "./components/BlankLines";

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

  function AddSpacesForTwo(lines1, lines2, handleSizeChange = false) {
    const newLines = [];
    // Make the two sections have equal lines
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

    for (var i = 0; i < lines1.length; i++) {
      const newWidth =
        (width - 1 - precurse.length - lines1[i].length - lines2[i].length) / 3;
      if (handleSizeChange && newWidth <= 0) {
        handleFontSize(-1);
        return "";
      }
      const gap = " ".repeat(newWidth);
      const txt = precurse + gap + lines1[i] + gap + lines2[i];
      const afterLength = width - txt.length - afterCurse.length;
      if (handleSizeChange && afterLength <= 0) {
        handleFontSize(-1);
        return "";
      }
      newLines.push(txt + " ".repeat(afterLength) + afterCurse);
      if (lines1[i].length + lines2[i].length > longestLine) {
        longestLine = lines1[i].length + lines2[i].length;
      }
    }
    if (handleSizeChange && longestLine < width / 2) {
      handleFontSize(1);
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
          ],
          ["goodbye"]
        )}
      </pre>
    </div>
  );
}

export default App;
