import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  PointerEventHandler,
  RefObject,
} from "react";
import { ballOnTee, launchVelocity, remapBall, stepBall } from "./physics";
import type { Ball, Course, Metrics } from "./physics";

export interface BallState {
  sunk: boolean;
  /** The ball's cell; row is -1 once it's sunk. */
  row: number;
  col: number;
  /** Starts a drag to aim a putt. */
  onPointerDown: PointerEventHandler<HTMLElement>;
}

/** Character width and line height of the page, in px. */
function measureCell(pre: HTMLElement | null): Metrics {
  const ball = pre?.querySelector(".golf-ball");
  return {
    charWidth: ball ? ball.getBoundingClientRect().width : 7,
    lineHeight: (pre && parseFloat(getComputedStyle(pre).lineHeight)) || 13,
  };
}

/** Drag to aim, release to putt, then animate the ball until it stops. */
export function useBall(
  page: Course,
  preRef: RefObject<HTMLPreElement>,
  levelIndex: number
): BallState {
  const [ball, setBall] = useState(() => ballOnTee(page));
  const ballRef = useRef(ball);
  const pageRef = useRef(page);
  const levelRef = useRef(levelIndex);
  const metricsRef = useRef<Metrics | null>(null);
  const frameRef = useRef(0);

  // Updates the ref read by the animation and the state used for rendering.
  const commit = useCallback((next: Ball) => {
    ballRef.current = next;
    setBall(next);
  }, []);

  // A new level starts on its tee; anything else (resize, flag) keeps the ball.
  useLayoutEffect(() => {
    if (pageRef.current === page) return;
    const newLevel = levelRef.current !== levelIndex;
    commit(
      newLevel
        ? ballOnTee(page)
        : remapBall(ballRef.current, pageRef.current, page)
    );
    pageRef.current = page;
    levelRef.current = levelIndex;
    metricsRef.current = null;
  }, [page, levelIndex, commit]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const animate = useCallback(() => {
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!metricsRef.current) metricsRef.current = measureCell(preRef.current);
      const next = stepBall(
        ballRef.current,
        pageRef.current,
        metricsRef.current,
        dt
      );
      commit(next);
      const moving = !next.sunk && (next.vx || next.vy);
      frameRef.current = moving ? requestAnimationFrame(frame) : 0;
    };
    frameRef.current = requestAnimationFrame(frame);
  }, [preRef, commit]);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const current = ballRef.current;
      if (current.sunk || current.vx || current.vy) return;
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const swallowClick = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      const onUp = (ev: PointerEvent) => {
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        // Stops a release over a link from following it.
        window.addEventListener("click", swallowClick, true);
        setTimeout(() => window.removeEventListener("click", swallowClick, true));
        const v = launchVelocity(ev.clientX - cx, ev.clientY - cy);
        if (!v.vx && !v.vy) return;
        metricsRef.current = measureCell(preRef.current);
        commit({ ...ballRef.current, ...v, onTee: false });
        animate();
      };
      const onCancel = () => {
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
      };
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    },
    [preRef, animate, commit]
  );

  return {
    sunk: ball.sunk,
    row: ball.sunk ? -1 : Math.floor(ball.y),
    col: Math.floor(ball.x),
    onPointerDown,
  };
}
