import { expect, test } from "@playwright/test";

// Achados da revisão final: cada teste reproduz um problema real antes da correção.

test("se o JavaScript do site não carregar, nada fica invisível", async ({
  page,
}) => {
  await page.route("**/_next/static/chunks/**/*.js", (r) => r.abort());
  await page.goto("/");
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        page
          .locator("#contato [data-reveal]")
          .evaluateAll((els) =>
            els.map((el) => getComputedStyle(el).opacity).join(","),
          ),
      { timeout: 6000 },
    )
    .toBe("1,1,1");
  await page.locator("#servicos").scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        page
          .locator("#servicos [data-reveal]")
          .evaluateAll((els) =>
            els.map((el) => getComputedStyle(el).opacity).join(","),
          ),
      { timeout: 6000 },
    )
    .toBe("1,1,1");
});

test("contagem não fica presa num número errado depois de voltar", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "mobile",
    "a contagem só roda quando a métrica começa fora da tela",
  );
  await page.goto("/");
  await page.getByText("sistemas entregues").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250); // sai no meio da contagem
  await page.goto("/projetos/aeb-transporte");
  await page.goBack();
  await page.getByText("sistemas entregues").scrollIntoViewIfNeeded();
  await expect(page.getByText("+10", { exact: true })).toBeVisible({
    timeout: 3000,
  });
});

test("no topo da página o Início fica ativo e leva de volta ao topo", async ({
  page,
}) => {
  await page.goto("/");
  const dock = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(dock.getByRole("link", { name: "Início" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await dock.getByRole("link", { name: "Início" }).click();
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 })
    .toBeLessThan(5);
});

test("pular para o conteúdo move o foco", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator("main#conteudo").first()).toBeFocused();
});

test("texto cinza mantém contraste AA com o item da lista em hover", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "hover só com mouse");
  await page.goto("/");
  const item = page.locator("#projetos li").first();
  await item.scrollIntoViewIfNeeded();
  await item.locator("a").hover();
  await page.waitForTimeout(300);
  const razao = await item.evaluate((li) => {
    const lum = (rgb: string) => {
      const [r, g, b] = rgb
        .match(/\d+/g)!
        .slice(0, 3)
        .map(Number)
        .map((c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const fundo = getComputedStyle(li.querySelector("a")!).backgroundColor;
    const textos = [...li.querySelectorAll("a span span")].map(
      (s) => getComputedStyle(s).color,
    );
    return Math.min(
      ...textos
        .map((t) => (lum(t) + 0.05) / (lum(fundo) + 0.05))
        .map((x) => (x < 1 ? 1 / x : x)),
    );
  });
  expect(razao).toBeGreaterThanOrEqual(4.5);
});
