import { Fragment, memo } from "react";

function wrap(segment, children, key) {
  return segment.href ? (
    <a key={key} href={segment.href}>
      {children}
    </a>
  ) : (
    <span key={key}>{children}</span>
  );
}

// One row of the page; draws ballText over the cells starting at ballCol.
const Line = memo(({ segments, ballCol, ballText, onBallDown, newline }) => {
  const ballEnd = ballCol + ballText.length;
  let offset = 0;
  const parts = segments.map((segment, i) => {
    const start = offset;
    offset += segment.text.length;
    const from = Math.max(ballCol, start);
    const to = Math.min(ballEnd, offset);
    if (ballCol < 0 || from >= to) return wrap(segment, segment.text, i);
    return (
      <Fragment key={i}>
        {wrap(segment, segment.text.slice(0, from - start))}
        {[...ballText.slice(from - ballCol, to - ballCol)].map((ch, j) => (
          <span key={j} className="golf-ball" onPointerDown={onBallDown}>
            {ch}
          </span>
        ))}
        {wrap(segment, segment.text.slice(to - start))}
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
