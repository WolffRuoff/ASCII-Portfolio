// Speeds are in px/s; positions are in cells (x = column, y = row).
export const MAX_DRAG = 150;
export const POWER = 6;
export const MIN_DRAG = 4;
export const FRICTION = 1.5;
export const BOUNCE = 0.8;
export const STOP_SPEED = 15;
const MAX_SUBSTEP = 0.3;
// Distance from the cup, in columns, at which the flag is pulled.
export const PIN_RADIUS = 8;

export interface Cell {
  row: number;
  col: number;
}

export interface Cup extends Cell {
  width: number;
}

// The parts of a level page the physics reads.
export interface Course {
  grid: string[];
  tee: Cell;
  cup: Cup;
  center: number;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  sunk: boolean;
  onTee: boolean;
}

// Character width and line height, in px.
export interface Metrics {
  cw: number;
  lh: number;
}

export function atTee(page: Course): Ball {
  return {
    x: page.tee.col + 0.5,
    y: page.tee.row + 0.5,
    vx: 0,
    vy: 0,
    sunk: false,
    onTee: true,
  };
}

export function isOpen(page: Course, row: number, col: number): boolean {
  return page.grid[row]?.[col] === " ";
}

// The cup row plus the cell above its middle, where the hole's top sits.
export function isCup(page: Course, row: number, col: number): boolean {
  const { cup } = page;
  const middle = cup.col + Math.floor(cup.width / 2);
  return (
    (row === cup.row && col >= cup.col && col < cup.col + cup.width) ||
    (row === cup.row - 1 && col === middle)
  );
}

function passable(page: Course, row: number, col: number): boolean {
  return isOpen(page, row, col) || isCup(page, row, col);
}

// Rows count about twice as much as columns since cells are tall.
export function nearCup(page: Course, row: number, col: number): boolean {
  const { cup } = page;
  const dx = col - (cup.col + (cup.width - 1) / 2);
  const dy = (row - cup.row) * 2;
  return Math.hypot(dx, dy) <= PIN_RADIUS;
}

// Ball goes opposite the drag, capped at MAX_DRAG.
export function launchVelocity(
  dx: number,
  dy: number
): Pick<Ball, "vx" | "vy"> {
  const dist = Math.hypot(dx, dy);
  if (dist < MIN_DRAG) return { vx: 0, vy: 0 };
  const scale = (Math.min(dist, MAX_DRAG) / dist) * POWER;
  return { vx: -dx * scale, vy: -dy * scale };
}

function isSlash(page: Course, row: number, col: number): boolean {
  const ch = page.grid[row]?.[col];
  return ch === "/" || ch === "\\";
}

// Bounces (vx, vy) off a wall with unit normal (nx, ny).
function reflect(vx: number, vy: number, nx: number, ny: number) {
  const into = vx * nx + vy * ny;
  return [(vx - 2 * into * nx) * BOUNCE, (vy - 2 * into * ny) * BOUNCE];
}

export function step(
  ball: Ball,
  page: Course,
  { cw, lh }: Metrics,
  dt: number
): Ball {
  let { x, y, vx, vy } = ball;
  const cells = Math.max(Math.abs((vx * dt) / cw), Math.abs((vy * dt) / lh));
  const subSteps = Math.max(1, Math.ceil(cells / MAX_SUBSTEP));
  const h = dt / subSteps;

  // Normal (in px, facing the ball) of a slash the ball is moving into.
  const slashAhead = () => {
    const nx = Math.floor(x + (vx * h) / cw);
    const ny = Math.floor(y + (vy * h) / lh);
    const cells = [
      [Math.floor(y), nx],
      [ny, Math.floor(x)],
      [ny, nx],
    ];
    for (const [row, col] of cells) {
      if (!isSlash(page, row, col)) continue;
      const ch = page.grid[row][col];
      const len = Math.hypot(cw, lh);
      let [nX, nY] = ch === "/" ? [lh / len, cw / len] : [lh / len, -cw / len];
      const side =
        (x - col - 0.5) * cw * nX + (y - row - 0.5) * lh * nY;
      if (side < 0) [nX, nY] = [-nX, -nY];
      // Only bounce when heading toward the slash's line.
      if (vx * nX + vy * nY < 0) return [nX, nY];
    }
    return null;
  };

  for (let i = 0; i < subSteps; i++) {
    const normal = slashAhead();
    if (normal) {
      [vx, vy] = reflect(vx, vy, normal[0], normal[1]);
      continue;
    }

    // A slash the ball is leaving holds it on that axis instead of bouncing.
    const nx = x + (vx * h) / cw;
    if (passable(page, Math.floor(y), Math.floor(nx))) x = nx;
    else if (!isSlash(page, Math.floor(y), Math.floor(nx))) vx = -vx * BOUNCE;

    const ny = y + (vy * h) / lh;
    if (passable(page, Math.floor(ny), Math.floor(x))) y = ny;
    else if (!isSlash(page, Math.floor(ny), Math.floor(x))) vy = -vy * BOUNCE;

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

// Nearest whitespace cell, searching outward ring by ring.
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

// Keeps the ball's row and its offset from the page centre across a resize.
export function remap(ball: Ball, from: Course, to: Course): Ball {
  if (ball.sunk) return ball;
  if (ball.onTee) return atTee(to);
  const x = ball.x - from.center + to.center;
  const y = Math.min(ball.y, to.grid.length - 0.5);
  const row = Math.floor(y);
  const col = Math.floor(x);
  if (isOpen(to, row, col)) return { ...ball, x, y };
  const cell = nearestOpen(to, row, col);
  if (!cell) return atTee(to);
  return { ...ball, x: cell.col + 0.5, y: cell.row + 0.5 };
}
