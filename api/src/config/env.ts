import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  BASE_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  TOKEN_ENC_KEY: z.string().min(1),
  NOTION_CLIENT_ID: z.string().min(1),
  NOTION_CLIENT_SECRET: z.string().min(1),
  NOTION_REDIRECT_URI: z.string().url(),
  NOTION_VERSION: z.string().default('2022-06-28'),
  ADMIN_API_KEY: z.string().min(1),
  POSTMARK_SERVER_TOKEN: z.string().optional(),
  OAUTH_STATE_SECRET: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_DEFAULT_AMOUNT_MINOR: z.coerce.number().optional(),
  PAYSTACK_DEFAULT_AMOUNT_KOBO: z.coerce.number().optional(), // backward compatibility
  PAYSTACK_CURRENCY: z.string().default('GHS'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(input: Record<string, unknown>): AppEnv {
  const parsed = envSchema.parse(input);
  return parsed;
}
