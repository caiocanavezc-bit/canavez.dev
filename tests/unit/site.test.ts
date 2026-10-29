import { expect, test } from "vitest";
import { siteUrl } from "@/lib/site";

test("usa NEXT_PUBLIC_SITE_URL sem barra final", () => {
  expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://canavez.dev/" })).toBe(
    "https://canavez.dev",
  );
});

test("cai para o domínio de produção da Vercel", () => {
  expect(
    siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "canavez-dev.vercel.app" }),
  ).toBe("https://canavez-dev.vercel.app");
});

test("sem variáveis, usa localhost", () => {
  expect(siteUrl({})).toBe("http://localhost:3000");
});
