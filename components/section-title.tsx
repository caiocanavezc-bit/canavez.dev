type Props = { id?: string; linhas: [string, string]; as?: "h1" | "h2" };

// Título em duas linhas: a primeira em branco, a segunda em cinza.
// Dimensionado pela largura da coluna (cqi) para "Desenvolvedor" nunca estourar o container.
export function SectionTitle({ id, linhas, as: Tag = "h2" }: Props) {
  const tamanho = Tag === "h1" ? "text-[clamp(32px,12.5cqi,80px)]" : "text-[clamp(30px,9cqi,60px)]";
  return (
    <Tag id={id} className={`${tamanho} font-bold leading-[0.95] tracking-[-0.03em]`}>
      <span className="block text-text">{linhas[0]}</span>
      <span className="block text-title-dim">{linhas[1]}</span>
    </Tag>
  );
}
