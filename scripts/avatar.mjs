// Gera public/perfil/avatar.webp a partir da foto bruta em insumos/ (fora do Git).
// Uso: node scripts/avatar.mjs
import sharp from "sharp";

const ORIGEM = "insumos/foto-selfie-3.png"; // 768×1024, selfie de frente (recebida em 2026-11-01)
// Quadrado do topo do cabelo ao pescoço, centrado no rosto: a máscara redonda do site
// esconde os cantos. 660px da origem viram 512px (só redução, nunca ampliação).
const RECORTE = { left: 42, top: 140, width: 660, height: 660 };

await sharp(ORIGEM)
  .extract(RECORTE)
  .resize(512, 512, { kernel: "lanczos3" })
  // Cores mantidas, só uma nitidez leve para compensar a redução.
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 100, smartSubsample: true })
  .toFile("public/perfil/avatar.webp");

console.log("ok public/perfil/avatar.webp");
