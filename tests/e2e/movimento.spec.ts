import { expect, test } from "@playwright/test";

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("todo o conteúdo aparece", async ({ page }) => {
    await page.goto("/");
    for (const texto of [
      "Sistemas web sob medida",
      "AEB Transporte",
      "Estagiário de TI",
    ]) {
      await expect(page.getByText(texto).first()).toBeVisible();
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

  test("nada fica escondido esperando animação", async ({ page }) => {
    await page.goto("/");
    const opacidades = await page
      .locator("[data-reveal]")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacidades.every((o) => o === "1")).toBe(true);
  });
});

test("seções reveladas ao rolar", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await expect(page.locator("#contato [data-reveal]").first()).toHaveAttribute(
    "data-revealed",
    "",
  );
});

test("topo e barra lateral não esperam animação", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#sobre [data-reveal]")).toHaveCount(0);
  await expect(page.getByTestId("barra-lateral")).toBeVisible();
});
