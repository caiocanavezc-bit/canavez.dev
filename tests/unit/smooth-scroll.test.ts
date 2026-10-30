import { expect, test } from "vitest";
import { easeInOutCubic } from "@/lib/smooth-scroll";

test("ease-in-out cúbico: começa e termina parado, passa pelo meio na metade", () => {
  expect(easeInOutCubic(0)).toBe(0);
  expect(easeInOutCubic(0.5)).toBe(0.5);
  expect(easeInOutCubic(1)).toBe(1);
});

test("acelera devagar no começo e desacelera no fim (simétrico)", () => {
  expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625, 5);
  expect(easeInOutCubic(0.75)).toBeCloseTo(0.9375, 5);
});
