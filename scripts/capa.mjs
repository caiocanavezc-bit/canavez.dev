// Gera public/perfil/capa.svg: curvas de nível de um relevo inventado (não é mapa real),
// com um ponto azul no alto do morro. Determinístico pela SEMENTE.
// Uso: node scripts/capa.mjs
import fs from "node:fs";

const L = 1080;
const A = 300;
const PASSO = 6; // resolução da grade (unidades do viewBox)
const NIVEIS = 15;
const SEMENTE = 20251029;

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Ruído de valor suave em reticulado, várias oitavas.
const aleatorio = mulberry32(SEMENTE);
const TAM = 64;
const reticulado = Array.from({ length: TAM * TAM }, aleatorio);
const suave = (t) => t * t * (3 - 2 * t);
function ruido(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const v = (i, j) => reticulado[((j & (TAM - 1)) * TAM + (i & (TAM - 1))) | 0];
  const sx = suave(x - xi);
  const sy = suave(y - yi);
  const topo = v(xi, yi) * (1 - sx) + v(xi + 1, yi) * sx;
  const base = v(xi, yi + 1) * (1 - sx) + v(xi + 1, yi + 1) * sx;
  return topo * (1 - sy) + base * sy;
}

// Morro principal à direita (longe do avatar, que cobre o canto inferior esquerdo).
const PICO = { x: 0.74 * L, y: 0.46 * A };
function altura(x, y) {
  let n = 0;
  for (const [f, p] of [
    [1 / 260, 1],
    [1 / 110, 0.45],
    [1 / 50, 0.15],
  ]) {
    n += ruido(x * f, y * f) * p;
  }
  const morro = Math.exp(
    -(((x - PICO.x) / 230) ** 2 + ((y - PICO.y) / 150) ** 2),
  );
  const colina = Math.exp(
    -(((x - 0.3 * L) / 200) ** 2 + ((y + 0.1 * A) / 120) ** 2),
  );
  return n + morro * 1.5 + colina * 0.7;
}

const colunas = Math.ceil(L / PASSO) + 1;
const linhas = Math.ceil(A / PASSO) + 1;
const campo = [];
let min = Infinity;
let max = -Infinity;
for (let j = 0; j < linhas; j++) {
  for (let i = 0; i < colunas; i++) {
    const h = altura(i * PASSO, j * PASSO);
    campo.push(h);
    min = Math.min(min, h);
    max = Math.max(max, h);
  }
}
const h = (i, j) => campo[j * colunas + i];

// Marching squares: segmentos por célula; os pares de arestas saem da tabela de casos.
const CASOS = {
  1: [["e", "b"]],
  2: [["b", "d"]],
  3: [["e", "d"]],
  4: [["t", "d"]],
  5: [
    ["t", "d"],
    ["e", "b"],
  ],
  6: [["t", "b"]],
  7: [["e", "t"]],
  8: [["e", "t"]],
  9: [["t", "b"]],
  10: [
    ["e", "t"],
    ["b", "d"],
  ],
  11: [["t", "d"]],
  12: [["e", "d"]],
  13: [["b", "d"]],
  14: [["e", "b"]],
};
function segmentos(limiar) {
  const out = [];
  const lerp = (v0, v1) => (limiar - v0) / (v1 - v0);
  for (let j = 0; j < linhas - 1; j++) {
    for (let i = 0; i < colunas - 1; i++) {
      const a = h(i, j),
        b = h(i + 1, j),
        c = h(i + 1, j + 1),
        d = h(i, j + 1);
      const caso =
        (a > limiar) * 8 + (b > limiar) * 4 + (c > limiar) * 2 + (d > limiar);
      if (!CASOS[caso]) continue;
      const x = i * PASSO,
        y = j * PASSO;
      const ponto = {
        t: [x + lerp(a, b) * PASSO, y],
        d: [x + PASSO, y + lerp(b, c) * PASSO],
        b: [x + lerp(d, c) * PASSO, y + PASSO],
        e: [x, y + lerp(a, d) * PASSO],
      };
      for (const [p, q] of CASOS[caso]) out.push([ponto[p], ponto[q]]);
    }
  }
  return out;
}

// Encadeia segmentos que se tocam em polilinhas (arquivo bem menor que segmentos soltos).
const chave = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;
function polilinhas(segs) {
  const porPonto = new Map();
  segs.forEach((s, k) => {
    for (const p of s) {
      const c = chave(p);
      if (!porPonto.has(c)) porPonto.set(c, []);
      porPonto.get(c).push(k);
    }
  });
  const usado = new Set();
  const vizinho = (p) =>
    (porPonto.get(chave(p)) ?? []).find((k) => !usado.has(k));
  const estender = (linha) => {
    for (
      let k = vizinho(linha.at(-1));
      k !== undefined;
      k = vizinho(linha.at(-1))
    ) {
      usado.add(k);
      const [p, q] = segs[k];
      linha.push(chave(p) === chave(linha.at(-1)) ? q : p);
    }
  };
  const resultado = [];
  segs.forEach((s, k) => {
    if (usado.has(k)) return;
    usado.add(k);
    const linha = [...s];
    estender(linha);
    linha.reverse();
    estender(linha);
    resultado.push(linha);
  });
  return resultado;
}

const fmt = (n) => String(Math.round(n * 10) / 10);
const caminho = (linhas) =>
  linhas
    .filter((l) => l.length > 3)
    .map((l) => "M" + l.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join("L"))
    .join("");

let finas = "";
let mestras = "";
for (let n = 1; n <= NIVEIS; n++) {
  const d = caminho(
    polilinhas(segmentos(min + ((max - min) * n) / (NIVEIS + 1))),
  );
  // a cada 4 níveis, uma curva mestra mais forte, como nos mapas topográficos
  if (n % 4 === 0) mestras += d;
  else finas += d;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${A}" preserveAspectRatio="xMidYMid slice">
<rect width="${L}" height="${A}" fill="#202327"/>
<g fill="none" stroke="#e7e9ea" stroke-linejoin="round" vector-effect="non-scaling-stroke">
<path d="${finas}" stroke-opacity=".11" stroke-width="1"/>
<path d="${mestras}" stroke-opacity=".24" stroke-width="1.4"/>
</g>
<circle cx="${fmt(PICO.x)}" cy="${fmt(PICO.y)}" r="11" fill="none" stroke="#1d9bf0" stroke-opacity=".4" stroke-width="1.5"/>
<circle cx="${fmt(PICO.x)}" cy="${fmt(PICO.y)}" r="4" fill="#1d9bf0"/>
</svg>
`;

fs.writeFileSync("public/perfil/capa.svg", svg);
console.log(`ok public/perfil/capa.svg (${(svg.length / 1024).toFixed(1)} KB)`);
