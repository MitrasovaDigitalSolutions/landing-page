import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_SITE_KEY: z.string().min(1),
});

// Harus mereferensikan process.env.NEXT_PUBLIC_* secara eksplisit agar
// ter-inline oleh Next.js di bundle client.
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_KEY: process.env.NEXT_PUBLIC_SITE_KEY,
});

