// Gera public/perfil/avatar.webp a partir da foto bruta em insumos/ (fora do Git).
// Uso: node scripts/avatar.mjs
import sharp from "sharp";

const ORIGEM = "insumos/foto-selfie-3.png"; // 768×1024, selfie de frente (recebida em 2026-11-01)
// Maior quadrado possível (largura inteira da foto, sem zoom), com o rosto no centro: a máscara redonda do site
// esconde os cantos. 768px da origem viram 512px (só redução, nunca ampliação).
const RECORTE = { left: 0, top: 100, width: 768, height: 768 };

await sharp(ORIGEM)
  .extract(RECORTE)
  .resize(512, 512, { kernel: "lanczos3" })
  // Cores mantidas, só uma nitidez leve para compensar a redução.
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 100, smartSubsample: true })
  .toFile("public/perfil/avatar.webp");

console.log("ok public/perfil/avatar.webp");
