import { expect, test } from "@playwright/test";

test("selo de disponibilidade aparece no topo do hero", async ({ page }) => {
  await page.goto("/");
  const selo = page.getByTestId("selo-disponivel");
  await expect(selo).toHaveText("Disponível para projetos");
  await expect(selo).toBeInViewport();
  // vem antes do título principal
  const antes = await selo.evaluate((el) => {
    const h1 = document.querySelector("h1");
    return (
      !!h1 &&
      !!(el.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING)
    );
  });
  expect(antes).toBe(true);
});

test("capa do cartão de perfil usa o desenho de curvas de nível", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const fundo = await page
    .getByTestId("capa-perfil")
    .evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(fundo).toContain("/perfil/capa.svg");
  const resposta = await request.get("/perfil/capa.svg");
  expect(resposta.status()).toBe(200);
  expect(resposta.headers()["content-type"]).toContain("image/svg+xml");
});

test("granulado do fundo fica atrás do conteúdo e não bloqueia cliques", async ({
  page,
}) => {
  await page.goto("/");
  const grao = page.getByTestId("grao");
  await expect(grao).toHaveCSS("pointer-events", "none");
  await expect(grao).toHaveCSS("position", "fixed");
  await expect(grao).toHaveAttribute("aria-hidden", "true");
  // o elemento sob o centro do botão "Conversar" é o próprio botão, não o granulado
  const botao = page.getByRole("link", { name: "Conversar" });
  const caixa = await botao.boundingBox();
  if (!caixa) throw new Error("botão sem caixa");
  const noPonto = await page.evaluate(
    ([x, y]) =>
      document.elementFromPoint(x, y)?.closest("a")?.textContent ?? "",
    [caixa.x + caixa.width / 2, caixa.y + caixa.height / 2],
  );
  expect(noPonto).toContain("Conversar");
});

test("brilho acompanha o mouse nos cards (só com mouse)", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "sem mouse no celular");
  await page.goto("/");
  const card = page.locator("#servicos [data-brilho]").first();
  await card.scrollIntoViewIfNeeded();
  const caixa = await card.boundingBox();
  if (!caixa) throw new Error("card sem caixa");
  const brilho = () =>
    card.evaluate((el) => {
      const s = getComputedStyle(el, "::before");
      return { fundo: s.backgroundImage, opacidade: s.opacity };
    });
  // antes do mouse: o halo existe, mas está apagado
  expect(await brilho()).toEqual({
    fundo: expect.stringContaining("radial-gradient"),
    opacidade: "0",
  });
  await page.mouse.move(caixa.x + 40, caixa.y + 30);
  await expect
    .poll(() =>
      card.evaluate((el) => (el as HTMLElement).style.getPropertyValue("--mx")),
    )
    .toBe("40px");
  await expect.poll(async () => (await brilho()).opacidade).toBe("1");
});

test.describe("com movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("a bolinha do selo fica parada", async ({ page }) => {
    await page.goto("/");
    const pulso = page.getByTestId("selo-disponivel").locator("[data-pulso]");
    await expect(pulso).toHaveCSS("animation-name", "none");
  });
});

test("sem movimento reduzido a bolinha pulsa", async ({ page }) => {
  await page.goto("/");
  const pulso = page.getByTestId("selo-disponivel").locator("[data-pulso]");
  await expect(pulso).not.toHaveCSS("animation-name", "none");
});
