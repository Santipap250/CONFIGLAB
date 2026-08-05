// lib/site.ts
const rawHost =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.NEXT_PUBLIC_SITE_URL;

export const SITE_URL = rawHost
  ? rawHost.startsWith("http")
    ? rawHost
    : `https://${rawHost}`
  : "http://localhost:3000";
