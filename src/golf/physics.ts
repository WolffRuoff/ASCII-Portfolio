// Speeds are in px/s; positions are in cells (x = column, y = row).
/** Longest drag that still adds power, in px. */
export const MAX_DRAG = 150;
/** Launch speed per px of drag. */
export const POWER = 6;
/** Shorter drags are ignored, in px. */
export const MIN_DRAG = 4;
/** Speed lost per second, as an exponential decay rate. */
export const FRICTION = 1.5;
/** Share of speed kept after hitting a wall. */
export const BOUNCE = 0.8;
/** The ball stops below this speed. */
export const STOP_SPEED = 15;
/** Most cells the ball moves in one collision check. */
const MAX_SUBSTEP = 0.3;
/** Distance from the cup, in columns, at which the flag is pulled. */
export const PIN_RADIUS = 8;

export interface Cell {
  row: number;
  col: number;
}

/** The cup's leftmost cell and how many cells wide it is. */
export interface Cup extends Cell {
  width: number;
}

/** The parts of a level page the physics reads. */
export interface Course {
  /** Plain text of each line; any non-space character is a wall. */
  grid: string[];
  tee: Cell;
  cup: Cup;
  /** The page's middle column, for keeping the ball in place on resize. */
  center: number;
}

export interface Ball {
  /** Position in cells; the integer part is the column. */
  x: number;
  /** Position in cells; the integer part is the row. */
  y: number;
  /** Velocity in px/s. */
  vx: number;
  vy: number;
  sunk: boolean;
  /** Not hit yet on this level. */
  onTee: boolean;
}

/** Size of one character cell, in px. */
export interface Metrics {
  charWidth: number;
  lineHeight: number;
}

/** A ball at rest on the course's tee. */
export function ballOnTee(page: Course): Ball {
  return {
    x: page.tee.col + 0.5,
    y: page.tee.row + 0.5,
    vx: 0,
    vy: 0,
    sunk: false,
    onTee: true,
  };
}

/** Whether a cell is blank, so the ball can roll through it. */
export function isOpen(page: Course, row: number, col: number): boolean {
  return page.grid[row]?.[col] === " ";
}

/**
 * Whether a cell sinks the ball: the cup itself, or the cell above its
 * middle where the hole's top sits.
 */
export function isCup(page: Course, row: number, col: number): boolean {
  const { cup } = page;
  const middle = cup.col + Math.floor(cup.width / 2);
  return (
    (row === cup.row && col >= cup.col && col < cup.col + cup.width) ||
    (row === cup.row - 1 && col === middle)
  );
}

/** Whether the ball can enter a cell. */
function passable(page: Course, row: number, col: number): boolean {
  return isOpen(page, row, col) || isCup(page, row, col);
}

/**
 * Whether a cell is within PIN_RADIUS of the cup. Rows count double since
 * cells are about twice as tall as wide.
 */
export function nearCup(page: Course, row: number, col: number): boolean {
  const { cup } = page;
  const dx = col - (cup.col + (cup.width - 1) / 2);
  const dy = (row - cup.row) * 2;
  return Math.hypot(dx, dy) <= PIN_RADIUS;
}

/** Launch velocity for a drag of (dx, dy) px: opposite the drag, capped. */
export function launchVelocity(
  dx: number,
  dy: number
): Pick<Ball, "vx" | "vy"> {
  const dist = Math.hypot(dx, dy);
  if (dist < MIN_DRAG) return { vx: 0, vy: 0 };
  const scale = (Math.min(dist, MAX_DRAG) / dist) * POWER;
  return { vx: -dx * scale, vy: -dy * scale };
}

/** Whether a cell holds a / or \\, which bounce the ball along their slope. */
function isSlash(page: Course, row: number, col: number): boolean {
  const ch = page.grid[row]?.[col];
  return ch === "/" || ch === "\\";
}

/** Bounces (vx, vy) off a wall with unit normal (nx, ny). */
function reflect(vx: number, vy: number, nx: number, ny: number) {
  const into = vx * nx + vy * ny;
  return [(vx - 2 * into * nx) * BOUNCE, (vy - 2 * into * ny) * BOUNCE];
}

/** Moves the ball `dt` seconds on, bouncing off walls or sinking in the cup. */
export function stepBall(
  ball: Ball,
  page: Course,
  { charWidth, lineHeight }: Metrics,
  dt: number
): Ball {
  let { x, y, vx, vy } = ball;
  const cellsMoved = Math.max(
    Math.abs((vx * dt) / charWidth),
    Math.abs((vy * dt) / lineHeight)
  );
  const subSteps = Math.max(1, Math.ceil(cellsMoved / MAX_SUBSTEP));
  const subDt = dt / subSteps;

  // Unit normal (in px, facing the ball) of a slash the ball is moving into.
  const slashNormalAhead = () => {
    const nextCol = Math.floor(x + (vx * subDt) / charWidth);
    const nextRow = Math.floor(y + (vy * subDt) / lineHeight);
    const cells = [
      [Math.floor(y), nextCol],
      [nextRow, Math.floor(x)],
      [nextRow, nextCol],
    ];
    for (const [row, col] of cells) {
      if (!isSlash(page, row, col)) continue;
      const ch = page.grid[row][col];
      const len = Math.hypot(charWidth, lineHeight);
      let [normX, normY] =
        ch === "/"
          ? [lineHeight / len, charWidth / len]
          : [lineHeight / len, -charWidth / len];
      const side =
        (x - col - 0.5) * charWidth * normX +
        (y - row - 0.5) * lineHeight * normY;
      if (side < 0) [normX, normY] = [-normX, -normY];
      // Only bounce when heading toward the slash's line.
      if (vx * normX + vy * normY < 0) return [normX, normY];
    }
    return null;
  };

  for (let i = 0; i < subSteps; i++) {
    const normal = slashNormalAhead();
    if (normal) {
      [vx, vy] = reflect(vx, vy, normal[0], normal[1]);
      continue;
    }

    // A slash the ball is leaving holds it on that axis instead of bouncing.
    const nextX = x + (vx * subDt) / charWidth;
    const colX = Math.floor(nextX);
    if (passable(page, Math.floor(y), colX)) x = nextX;
    else if (!isSlash(page, Math.floor(y), colX)) vx = -vx * BOUNCE;

    const nextY = y + (vy * subDt) / lineHeight;
    const rowY = Math.floor(nextY);
    if (passable(page, rowY, Math.floor(x))) y = nextY;
    else if (!isSlash(page, rowY, Math.floor(x))) vy = -vy * BOUNCE;

    if (isCup(page, Math.floor(y), Math.floor(x))) {
      return { ...ball, x, y, vx: 0, vy: 0, sunk: true };
    }
  }

  const decay = Math.exp(-FRICTION * dt);
  vx *= decay;
  vy *= decay;
  if (Math.hypot(vx, vy) < STOP_SPEED) {
    vx = 0;
    vy = 0;
  }
  return { ...ball, x, y, vx, vy };
}

/** Nearest blank cell to (row, col), searching outward ring by ring. */
export function nearestOpen(
  page: Course,
  row: number,
  col: number,
  maxRadius = 60
): Cell | null {
  for (let r = 0; r <= maxRadius; r++) {
    for (let dr = -r; dr <= r; dr++) {
      for (let dc = -r; dc <= r; dc++) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== r) continue;
        if (isOpen(page, row + dr, col + dc)) {
          return { row: row + dr, col: col + dc };
        }
      }
    }
  }
  return null;
}

/** Keeps the ball's row and its offset from the page centre across a resize. */
export function remapBall(ball: Ball, from: Course, to: Course): Ball {
  if (ball.sunk) return ball;
  if (ball.onTee) return ballOnTee(to);
  const x = ball.x - from.center + to.center;
  const y = Math.min(ball.y, to.grid.length - 0.5);
  const row = Math.floor(y);
  const col = Math.floor(x);
  if (isOpen(to, row, col)) return { ...ball, x, y };
  const cell = nearestOpen(to, row, col);
  if (!cell) return ballOnTee(to);
  return { ...ball, x: cell.col + 0.5, y: cell.row + 0.5 };
}
