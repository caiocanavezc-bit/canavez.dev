/** Valor da contagem para um progresso de 0 a 1, com ease-out cúbico. Nunca passa do alvo. */
export function countUpValue(progress: number, target: number): number {
  const p = Math.min(Math.max(progress, 0), 1);
  return Math.round(target * (1 - (1 - p) ** 3));
}
