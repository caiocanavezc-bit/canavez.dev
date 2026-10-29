import type { Perfil } from "@/content/perfil";
import { Metric } from "./metric";
import { SectionTitle } from "./section-title";

export function Hero({ perfil }: { perfil: Perfil }) {
  return (
    <section id="inicio" aria-labelledby="titulo-hero">
      <SectionTitle id="titulo-hero" as="h1" linhas={perfil.heroTitulo} />
      <p className="mt-8 max-w-[62ch] text-[17px] leading-[1.6] text-muted">
        {perfil.heroParagrafo}
      </p>
      <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
        {perfil.metricas.map((m) => (
          <Metric key={m.label} metric={m} />
        ))}
      </div>
    </section>
  );
}
