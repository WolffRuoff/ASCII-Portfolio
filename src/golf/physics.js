// Speeds are in px/s; positions are in cells. The ball sits on the grid
// corner nearest (x, y) and is drawn as a 2x2 rounded box around it.
export const MAX_DRAG = 150;
export const POWER = 6;
export const MIN_DRAG = 4;
export const FRICTION = 1.5;
export const BOUNCE = 0.8;
export const STOP_SPEED = 15;
const MAX_SUBSTEP = 0.3;

export function atTee(page) {
  return {
    x: page.tee.col + 1,
    y: page.tee.row + 1,
    vx: 0,
    vy: 0,
    sunk: false,
    onTee: true,
  };
}

export function isOpen(page, row, col) {
  return page.grid[row]?.[col] === " ";
}

export function isCup(page, row, col) {
  const { cup } = page;
  return row === cup.row && col >= cup.col && col < cup.col + cup.width;
}

// Cells the ball covers at (x, y), each with the glyph drawn there.
export function ballCells(x, y) {
  const row = Math.round(y);
  const col = Math.round(x);
  return [
    { row: row - 1, col: col - 1, ch: "\u256D" },
    { row: row - 1, col, ch: "\u256E" },
    { row, col: col - 1, ch: "\u2570" },
    { row, col, ch: "\u256F" },
  ];
}

function fits(page, x, y) {
  return ballCells(x, y).every(
    ({ row, col }) => isOpen(page, row, col) || isCup(page, row, col)
  );
}

function inCup(page, x, y) {
  return ballCells(x, y).some(({ row, col }) => isCup(page, row, col));
}

function allOpen(page, x, y) {
  return ballCells(x, y).every(({ row, col }) => isOpen(page, row, col));
}

// Ball goes opposite the drag, capped at MAX_DRAG.
export function launchVelocity(dx, dy) {
  const dist = Math.hypot(dx, dy);
  if (dist < MIN_DRAG) return { vx: 0, vy: 0 };
  const scale = (Math.min(dist, MAX_DRAG) / dist) * POWER;
  return { vx: -dx * scale, vy: -dy * scale };
}

export function step(ball, page, { cw, lh }, dt) {
  let { x, y, vx, vy } = ball;
  const cells = Math.max(Math.abs((vx * dt) / cw), Math.abs((vy * dt) / lh));
  const subSteps = Math.max(1, Math.ceil(cells / MAX_SUBSTEP));
  const h = dt / subSteps;

  for (let i = 0; i < subSteps; i++) {
    const nx = x + (vx * h) / cw;
    if (fits(page, nx, y)) x = nx;
    else vx = -vx * BOUNCE;

    const ny = y + (vy * h) / lh;
    if (fits(page, x, ny)) y = ny;
    else vy = -vy * BOUNCE;

    if (inCup(page, x, y)) {
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

// Nearest grid corner where the ball fits in whitespace, searching outward.
export function nearestOpen(page, row, col, maxRadius = 60) {
  for (let r = 0; r <= maxRadius; r++) {
    for (let dr = -r; dr <= r; dr++) {
      for (let dc = -r; dc <= r; dc++) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== r) continue;
        if (allOpen(page, col + dc, row + dr)) {
          return { row: row + dr, col: col + dc };
        }
      }
    }
  }
  return null;
}

// Keeps the ball's row and its offset from the page centre across a resize.
export function remap(ball, from, to) {
  if (ball.sunk) return ball;
  if (ball.onTee) return atTee(to);
  const x = ball.x - from.center + to.center;
  const y = Math.min(ball.y, to.grid.length - 1);
  if (allOpen(to, x, y)) return { ...ball, x, y };
  const spot = nearestOpen(to, Math.round(y), Math.round(x));
  if (!spot) return atTee(to);
  return { ...ball, x: spot.col, y: spot.row };
}
