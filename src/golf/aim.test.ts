import { describe, expect, it } from "vitest";
import { aimLine } from "./aim";
import { ballOnTee } from "./physics";
import type { Course } from "./physics";
import { AIM_LENGTH, MAX_DRAG } from "./constants";

const metrics = { charWidth: 10, lineHeight: 20 };

const page: Course = {
  grid: [
    "||||||||||||||||||||||||||||||",
    "|                            |",
    "|                            |",
    "|                            |",
    "|                            |",
    "|                            |",
    "|                    (_)     |",
    "||||||||||||||||||||||||||||||",
  ],
  tee: { row: 3, col: 10 },
  cup: { row: 6, col: 21, width: 3 },
  center: 15,
};
const ball = ballOnTee(page);

describe("aimLine", () => {
  it("is empty for a drag too short to putt", () => {
    expect(aimLine(ball, page, 1, 1, metrics)).toEqual([]);
  });

  it("points opposite the drag", () => {
    const cells = aimLine(ball, page, -MAX_DRAG / 2, 0, metrics);
    expect(cells.length).toBeGreaterThan(0);
    expect(cells.every((c) => c.row === 3 && c.col > 10)).toBe(true);
  });

  it("grows with the drag up to full power", () => {
    const len = (drag: number) => aimLine(ball, page, drag, 0, metrics).length;
    expect(len(40)).toBeLessThan(len(80));
    expect(len(MAX_DRAG)).toBe(len(MAX_DRAG * 2));
    expect(len(MAX_DRAG)).toBeLessThanOrEqual(AIM_LENGTH);
  });

  it("stops at a wall", () => {
    const cells = aimLine(ball, page, 0, MAX_DRAG, metrics);
    expect(cells.map((c) => c.row)).toEqual([2, 1]);
  });


  it("nudges each dot onto the true line", () => {
    const cells = aimLine(ball, page, MAX_DRAG, -MAX_DRAG / 4, metrics);
    expect(cells.some((c) => c.dy !== 0)).toBe(true);
    for (const c of cells) {
      const y = c.row + 0.5 + c.dy;
      const x = c.col + 0.5 + c.dx;
      // Down-left of the ball, on a line with the drag's slope in px.
      expect(((y - ball.y) * 20) / ((x - ball.x) * 10)).toBeCloseTo(-0.25);
      expect(Math.abs(c.dx)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(c.dy)).toBeLessThanOrEqual(0.5);
    }
  });
});
