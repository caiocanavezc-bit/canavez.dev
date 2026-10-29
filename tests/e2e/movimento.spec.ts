import { expect, test } from "@playwright/test";

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("todo o conteúdo aparece", async ({ page }) => {
    await page.goto("/");
    for (const texto of [
      "Sistemas web sob medida",
      "AEB Transporte",
      "Vamos",
    ]) {
      const el = page.getByText(texto).first();
      await expect(el).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const opacidades = await page
      .locator("[data-reveal]")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacidades.length).toBeGreaterThan(0);
    expect(opacidades.every((o) => o === "1")).toBe(true);
  });
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("métrica com valor final e nada escondido", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("+10", { exact: true })).toBeVisible({
      timeout: 300,
    });
    const opacidades = await page
      .locator("[data-reveal]")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacidades.every((o) => o === "1")).toBe(true);
  });
});

test("seções reveladas ao rolar", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contato").scrollIntoViewIfNeeded();
  const reveal = page
    .locator("#contato[data-reveal], #contato [data-reveal]")
    .first();
  await expect(reveal).toHaveAttribute("data-revealed", "");
});

test("hero e cartão não ficam escondidos esperando animação", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#inicio")).not.toHaveAttribute("data-reveal");
  await expect(page.getByTestId("profile-card")).toBeVisible();
});
