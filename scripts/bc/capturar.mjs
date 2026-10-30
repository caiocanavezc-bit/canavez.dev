// Captura os prints do site da Bergamo & Canavez a partir de uma cópia local.
// Antes: gh repo clone caiocanavezc-bit/bc_consultoria "$TEMP/bc-capturas" -- --depth 1
//        cd "$TEMP/bc-capturas" && python -m http.server 8766
// Uso: node scripts/bc/capturar.mjs
import { chromium } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const BASE = process.env.BC_URL ?? "http://localhost:8766";
const DESTINO = "public/projetos/bc-consultoria";
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "bc-prints-"));
fs.mkdirSync(DESTINO, { recursive: true });

// Rola a página inteira para disparar as animações .reveal e volta ao topo.
async function prepararPagina(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < altura; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

const browser = await chromium.launch();
try {
  const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await prepararPagina(desk);
  const capa = path.join(TMP, "capa.png");
  await desk.screenshot({ path: capa });
  await sharp(capa).resize(1600, 1000, { fit: "cover", position: "top" }).webp({ quality: 82 }).toFile(path.join(DESTINO, "capa.webp"));
  await sharp(capa).resize(640, 400, { fit: "cover", position: "top" }).webp({ quality: 82 }).toFile(path.join(DESTINO, "thumb.webp"));

  // Alinha o título da seção logo abaixo do menu fixo (~100px)
  await desk.getByRole("heading", { name: "Soluções jurídicas para diferentes necessidades." }).evaluate((el) =>
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150),
  );
  await desk.waitForTimeout(600);
  const servicos = path.join(TMP, "servicos.png");
  await desk.screenshot({ path: servicos });
  await sharp(servicos).resize({ width: 1600 }).webp({ quality: 82 }).toFile(path.join(DESTINO, "servicos.webp"));

  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await prepararPagina(mob);
  const celular = path.join(TMP, "celular.png");
  await mob.screenshot({ path: celular });
  await sharp(celular).resize({ width: 780 }).webp({ quality: 82 }).toFile(path.join(DESTINO, "celular.webp"));

  console.log("ok:", DESTINO, "| brutos em", TMP);
} finally {
  await browser.close();
}
