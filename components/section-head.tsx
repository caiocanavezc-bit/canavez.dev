export function SectionHead({
  id,
  titulo,
  aside,
}: {
  id: string;
  titulo: string;
  aside?: string;
}) {
  return (
    <div className="cv-section-head">
      <h2 id={id}>{titulo}</h2>
      {aside && <span className="cv-aside">{aside}</span>}
    </div>
  );
}
