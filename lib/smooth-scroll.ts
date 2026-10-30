// Descida suave no estilo do site da Bergamo & Canavez: 1,25s com ease-in-out cúbico.
// Um novo clique cancela a animação anterior.

export function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
}

let animacaoAtual = 0;

export function scrollSuave(destinoY: number, duracaoMs = 1250): void {
  const id = ++animacaoAtual;
  const inicioY = window.scrollY;
  const fimY = Math.max(0, destinoY);
  const distancia = fimY - inicioY;
  const inicio = performance.now();
  const passo = (agora: number) => {
    if (id !== animacaoAtual) return;
    const p = Math.min((agora - inicio) / duracaoMs, 1);
    window.scrollTo({
      top: inicioY + distancia * easeInOutCubic(p),
      behavior: "instant",
    });
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}
