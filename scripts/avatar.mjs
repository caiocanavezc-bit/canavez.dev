// Gera public/perfil/avatar.webp a partir da foto bruta em insumos/ (fora do Git).
// Uso: node scripts/avatar.mjs
import sharp from "sharp";

const ORIGEM = "insumos/foto-espelho-2.png"; // 1086×1448, selfie no espelho (recebida em 2026-10-31)
// Quadrado centrado no rosto, com cabeça, ombros e um pouco de respiro acima: a máscara
// redonda do site esconde os cantos.
const RECORTE = { left: 205, top: 370, width: 420, height: 420 };

await sharp(ORIGEM)
  .extract(RECORTE)
  .resize(512, 512, { kernel: "lanczos3" })
  // Cores mantidas, só uma nitidez leve para compensar a redução.
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 92, smartSubsample: true })
  .toFile("public/perfil/avatar.webp");

console.log("ok public/perfil/avatar.webp");
