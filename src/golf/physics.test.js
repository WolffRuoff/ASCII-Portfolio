import { atTee, ballCells, launchVelocity, remap, step } from "./physics";

const metrics = { cw: 10, lh: 10 };

function makePage(grid, center = 6) {
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

// What's under each cell the ball covers.
function cells(page, ball) {
  return ballCells(ball.x, ball.y).map(({ row, col }) => page.grid[row][col]);
}

const page = makePage([
  "############",
  "#T         #",
  "#          #",
  "#          #",
  "#          #",
  "#      (_) #",
  "#          #",
  "############",
]);

test("starts covering the tee cell and the three cells right and below", () => {
  const { x, y } = atTee(page);
  expect(ballCells(x, y).map(({ row, col }) => [row, col])).toEqual([
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 2],
  ]);
});

test("draws a rounded box on the nearest corner", () => {
  const glyphs = (x, y) => ballCells(x, y).map(({ ch }) => ch).join("");
  expect(glyphs(2, 2)).toBe("\u256D\u256E\u2570\u256F");
  expect(ballCells(2.4, 1.6)).toEqual(ballCells(2, 2));
});

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
  expect(cells(page, next).every((c) => c === " ")).toBe(true);
});

test("flips both axes in a corner", () => {
  const ball = { ...atTee(page), vx: -300, vy: -300, onTee: false };
  const next = step(ball, page, metrics, 0.1);
  expect(next.vx).toBeGreaterThan(0);
  expect(next.vy).toBeGreaterThan(0);
});

test("every covered cell stays in whitespace and friction brings it to rest", () => {
  let ball = { ...atTee(page), vx: 900, vy: 200, onTee: false };
  for (let i = 0; i < 2000 && (ball.vx || ball.vy) && !ball.sunk; i++) {
    ball = step(ball, page, metrics, 1 / 60);
    if (!ball.sunk) {
      expect(cells(page, ball).every((c) => c === " ")).toBe(true);
    }
  }
  expect(ball.sunk || (ball.vx === 0 && ball.vy === 0)).toBe(true);
});

test("sinks when any of its cells reaches the cup", () => {
  let ball = { x: 3, y: 6, vx: 200, vy: 0, sunk: false, onTee: false };
  for (let i = 0; i < 600 && !ball.sunk && ball.vx; i++) {
    ball = step(ball, page, metrics, 1 / 60);
  }
  expect(ball.sunk).toBe(true);
});

test("keeps its offset from the centre on resize", () => {
  const wider = makePage(
    [
      "##############",
      "# T          #",
      "#            #",
      "#            #",
      "#            #",
      "#        (_) #",
      "#            #",
      "##############",
    ],
    7
  );
  const ball = { x: 5, y: 3, vx: 0, vy: 0, sunk: false, onTee: false };
  expect(remap(ball, page, wider)).toMatchObject({ x: 6, y: 3 });
});

test("moves to the nearest open spot if its cells are filled after resize", () => {
  const blocked = makePage(
    [
      "############",
      "#T         #",
      "#          #",
      "#    #     #",
      "#          #",
      "#      (_) #",
      "#          #",
      "############",
    ],
    6
  );
  const ball = { x: 5, y: 3, vx: 0, vy: 0, sunk: false, onTee: false };
  const next = remap(ball, page, blocked);
  expect(cells(blocked, next).every((c) => c === " ")).toBe(true);
});

test("stays on the tee or stays sunk across a resize", () => {
  const wider = makePage(["######", "# T  #", "#    #", "#(_) #", "######"], 3);
  expect(remap(atTee(page), page, wider)).toEqual(atTee(wider));
  const sunk = { ...atTee(page), sunk: true };
  expect(remap(sunk, page, wider)).toBe(sunk);
});
