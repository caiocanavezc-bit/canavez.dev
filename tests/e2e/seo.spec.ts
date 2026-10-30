import { expect, test } from "@playwright/test";

test("sitemap lista home e cases", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toMatch(/<loc>[^<]*\/<\/loc>/);
  expect(xml).toContain("/projetos/aeb-transporte</loc>");
  expect(xml).toContain("/projetos/bc-consultoria</loc>");
});

test("robots libera tudo e aponta o sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toContain("Allow: /");
  expect(txt).toMatch(/Sitemap: \S+\/sitemap\.xml/);
});

for (const url of ["/", "/projetos/aeb-transporte"]) {
  test(`imagem de compartilhamento em ${url}`, async ({ page, request }) => {
    await page.goto(url);
    const og = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");
    expect(og).toBeTruthy();
    const resp = await request.get(new URL(og!).pathname);
    expect(resp.status()).toBe(200);
    expect(resp.headers()["content-type"]).toContain("image/png");
  });
}

test("JSON-LD de pessoa na home", async ({ page }) => {
  await page.goto("/");
  const json = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!,
  );
  expect(json["@type"]).toBe("Person");
  expect(json.name).toBe("Caio Canavez");
  // Caio ainda está cursando: não é ex-aluno (alumniOf)
  expect(json.alumniOf).toBeUndefined();
  expect(json.sameAs).toEqual(
    expect.arrayContaining([
      "https://www.linkedin.com/in/caio-canavez-b1427b427",
      "https://github.com/caiocanavezc-bit",
      "https://www.instagram.com/canavezz/",
    ]),
  );
});

test("título do case", async ({ page }) => {
  await page.goto("/projetos/aeb-transporte");
  await expect(page).toHaveTitle("AEB Transporte · Caio Canavez");
});

test("página com canonical", async ({ page }) => {
  await page.goto("/projetos/aeb-transporte");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/projetos\/aeb-transporte$/,
  );
});
