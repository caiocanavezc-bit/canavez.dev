import Link from "next/link";
import { SectionTitle } from "@/components/section-title";

export default function NotFound() {
  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className="@container mx-auto max-w-[680px] px-4 pt-32 pb-24 outline-none"
    >
      <SectionTitle as="h1" linhas={["Página não", "encontrada"]} />
      <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.6] text-muted">
        O endereço pode ter mudado ou estar digitado errado.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full bg-button px-5 text-[15px] font-semibold text-button-text hover:bg-white"
        >
          Ir para o início
        </Link>
        <Link
          href="/#projetos"
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-[15px] font-semibold text-text hover:bg-surface"
        >
          Ver projetos
        </Link>
      </div>
    </main>
  );
}
