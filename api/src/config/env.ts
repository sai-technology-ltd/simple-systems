import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  PAYMENT_PROVIDER: z
    .enum(['LEMON_SQUEEZY', 'PADDLE', 'PAYSTACK'])
    .default('LEMON_SQUEEZY'),
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
  LEMON_SQUEEZY_API_KEY: z.string().optional(),
  LEMON_SQUEEZY_STORE_ID: z.coerce.number().int().optional(),
  LEMON_SQUEEZY_VARIANT_ID: z.coerce.number().int().optional(),
  LEMON_SQUEEZY_WEBHOOK_SECRET: z.string().optional(),
  LEMON_SQUEEZY_DEFAULT_AMOUNT: z.coerce.number().int().optional(),
  LEMON_SQUEEZY_TEST_MODE: z.coerce.boolean().optional(),
  PADDLE_API_KEY: z.string().optional(),
  PADDLE_PRICE_ID: z.string().optional(),
  PADDLE_WEBHOOK_SECRET: z.string().optional(),
  PADDLE_DEFAULT_AMOUNT: z.coerce.number().int().optional(),
  PADDLE_DEFAULT_CURRENCY_CODE: z.string().default('USD'),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_DEFAULT_AMOUNT: z.coerce.number().int().optional(),
  PAYSTACK_DEFAULT_CURRENCY_CODE: z.string().default('NGN'),
  HIRING_APP_URL: z.string().url().default('https://simplehiring.app'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(input: Record<string, unknown>): AppEnv {
  const parsed = envSchema.parse(input);
  return parsed;
}
