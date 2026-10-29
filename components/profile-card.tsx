import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";
import type { Perfil } from "@/content/perfil";
import { whatsappUrl } from "@/lib/links";
import { GithubIcon, LinkedinIcon } from "./icons";

const ICONES_AGORA = { briefcase: Briefcase, "graduation-cap": GraduationCap };
const iconeRede =
  "grid size-11 place-items-center rounded-full border border-border text-muted hover:bg-surface hover:text-text motion-safe:transition";

// Cartão no formato de perfil do X: capa, avatar sobreposto e botão em pílula no lugar do "Seguir".
export function ProfileCard({ perfil }: { perfil: Perfil }) {
  const { contato } = perfil;
  return (
    <div
      data-testid="profile-card"
      className="overflow-hidden rounded-2xl border border-border bg-bg"
    >
      <div aria-hidden="true" className="h-24 bg-[#333639]" />
      <div className="px-5 pb-5">
        <div className="-mt-12 flex items-end justify-between gap-3">
          {perfil.avatar ? (
            <Image
              src={perfil.avatar.src}
              alt={perfil.avatar.alt}
              width={96}
              height={96}
              priority
              className="size-24 rounded-full border-4 border-bg object-cover"
            />
          ) : (
            <span className="grid size-24 place-items-center rounded-full border-4 border-bg bg-surface font-mono text-2xl text-text">
              CC
            </span>
          )}
          {contato.whatsapp && (
            <a
              href={whatsappUrl(contato.whatsapp, contato.mensagemWhatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full bg-button px-5 text-[15px] font-bold text-button-text hover:bg-white motion-safe:transition motion-safe:active:scale-[0.97]"
            >
              Conversar
            </a>
          )}
        </div>

        <p className="mt-3 text-xl font-bold leading-tight text-text">
          {perfil.nome}
        </p>
        <p className="text-[15px] text-muted">{perfil.handle}</p>
        <p className="mt-3 text-[15px] leading-[1.5] text-text">{perfil.bio}</p>

        <p className="mt-3 flex items-center gap-1.5 text-[15px] text-muted">
          <MapPin aria-hidden="true" className="size-4" />
          {perfil.cidade}
        </p>

        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {perfil.agora.map((item, i) => {
            const Icone = ICONES_AGORA[item.icon];
            return (
              <li
                key={item.texto}
                className="flex items-start gap-2.5 text-[14px] leading-[1.45] text-text"
              >
                <span className="relative mt-0.5 shrink-0">
                  <Icone aria-hidden="true" className="size-4 text-muted" />
                  {i === 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-[#00BA7C]"
                    />
                  )}
                </span>
                {item.texto}
              </li>
            );
          })}
        </ul>

        {(contato.github || contato.linkedin) && (
          <div className="mt-4 flex gap-2">
            {contato.github && (
              <a
                href={contato.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub de Caio Canavez"
                className={iconeRede}
              >
                <GithubIcon className="size-[18px]" />
              </a>
            )}
            {contato.linkedin && (
              <a
                href={contato.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Caio Canavez"
                className={iconeRede}
              >
                <LinkedinIcon className="size-[18px]" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
