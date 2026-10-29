type Env = Record<string, string | undefined>;

/** URL pública do site, sem barra final. Vira https://canavez.dev quando NEXT_PUBLIC_SITE_URL for definida. */
export function siteUrl(env: Env = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL)
    return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  if (env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
