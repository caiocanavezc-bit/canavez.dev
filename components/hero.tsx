import type { Perfil } from "@/content/perfil";
import { Metric } from "./metric";
import { SectionTitle } from "./section-title";

export function Hero({ perfil }: { perfil: Perfil }) {
  return (
    <section id="inicio" aria-labelledby="titulo-hero">
      {perfil.disponibilidade && (
        <p
          data-testid="selo-disponivel"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 py-1 pr-3.5 pl-3 text-[13px] font-medium text-text"
        >
          <span aria-hidden="true" className="relative flex size-2">
            <span
              data-pulso
              className="absolute inset-0 rounded-full bg-[#00ba7c]"
            />
            <span className="relative size-2 rounded-full bg-[#00ba7c]" />
          </span>
          {perfil.disponibilidade}
        </p>
      )}
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
