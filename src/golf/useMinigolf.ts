import { useEffect, useMemo, useState } from "react";
import type { PointerEventHandler, RefObject } from "react";
import type { Page } from "../page/buildPage";
import { useTween } from "../hooks/useTween";
import { useBall } from "./useBall";
import { nearCup } from "./physics";
import { LEVELS } from "./levels";
import { applyLevel } from "./levels/apply";
import type { ApplyLevelOptions, LevelPage } from "./levels/apply";

// Level transition timings, in ms.
const SINK_PAUSE = 400;
const SHRINK_TIME = 500;
const GROW_TIME = 700;

type Reveal = NonNullable<ApplyLevelOptions["reveal"]>;

export interface Minigolf {
  /** The page with the current level drawn on it. */
  page: LevelPage;
  /** Where to draw the ball; row is -1 once it's sunk. */
  ball: { row: number; col: number };
  /** Left out while the ball can't be hit. */
  onBallDown?: PointerEventHandler<HTMLElement>;
}

/** Plays the levels in order on `basePage`, moving on after each sink. */
export function useMinigolf(
  basePage: Page,
  preRef: RefObject<HTMLPreElement>
): Minigolf {
  const [levelIndex, setLevelIndex] = useState(0);
  const [flagPulled, setFlagPulled] = useState(false);
  // Set while a level shrinks away or grows in.
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const level = LEVELS[levelIndex];
  const prevLevel = LEVELS[levelIndex - 1];
  const page = useMemo(
    () =>
      applyLevel(basePage, level, {
        prev: prevLevel,
        withFlag: !flagPulled,
        reveal: reveal || undefined,
      }),
    [basePage, level, prevLevel, flagPulled, reveal]
  );
  const ballState = useBall(page, preRef, levelIndex);

  // The flag is out while the ball is close to the cup or in it.
  const { row, col } = ballState;
  const ballNearCup = row >= 0 && nearCup(page, row, col);
  useEffect(() => {
    setFlagPulled(ballNearCup || ballState.sunk);
  }, [ballNearCup, ballState.sunk]);

  // After a sink, shrink the level into its hole, then switch levels.
  const hasNextLevel = levelIndex + 1 < LEVELS.length;
  useTween(ballState.sunk && hasNextLevel ? levelIndex : null, {
    delay: SINK_PAUSE,
    duration: SHRINK_TIME,
    onFrame: (t) => setReveal({ around: "cup", amount: 1 - t }),
    onDone: () => {
      setReveal({ around: "tee", amount: 0 });
      setLevelIndex((i) => i + 1);
      setFlagPulled(false);
    },
  });

  // Grow the new level out from the ball, which sits where the last hole was.
  useTween(levelIndex > 0 ? levelIndex : null, {
    duration: GROW_TIME,
    onFrame: (t) => setReveal({ around: "tee", amount: t }),
    onDone: () => setReveal(null),
  });

  return {
    page,
    ball: { row, col },
    onBallDown: reveal ? undefined : ballState.onPointerDown,
  };
}
