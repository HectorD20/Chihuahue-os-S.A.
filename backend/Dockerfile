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
ENV CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_INTERVAL=1000

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.build.json nest-cli.json webpack.config.js ./

EXPOSE 3000

# Webpack + tsconfig-paths keep @/* aliases working with bind-mounted live reload.
CMD ["npm", "run", "start:dev"]
