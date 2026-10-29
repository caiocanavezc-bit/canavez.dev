import { type NextRequest, NextResponse } from "next/server";
import { PUBLISHED_SLUGS } from "@/lib/project-slugs";

// Com cacheComponents, um slug desconhecido já teria enviado a casca da página com status 200
// antes do notFound(). Aqui a checagem acontece antes da renderização e o status 404 é real.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!(PUBLISHED_SLUGS as readonly string[]).includes(slug)) {
    return NextResponse.rewrite(new URL("/_case-inexistente", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/projetos/:slug",
};
