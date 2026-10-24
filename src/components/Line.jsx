import { memo } from "react";

// One row of the page; segments with an href render as links.
const Line = memo(({ segments, newline }) => (
  <>
    {segments.map((segment, i) =>
      segment.href ? (
        <a key={i} href={segment.href}>
          {segment.text}
        </a>
      ) : (
        <span key={i}>{segment.text}</span>
      )
    )}
    {newline && "\n"}
  </>
));

export default Line;
