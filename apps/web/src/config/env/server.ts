import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NEXTAUTH_SECRET: z.string(),
    PLUNK_API_KEY: z.string(),
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  experimental__runtimeEnv: process.env,
});
