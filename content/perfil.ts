// Textos aprovados pelo Caio em 2026-10-29 (fonte: docs/insumos.md).

export type Metric = { valor: string; label: string; fonte: string };
export type Servico = { titulo: string; texto: string; exemploSlug: string };
export type Experiencia = {
  papel: string;
  org: string;
  quando: string;
  /** "atual" pinta o ponto da linha do tempo com a cor de destaque. */
  status: "atual" | "curso" | "passado";
  detalhe?: string;
};
export type Perfil = {
  nome: string;
  papel: string;
  bio: string;
  cidade: string;
  avatar: { src: string; alt: string } | null;
  /** Texto da pílula no topo da página; null esconde a pílula (ex.: sem agenda). */
  disponibilidade: string | null;
  sobre: string[];
  areas: string[];
  metricas: Metric[];
  experiencia: Experiencia[];
  servicos: Servico[];
  contato: {
    whatsapp?: string;
    whatsappExibicao?: string;
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
  papel: "desenvolvedor full-stack",
  bio: "Desenvolvo sistemas web para problemas reais, da prefeitura ao ônibus da faculdade.",
  cidade: "Batatais, SP",
  avatar: { src: "/perfil/avatar.webp", alt: "Caio Canavez" },
  disponibilidade: "disponível para projetos",
  sobre: [
    "Desenvolvo sistemas web para problemas reais, da prefeitura ao ônibus da faculdade.",
    "Estudo Engenharia de Computação na Unaerp e sou estagiário de TI na Prefeitura de Batatais, onde trabalho com dados orçamentários, relatórios e sistemas de RH.",
    "Por fora, já entreguei mais de 10 sistemas web, do controle de embarque de estudantes ao site de um escritório de advocacia.",
  ],
  areas: [
    "sistemas web",
    "sites institucionais",
    "python · fastapi",
    "javascript",
    "banco de dados",
    "relatórios em pdf",
  ],
  metricas: [
    { valor: "+10", label: "sistemas entregues", fonte: "Informado pelo Caio em 2026-10-29" },
    {
      valor: "1 ano",
      label: "de TI no setor público",
      fonte: "LinkedIn: estágio na Prefeitura de Batatais desde out/2025",
    },
  ],
  experiencia: [
    {
      papel: "Estagiário de TI",
      org: "Prefeitura Municipal de Batatais",
      quando: "out 2025 – atual",
      status: "atual",
      detalhe: "dados orçamentários, relatórios e sistemas de RH",
    },
    {
      papel: "Desenvolvedor full-stack",
      org: "projetos sob demanda",
      quando: "em paralelo",
      status: "atual",
      detalhe: "+10 sistemas e sites entregues",
    },
    {
      papel: "Engenharia de Computação",
      org: "Unaerp",
      quando: "ago 2025 – jul 2030",
      status: "curso",
      detalhe: "bacharelado em andamento",
    },
  ],
  servicos: [
    {
      titulo: "Sistemas web sob medida",
      texto: "Painéis, controle de acesso por perfil, relatórios em PDF e banco de dados na nuvem.",
      exemploSlug: "aeb-transporte",
    },
    {
      titulo: "Sites institucionais",
      texto: "Sites rápidos, responsivos e prontos para o Google, para negócios e profissionais.",
      exemploSlug: "bc-consultoria",
    },
  ],
  contato: {
    whatsapp: "5516992647064",
    whatsappExibicao: "(16) 99264-7064",
    email: "caiocanavezc@gmail.com",
    linkedin: "https://www.linkedin.com/in/caio-canavez-b1427b427",
    github: "https://github.com/caiocanavezc-bit",
    instagram: "https://www.instagram.com/canavezz/",
    mensagemWhatsapp: "Olá, Caio! Vi seu portfólio e quero conversar sobre um projeto.",
    assuntoEmail: "Contato pelo portfólio",
  },
};
