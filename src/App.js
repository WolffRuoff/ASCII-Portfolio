import { useState, useEffect } from "react";
import Header from "./components/Header";
import Photo from "./components/Photo";
import BlankLines from "./components/BlankLines";
import Rocket from "./components/Rocket";
import { Helpers } from "./Helpers";
import Button from "./components/Button";
import { GithubName } from "./ascii/GithubName";
import { GithubCat } from "./ascii/GithubCat";


function App() {
  var longestLine = 101;
  const precurse = "  ||";
  const afterCurse = "||  ";

  const [sizing, setSizing] = useState({
    fontSize: 12,
    width: window.innerWidth / (12 * (1229 / 2048)),
  });

  useEffect(() => {
    function handleResize() {
      setSizing({
        fontSize: sizing.fontSize,
        width: window.innerWidth / (sizing.fontSize * (1229 / 2048)),
      });
    }
    window.addEventListener("resize", handleResize);
    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const appStyle = {
    textAlign: "left",
    margin: 0,
    fontSize: sizing.fontSize + "px",
    fontFamily: "'Courier New', Courier, monospace",
    wordBreak: "break-all",
    lineHeight: "1.1em",
  };

  const helpers = new Helpers(
    sizing,
    setSizing,
    longestLine,
    precurse,
    afterCurse
  );

  return (
    <div style={appStyle}>
      <pre>
        <Header width={sizing.width} helpers={helpers} />
        <BlankLines
          width={sizing.width}
          amount={3}
          precurs={precurse}
          aftercurs={afterCurse}
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
          precurs={precurse}
          aftercurs={afterCurse}
        />
        <br />
        {helpers.AddSpacesForTwo(
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
            "boardgames, coding, and bookbinding in my free time.            ",
          ],
          Rocket()
        )}
        <BlankLines
          width={sizing.width}
          amount={3}
          precurs={precurse}
          aftercurs={afterCurse}
        />
        <br />
        <Button
          helpers={helpers}
          lines1={GithubCat}
          url1="https://github.com/WolffRuoff"
          lines2={GithubName}
          url2="https://github.com/WolffRuoff"
        />
      </pre>
    </div>
  );
}

export default App;
