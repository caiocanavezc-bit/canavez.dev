import { Mail } from "lucide-react";
import type { Perfil } from "@/content/perfil";
import { mailtoUrl, whatsappUrl } from "@/lib/links";
import { GithubIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "./icons";

const pilula =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold motion-safe:transition motion-safe:active:scale-[0.97]";
const contorno = `${pilula} border border-border text-text hover:bg-surface`;

export function ContactLinks({ contato }: { contato: Perfil["contato"] }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {contato.whatsapp && (
        <li>
          <a
            href={whatsappUrl(contato.whatsapp, contato.mensagemWhatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pilula} bg-button text-button-text hover:bg-white`}
          >
            <WhatsappIcon className="size-[18px]" />
            WhatsApp
          </a>
        </li>
      )}
      {contato.email && (
        <li>
          <a
            href={mailtoUrl(contato.email, contato.assuntoEmail)}
            className={contorno}
          >
            <Mail aria-hidden="true" className="size-[18px]" />
            E-mail
          </a>
        </li>
      )}
      {contato.linkedin && (
        <li>
          <a
            href={contato.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={contorno}
          >
            <LinkedinIcon className="size-[18px]" />
            LinkedIn
          </a>
        </li>
      )}
      {contato.github && (
        <li>
          <a
            href={contato.github}
            target="_blank"
            rel="noopener noreferrer"
            className={contorno}
          >
            <GithubIcon className="size-[18px]" />
            GitHub
          </a>
        </li>
      )}
      {contato.instagram && (
        <li>
          <a
            href={contato.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={contorno}
          >
            <InstagramIcon className="size-[18px]" />
            Instagram
          </a>
        </li>
      )}
    </ul>
  );
}
