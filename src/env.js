import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL:                     z.string().url(),
    NODE_ENV:                         z.enum(["development", "test", "production"]).default("development"),
    BETTER_AUTH_SECRET:               process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
    BETTER_AUTH_URL:                  z.string().url(),
    BETTER_AUTH_GITHUB_CLIENT_ID:     z.string(),
    BETTER_AUTH_GITHUB_CLIENT_SECRET: z.string(),
    UPLOADTHING_TOKEN:                z.string(),
  },

  client: {},

  runtimeEnv: {
    DATABASE_URL:                     process.env.DATABASE_URL,
    NODE_ENV:                         process.env.NODE_ENV,
    BETTER_AUTH_SECRET:               process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL:                  process.env.BETTER_AUTH_URL,
    BETTER_AUTH_GITHUB_CLIENT_ID:     process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
    BETTER_AUTH_GITHUB_CLIENT_SECRET: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
    UPLOADTHING_TOKEN:                process.env.UPLOADTHING_TOKEN,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});