const rawHost =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "obixconfiglab.vercel.app";

export const SITE_URL = rawHost.startsWith("http")
  ? rawHost
  : `https://${rawHost}`;
