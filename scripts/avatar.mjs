// Gera public/perfil/avatar.webp a partir da foto bruta em insumos/ (fora do Git).
// Uso: node scripts/avatar.mjs
import sharp from "sharp";

const ORIGEM = "insumos/foto-espelho.png"; // 960×1280
// Cabeça e tronco: com o corte até a cintura a pessoa ficava pequena no círculo de 96px.
const RECORTE = { left: 290, top: 150, width: 420, height: 420 };

await sharp(ORIGEM)
  .extract(RECORTE)
  .resize(512, 512, { kernel: "lanczos3" })
  // Cores naturais com um pouco de contraste e nitidez (escurecer e dessaturar deixava a foto "lamacenta").
  .modulate({ brightness: 1.02, saturation: 0.9 })
  .linear(1.08, -8)
  .sharpen({ sigma: 0.8 })
  .webp({ quality: 90 })
  .toFile("public/perfil/avatar.webp");

console.log("ok public/perfil/avatar.webp");
