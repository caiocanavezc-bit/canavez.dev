import type { ReactNode } from "react";
import { perfil } from "@/content/perfil";
import { type Secao, Sidebar } from "./sidebar";

// Barra lateral fixa à esquerda e uma coluna de leitura de 600px; no celular, barra no topo.
export function Shell({
  variant,
  atual,
  hasProjects,
  children,
}: {
  variant: "home" | "pagina";
  atual?: Secao;
  hasProjects?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="cv-shell">
      <div className="cv-side-slot">
        <Sidebar
          perfil={perfil}
          variant={variant}
          atual={atual}
          hasProjects={hasProjects}
        />
      </div>
      <main id="conteudo" tabIndex={-1} className="cv-main outline-none">
        <div className="cv-col">{children}</div>
      </main>
    </div>
  );
}
