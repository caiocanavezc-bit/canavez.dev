import { expect, test } from "@playwright/test";

test("html em pt-BR com título do site", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page).toHaveTitle("Caio Canavez · Desenvolvedor full-stack");
});
