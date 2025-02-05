FROM node:22-alpine AS base

FROM base AS builder

RUN apk update && \
apk add --no-cache libc6-compat && \
npm i -g turbo
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune api --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci
COPY --from=builder /app/out/full/ .

RUN npx turbo run build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/package.json

CMD ["node", "apps/api/dist/main.js"]