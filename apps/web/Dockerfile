# Using the same base image as other services
FROM node:22-alpine AS base

# Builder stage for Turborepo pruning
FROM base AS builder
RUN apk update && \ 
apk add --no-cache libc6-compat && \
npm i -g turbo

WORKDIR /app

COPY . .

RUN turbo prune web --docker

# Installer stage for dependencies and build
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat

WORKDIR /app

# Copy pruned files
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

# Copy full source code and build
COPY --from=builder /app/out/full/ .
RUN npx turbo run build

# Nginx production stage
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy Nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default files and copy build
RUN rm -rf ./*
COPY --from=installer --chown=nginx:nginx /app/apps/web/build .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]