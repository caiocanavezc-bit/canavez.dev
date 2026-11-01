import { expect, type Page, test } from "@playwright/test";
import { abrirNav } from "./helpers";

const fundo = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test("claro por padrão", async ({ page }) => {
  await page.goto("/");
  expect(await fundo(page)).toBe("rgb(244, 245, 242)");
});

test.describe("sistema no modo escuro", () => {
  test.use({ colorScheme: "dark" });

  test("segue o sistema", async ({ page }) => {
    await page.goto("/");
    expect(await fundo(page)).toBe("rgb(19, 21, 20)");
  });
});

test("botão troca o tema e a escolha fica salva", async ({ page }) => {
  await page.goto("/");
  await abrirNav(page);
  await page.getByRole("button", { name: "mudar para o tema escuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect.poll(() => fundo(page)).toBe("rgb(19, 21, 20)");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await abrirNav(page);
  await expect(
    page.getByRole("button", { name: "mudar para o tema claro" }),
  ).toBeVisible();
});
