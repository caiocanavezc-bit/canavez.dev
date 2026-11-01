import Link from "next/link";
import { Shell } from "@/components/shell";

export default function NotFound() {
  return (
    <Shell variant="pagina">
      <section className="flex flex-col gap-6">
        <span className="cv-label">erro 404</span>
        <h1 className="cv-display">Página não encontrada</h1>
        <div className="cv-prose">
          <p>O endereço pode ter mudado ou estar digitado errado.</p>
        </div>
        <ul className="cv-links">
          <li>
            <Link className="cv-link" href="/">
              <span className="cv-link-title">Ir para o início</span>
              <span className="cv-arrow" aria-hidden="true">
                →
              </span>
              <span className="cv-link-desc">sobre, experiência e contato</span>
            </Link>
          </li>
          <li>
            <Link className="cv-link" href="/#projetos">
              <span className="cv-link-title">Ver projetos</span>
              <span className="cv-arrow" aria-hidden="true">
                →
              </span>
              <span className="cv-link-desc">os cases com telas e detalhes</span>
            </Link>
          </li>
        </ul>
      </section>
    </Shell>
  );
}
