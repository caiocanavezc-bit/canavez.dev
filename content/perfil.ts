// Textos aprovados pelo Caio em 2026-10-29 (fonte: docs/insumos.md).

export type Metric = { value: number; prefix?: string; suffix?: string; label: string; fonte: string };
export type Servico = { icon: "layout-dashboard" | "globe"; titulo: string; texto: string; exemploSlug: string };
export type AgoraItem = { icon: "briefcase" | "graduation-cap"; texto: string };
export type Perfil = {
  nome: string;
  handle: string;
  bio: string;
  cidade: string;
  avatar: { src: string; alt: string } | null;
  /** Texto do selo no topo do hero; null esconde o selo (ex.: sem agenda). */
  disponibilidade: string | null;
  agora: AgoraItem[];
  heroTitulo: [string, string];
  heroParagrafo: string;
  metricas: Metric[];
  servicos: Servico[];
  contato: {
    whatsapp?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    mensagemWhatsapp: string;
    assuntoEmail: string;
  };
};

export const perfil: Perfil = {
  nome: "Caio Canavez",
  handle: "@canavez",
  bio: "Desenvolvo sistemas web para problemas reais, da prefeitura ao ônibus da faculdade.",
  cidade: "Batatais, SP",
  avatar: { src: "/perfil/avatar.webp", alt: "Caio Canavez" },
  disponibilidade: "Disponível para projetos",
  agora: [
    { icon: "briefcase", texto: "Estagiário de TI · Prefeitura de Batatais" },
    { icon: "graduation-cap", texto: "Engenharia de Computação · Unaerp · 2025–2030" },
  ],
  heroTitulo: ["Desenvolvedor", "full-stack"],
  heroParagrafo:
    "Estudo Engenharia de Computação na Unaerp e sou estagiário de TI na Prefeitura de Batatais, onde trabalho com dados orçamentários, relatórios e sistemas de RH. Por fora, já entreguei mais de 10 sistemas web, do controle de embarque de estudantes ao site de um escritório de advocacia.",
  metricas: [
    { value: 10, prefix: "+", label: "sistemas entregues", fonte: "Informado pelo Caio em 2026-10-29" },
    {
      value: 1,
      suffix: " ano",
      label: "de TI no setor público",
      fonte: "LinkedIn: estágio na Prefeitura de Batatais desde out/2025",
    },
  ],
  servicos: [
    {
      icon: "layout-dashboard",
      titulo: "Sistemas web sob medida",
      texto: "Painéis, controle de acesso por perfil, relatórios em PDF e banco de dados na nuvem.",
      exemploSlug: "aeb-transporte",
    },
    {
      icon: "globe",
      titulo: "Sites institucionais",
      texto: "Sites rápidos, responsivos e prontos para o Google, para negócios e profissionais.",
      exemploSlug: "bc-consultoria",
    },
  ],
  contato: {
    whatsapp: "5516992647064",
    email: "caiocanavezc@gmail.com",
    linkedin: "https://www.linkedin.com/in/caio-canavez-b1427b427",
    github: "https://github.com/caiocanavezc-bit",
    instagram: "https://www.instagram.com/canavezz/",
    mensagemWhatsapp: "Olá, Caio! Vi seu portfólio e quero conversar sobre um projeto.",
    assuntoEmail: "Contato pelo portfólio",
  },
};
