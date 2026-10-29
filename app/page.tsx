import { ContactLinks } from "@/components/contact-links";
import { Dock } from "@/components/dock";
import { Hero } from "@/components/hero";
import { ProfileCard } from "@/components/profile-card";
import { ProjectList } from "@/components/project-list";
import { SectionTitle } from "@/components/section-title";
import { ServiceCard } from "@/components/service-card";
import { perfil } from "@/content/perfil";
import { getProjects } from "@/lib/projects";

export default function Home() {
  const projetos = getProjects();

  return (
    <>
      <Dock variant="home" hasProjects={projetos.length > 0} />
      <div className="mx-auto max-w-[1120px] px-4 pt-24 pb-24 lg:grid lg:grid-cols-[340px_minmax(0,680px)] lg:justify-center lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProfileCard perfil={perfil} />
        </aside>

        <main
          id="conteudo"
          tabIndex={-1}
          className="@container mt-16 space-y-28 outline-none lg:mt-0"
        >
          <Hero perfil={perfil} />

          <section id="servicos" aria-labelledby="titulo-servicos">
            <SectionTitle id="titulo-servicos" linhas={["O que", "eu faço"]} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {perfil.servicos.map((s) => (
                <ServiceCard key={s.titulo} servico={s} />
              ))}
            </div>
          </section>

          {projetos.length > 0 && (
            <section id="projetos" aria-labelledby="titulo-projetos">
              <SectionTitle
                id="titulo-projetos"
                linhas={["Projetos", "recentes"]}
              />
              <div className="mt-10">
                <ProjectList projects={projetos} />
              </div>
            </section>
          )}

          <section id="contato" aria-labelledby="titulo-contato">
            <SectionTitle id="titulo-contato" linhas={["Vamos", "conversar"]} />
            <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.6] text-muted">
              Tem um sistema ou site em mente? Me chama no WhatsApp ou por
              e-mail.
            </p>
            <div className="mt-8">
              <ContactLinks contato={perfil.contato} />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
