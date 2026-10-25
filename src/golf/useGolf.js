import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { atTee, launchVelocity, remap, step } from "./physics";

function measure(pre) {
  const ball = pre.querySelector(".golf-ball");
  return {
    cw: ball ? ball.getBoundingClientRect().width : 7,
    lh: parseFloat(getComputedStyle(pre).lineHeight) || 13,
  };
}

// Drives the ball: drag to aim, release to putt, animate until it stops or sinks.
export function useGolf(page, preRef, levelIndex) {
  const [ball, setBall] = useState(() => atTee(page));
  const ballRef = useRef(ball);
  const pageRef = useRef(page);
  const levelRef = useRef(levelIndex);
  const metricsRef = useRef(null);
  const frameRef = useRef(0);

  const update = useCallback((next) => {
    ballRef.current = next;
    setBall(next);
  }, []);

  // A new level starts on its tee; anything else (resize, flag) keeps the ball.
  useLayoutEffect(() => {
    if (pageRef.current === page) return;
    const newLevel = levelRef.current !== levelIndex;
    update(
      newLevel ? atTee(page) : remap(ballRef.current, pageRef.current, page)
    );
    pageRef.current = page;
    levelRef.current = levelIndex;
    metricsRef.current = null;
  }, [page, levelIndex, update]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const run = useCallback(() => {
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!metricsRef.current) metricsRef.current = measure(preRef.current);
      const next = step(ballRef.current, pageRef.current, metricsRef.current, dt);
      update(next);
      const moving = !next.sunk && (next.vx || next.vy);
      frameRef.current = moving ? requestAnimationFrame(frame) : 0;
    };
    frameRef.current = requestAnimationFrame(frame);
  }, [preRef, update]);

  const onPointerDown = useCallback(
    (e) => {
      const current = ballRef.current;
      if (current.sunk || current.vx || current.vy) return;
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const swallowClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      const onUp = (ev) => {
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        // Stops a release over a link from following it.
        window.addEventListener("click", swallowClick, true);
        setTimeout(() => window.removeEventListener("click", swallowClick, true));
        const v = launchVelocity(ev.clientX - cx, ev.clientY - cy);
        if (!v.vx && !v.vy) return;
        metricsRef.current = measure(preRef.current);
        update({ ...ballRef.current, ...v, onTee: false });
        run();
      };
      const onCancel = () => {
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
      };
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    },
    [preRef, run, update]
  );

  return {
    sunk: ball.sunk,
    row: ball.sunk ? -1 : Math.floor(ball.y),
    col: Math.floor(ball.x),
    onPointerDown,
  };
}
