// Gera public/perfil/avatar.webp a partir da foto bruta em insumos/ (fora do Git).
// Uso: node scripts/avatar.mjs
import sharp from "sharp";

const ORIGEM = "insumos/foto-espelho.png"; // 960×1280
const RECORTE = { left: 200, top: 120, width: 560, height: 560 }; // do topo da cabeça até a cintura

await sharp(ORIGEM)
  .extract(RECORTE)
  .modulate({ brightness: 0.8, saturation: 0.55 })
  .resize(512, 512)
  .webp({ quality: 82 })
  .toFile("public/perfil/avatar.webp");

console.log("ok public/perfil/avatar.webp");
