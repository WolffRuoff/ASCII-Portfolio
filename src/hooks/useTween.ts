import { useEffect, useRef } from "react";

export interface TweenOptions {
  /** Wait before starting, in ms. */
  delay?: number;
  /** Length of the tween, in ms. */
  duration: number;
  /** Called every animation frame with progress from 0 to 1, eased. */
  onFrame: (t: number) => void;
  onDone?: () => void;
}

/** Runs a tween each time `key` changes to something other than null. */
export function useTween(
  key: unknown,
  { delay = 0, duration, onFrame, onDone }: TweenOptions
): void {
  // Latest callbacks, so new closures don't restart the tween.
  const callbacks = useRef({ onFrame, onDone });
  callbacks.current = { onFrame, onDone };

  useEffect(() => {
    if (key === null) return;
    let frame = 0;
    const timer = setTimeout(() => {
      const start = performance.now();
      frame = requestAnimationFrame(function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        callbacks.current.onFrame(t * t * (3 - 2 * t));
        if (t < 1) frame = requestAnimationFrame(tick);
        else callbacks.current.onDone?.();
      });
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [key, delay, duration]);
}
