// Speeds are in px/s; positions are in cells (x = column, y = row).
export const MAX_DRAG = 150;
export const POWER = 6;
export const MIN_DRAG = 4;
export const FRICTION = 1.5;
export const BOUNCE = 0.8;
export const STOP_SPEED = 15;
const MAX_SUBSTEP = 0.3;

export function atTee(page) {
  return {
    x: page.tee.col + 0.5,
    y: page.tee.row + 0.5,
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

function passable(page, row, col) {
  return isOpen(page, row, col) || isCup(page, row, col);
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
    if (passable(page, Math.floor(y), Math.floor(nx))) x = nx;
    else vx = -vx * BOUNCE;

    const ny = y + (vy * h) / lh;
    if (passable(page, Math.floor(ny), Math.floor(x))) y = ny;
    else vy = -vy * BOUNCE;

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
export function nearestOpen(page, row, col, maxRadius = 60) {
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
export function remap(ball, from, to) {
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
