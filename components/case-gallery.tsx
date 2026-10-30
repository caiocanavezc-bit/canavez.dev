import Image from "next/image";
import type { ProjectMeta } from "@/lib/projects";

// Prints empilhados; a legenda é o próprio alt, para o leitor de tela e para quem vê.
// Prints verticais (celular, PDF) ficam mais estreitos para não ocuparem várias telas.
export function CaseGallery({ images }: { images: ProjectMeta["gallery"] }) {
  if (!images.length) return null;
  return (
    <section aria-labelledby="titulo-telas" className="mt-16">
      <h2
        id="titulo-telas"
        className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text"
      >
        Telas
      </h2>
      <div className="mt-6 space-y-12">
        {images.map((img) => {
          const vertical = img.height > img.width;
          return (
            <figure
              key={img.src}
              data-reveal
              className={vertical ? "mx-auto max-w-[360px]" : undefined}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes={vertical ? "360px" : "(min-width: 800px) 760px, 100vw"}
                className="h-auto w-full rounded-2xl border border-border"
              />
              <figcaption className="mt-3 text-[14px] leading-snug text-muted">
                {img.alt}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
