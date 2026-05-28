# syntax=docker/dockerfile:1

# ---- Dependencies ----
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# ---- Development ----
FROM node:20-alpine AS development

WORKDIR /app

ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./

EXPOSE 3001

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3001"]
