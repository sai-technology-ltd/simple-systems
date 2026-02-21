FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json pnpm-lock.yaml ./
RUN pnpm prisma generate
EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main"]
