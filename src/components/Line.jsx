import { Fragment, memo } from "react";

const BALL = "\u25CB";

function wrap(segment, children, key) {
  return segment.href ? (
    <a key={key} href={segment.href}>
      {children}
    </a>
  ) : (
    <span key={key}>{children}</span>
  );
}

// One row of the page; draws the ball over its column when it's on this row.
const Line = memo(({ segments, ballCol, onBallDown, newline }) => {
  let offset = 0;
  const parts = segments.map((segment, i) => {
    const start = offset;
    offset += segment.text.length;
    if (ballCol < start || ballCol >= offset) return wrap(segment, segment.text, i);
    const at = ballCol - start;
    return (
      <Fragment key={i}>
        {wrap(segment, segment.text.slice(0, at))}
        <span className="golf-ball" onPointerDown={onBallDown}>
          {BALL}
        </span>
        {wrap(segment, segment.text.slice(at + 1))}
      </Fragment>
    );
  });
  return (
    <>
      {parts}
      {newline && "\n"}
    </>
  );
});

export default Line;
