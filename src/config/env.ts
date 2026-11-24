import { z } from "zod";

function emptyToUndefined(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.url().optional()),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.preprocess(
    emptyToUndefined,
    z.string().optional()
  ),
});

// Harus mereferensikan process.env.NEXT_PUBLIC_* secara eksplisit agar
// ter-inline oleh Next.js di bundle client.
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_KEY: process.env.NEXT_PUBLIC_SITE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
});

