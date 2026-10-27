import { atTee, launchVelocity, nearCup, remap, step } from "./physics";
import type { Ball, Course } from "./physics";

const metrics = { cw: 10, lh: 10 };

function makePage(grid: string[], center = 5): Course {
  const row = grid.findIndex((line) => line.includes("T"));
  const tee = { row, col: grid[row].indexOf("T") };
  const cupRow = grid.findIndex((line) => line.includes("(_)"));
  return {
    grid: grid.map((line) => line.replace("T", " ")),
    tee,
    cup: { row: cupRow, col: grid[cupRow].indexOf("(_)"), width: 3 },
    center,
  };
}

function roll(ball: Ball, page: Course, frames = 600): Ball {
  for (let i = 0; i < frames && !ball.sunk && (ball.vx || ball.vy); i++) {
    ball = step(ball, page, metrics, 1 / 60);
  }
  return ball;
}

const page = makePage([
  "##########",
  "#T       #",
  "#        #",
  "#     (_)#",
  "##########",
]);

test("launches opposite the drag, harder for longer drags", () => {
  const short = launchVelocity(20, 0);
  const long = launchVelocity(80, 0);
  expect(short.vx).toBeLessThan(0);
  expect(long.vx).toBeLessThan(short.vx);
  expect(launchVelocity(0, -40).vy).toBeGreaterThan(0);
});

test("caps power and ignores tiny drags", () => {
  expect(launchVelocity(1000, 0).vx).toBeCloseTo(launchVelocity(150, 0).vx);
  expect(launchVelocity(2, 1)).toEqual({ vx: 0, vy: 0 });
});

test("bounces off a wall by flipping only the blocked axis", () => {
  const ball = { ...atTee(page), vx: -300, vy: 0, onTee: false };
  const next = step(ball, page, metrics, 0.1);
  expect(next.vx).toBeGreaterThan(0);
  expect(next.vy).toBe(0);
  expect(page.grid[Math.floor(next.y)][Math.floor(next.x)]).toBe(" ");
});

test("flips both axes in a corner", () => {
  const ball = { ...atTee(page), vx: -300, vy: -300, onTee: false };
  const next = step(ball, page, metrics, 0.1);
  expect(next.vx).toBeGreaterThan(0);
  expect(next.vy).toBeGreaterThan(0);
});

test("never leaves whitespace and friction brings it to rest", () => {
  let ball = { ...atTee(page), vx: 900, vy: 400, onTee: false };
  for (let i = 0; i < 2000 && (ball.vx || ball.vy) && !ball.sunk; i++) {
    ball = step(ball, page, metrics, 1 / 60);
    const ch = page.grid[Math.floor(ball.y)][Math.floor(ball.x)];
    expect(ch === " " || ball.sunk).toBe(true);
  }
  expect(ball.sunk || (ball.vx === 0 && ball.vy === 0)).toBe(true);
});

test("sinks when it reaches the cup", () => {
  const ball = { x: 3.5, y: 3.5, vx: 200, vy: 0, sunk: false, onTee: false };
  expect(roll(ball, page).sunk).toBe(true);
});

test("keeps its offset from the centre on resize", () => {
  const wider = makePage(
    [
      "############",
      "# T        #",
      "#          #",
      "#       (_)#",
      "############",
    ],
    6
  );
  const ball = { x: 4.5, y: 2.5, vx: 0, vy: 0, sunk: false, onTee: false };
  expect(remap(ball, page, wider)).toMatchObject({ x: 5.5, y: 2.5 });
});

test("moves to the nearest space if its cell is filled after resize", () => {
  const blocked = makePage(
    ["##########", "#T       #", "#   #    #", "#     (_)#", "##########"],
    5
  );
  const ball = { x: 4.5, y: 2.5, vx: 0, vy: 0, sunk: false, onTee: false };
  const next = remap(ball, page, blocked);
  expect(blocked.grid[Math.floor(next.y)][Math.floor(next.x)]).toBe(" ");
});

test("stays on the tee or stays sunk across a resize", () => {
  const wider = makePage(["#####", "# T #", "#(_)#", "#####"], 2);
  expect(remap(atTee(page), page, wider)).toEqual(atTee(wider));
  const sunk = { ...atTee(page), sunk: true };
  expect(remap(sunk, page, wider)).toBe(sunk);
});

test("is near the cup within a few cells, counting rows as taller", () => {
  // Cup middle is row 3, column 7.
  expect(nearCup(page, 3, 7)).toBe(true);
  expect(nearCup(page, 3, 0)).toBe(true);
  expect(nearCup(page, 0, 7)).toBe(true);
  expect(nearCup(page, 0, 0)).toBe(false);
});

test("sinks through the top of the hole", () => {
  const pulled = makePage([
    "##########",
    "#T       #",
    "#      _ #",
    "#     (_)#",
    "##########",
  ]);
  let ball = { x: 7.5, y: 1.5, vx: 0, vy: 200, sunk: false, onTee: false };
  for (let i = 0; i < 600 && !ball.sunk && ball.vy; i++) {
    ball = step(ball, pulled, metrics, 1 / 60);
  }
  expect(ball.sunk).toBe(true);
});
