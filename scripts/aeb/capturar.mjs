// Captura os prints do AEB Transporte a partir de uma cópia local rodando com dados fictícios.
// Pré-requisitos e passo a passo: scripts/aeb/README.md. Uso: node scripts/aeb/capturar.mjs
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const BASE = process.env.AEB_URL ?? "http://localhost:8765";
const SENHA_ADMIN = process.env.ADMIN_PASSWORD ?? "Demo-Portfolio-2026!";
// Login do representante criado pelo seed_ficticio.py (CPF inventado 900000001 + dígitos verificadores)
const GUIA = { login: "90000000175", senha: "Demo-Portfolio-2026!" };
const ADMIN = { login: "admin", senha: SENHA_ADMIN };
const DESTINO = "public/projetos/aeb-transporte";
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "aeb-prints-"));
fs.mkdirSync(DESTINO, { recursive: true });

const webp = (origem, nome, largura = 1600) =>
  sharp(origem).resize({ width: largura, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(DESTINO, `${nome}.webp`));

async function entrar(page, { login, senha }) {
  await page.goto(BASE);
  await page.fill("#login-input", login);
  await page.fill("#login-form input[type=password]", senha);
  await page.click("#btn-submit-login");
  await page.waitForLoadState("networkidle");
  await fecharAvisos(page);
}

async function fecharAvisos(page) {
  await page.waitForTimeout(800);
  for (const sel of ["#btn-ok-install-app"]) {
    const btn = page.locator(sel);
    if (await btn.isVisible()) await btn.click();
  }
  await page.waitForTimeout(300);
}

async function abrirRotaDemo(page) {
  await page.waitForSelector("#expand-all");
  const valor = await page.$eval("#rota-select", (el) =>
    [...el.options].find((o) => /demo/i.test(o.textContent))?.value,
  );
  if (!valor) throw new Error("Rota Demo não encontrada; rode o seed_ficticio.py antes");
  if (await page.locator("#rota-select").isVisible()) await page.selectOption("#rota-select", valor);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500); // a troca de rota recarrega as paradas
  if ((await page.textContent("#expand-all"))?.match(/Expandir/i)) await page.click("#expand-all");
  await page.waitForTimeout(1200);
}

const browser = await chromium.launch();
try {
  // Chamada vista pelo representante (desktop): capa, thumb e print da chamada
  const desk = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await entrar(desk, GUIA);
  await abrirRotaDemo(desk);
  const chamada = path.join(TMP, "chamada.png");
  await desk.screenshot({ path: chamada, fullPage: true, clip: { x: 0, y: 0, width: 1440, height: 1400 } });
  await webp(chamada, "chamada");
  const capaPng = path.join(TMP, "capa.png");
  await desk.screenshot({ path: capaPng });
  await sharp(capaPng).resize(1600, 1000, { fit: "cover", position: "top" }).webp({ quality: 82 }).toFile(path.join(DESTINO, "capa.webp"));
  await sharp(capaPng).resize(640, 400, { fit: "cover", position: "top" }).webp({ quality: 82 }).toFile(path.join(DESTINO, "thumb.webp"));

  // Admin: gestão de rotas (antes do PDF, para os avisos não cobrirem o modal) e PDF de embarque
  const adm = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, acceptDownloads: true });
  await entrar(adm, ADMIN);
  await abrirRotaDemo(adm);
  await adm.click("#open-rotas-btn");
  await adm.waitForTimeout(800);
  const rotas = path.join(TMP, "rotas.png");
  await adm.screenshot({ path: rotas });
  await webp(rotas, "rotas");
  await adm.click("#close-rotas-modal");

  await adm.getByRole("button", { name: /Gerar Relatório \(PDF\)/i }).click();
  await adm.fill("#pdf-bus-number", "07");
  await adm.click("#btn-confirmar-pdf");
  await adm.waitForSelector("#btn-pdf-viewer-download", { state: "visible", timeout: 30_000 });
  await adm.waitForTimeout(800);
  const [download] = await Promise.all([adm.waitForEvent("download"), adm.click("#btn-pdf-viewer-download")]);
  const pdf = path.join(TMP, "embarque.pdf");
  await download.saveAs(pdf);

  // Página 1 do PDF em PNG, com o PyMuPDF do venv da cópia do AEB
  const py = process.env.AEB_PYTHON;
  if (!py) throw new Error("Defina AEB_PYTHON com o python.exe do venv da cópia do AEB (tem pymupdf)");
  const pdfPng = path.join(TMP, "pdf.png");
  execFileSync(py, ["-I", "-c", "import pymupdf,sys;d=pymupdf.open(sys.argv[1]);d[0].get_pixmap(dpi=150).save(sys.argv[2])", pdf, pdfPng]);
  await webp(pdfPng, "pdf", 1240);

  // Celular: visão do representante (mesma tela de chamada, 390px)
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await entrar(mob, GUIA);
  await abrirRotaDemo(mob);
  await mob.locator(".stop-card").first().scrollIntoViewIfNeeded();
  await mob.evaluate(() => window.scrollBy(0, -80));
  await mob.waitForTimeout(400);
  const celular = path.join(TMP, "celular.png");
  await mob.screenshot({ path: celular });
  await webp(celular, "celular", 780);

  console.log("ok:", DESTINO, "| brutos em", TMP);
} finally {
  await browser.close();
}
