import { expect, type Page, test } from "@playwright/test";
import { abrirNav } from "./helpers";

const fundo = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

const ESCURO = "rgb(19, 21, 20)";
const CLARO = "rgb(244, 245, 242)";

test("escuro por padrão", async ({ page }) => {
  await page.goto("/");
  expect(await fundo(page)).toBe(ESCURO);
});

test.describe("sistema no modo claro", () => {
  test.use({ colorScheme: "light" });

  test("continua escuro", async ({ page }) => {
    await page.goto("/");
    expect(await fundo(page)).toBe(ESCURO);
    await abrirNav(page);
    await expect(
      page.getByRole("button", { name: "mudar para o tema claro" }),
    ).toBeVisible();
  });
});

test("botão troca o tema e a escolha fica salva", async ({ page }) => {
  await page.goto("/");
  await abrirNav(page);
  await page.getByRole("button", { name: "mudar para o tema claro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect.poll(() => fundo(page)).toBe(CLARO);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await abrirNav(page);
  await expect(
    page.getByRole("button", { name: "mudar para o tema escuro" }),
  ).toBeVisible();
});
