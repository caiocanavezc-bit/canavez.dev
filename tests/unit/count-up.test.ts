import { expect, test } from "vitest";
import { countUpValue } from "@/lib/count-up";

test("começa em zero e termina no alvo", () => {
  expect(countUpValue(0, 10)).toBe(0);
  expect(countUpValue(1, 10)).toBe(10);
});

test("ease-out cúbico: na metade do tempo já está em 87,5%", () => {
  expect(countUpValue(0.5, 10)).toBe(9);
});

test("nunca passa do alvo", () => {
  for (let p = 0; p <= 1; p += 0.05) expect(countUpValue(p, 10)).toBeLessThanOrEqual(10);
  expect(countUpValue(1.4, 10)).toBe(10);
});
