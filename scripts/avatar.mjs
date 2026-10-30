// Gera public/perfil/avatar.webp a partir da foto bruta em insumos/ (fora do Git).
// Uso: node scripts/avatar.mjs
import sharp from "sharp";

const ORIGEM = "insumos/foto-perfil.png"; // 936×927, retrato já recortado em círculo (centro 462,452; raio 425)
// Quadrado um pouco para dentro do círculo: a máscara redonda do site esconde os cantos
// e a borda escura do print original não aparece.
const RECORTE = { left: 52, top: 42, width: 820, height: 820 };

await sharp(ORIGEM)
  .extract(RECORTE)
  .resize(512, 512, { kernel: "lanczos3" })
  // Foto de estúdio: cores mantidas, só uma nitidez leve para compensar a redução.
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 92, smartSubsample: true })
  .toFile("public/perfil/avatar.webp");

console.log("ok public/perfil/avatar.webp");
