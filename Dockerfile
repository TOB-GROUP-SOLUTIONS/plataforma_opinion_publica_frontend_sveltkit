# ---------- deps ----------
FROM node:20-bookworm-slim AS deps
ENV TZ=America/Argentina/Buenos_Aires
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# ---------- build ----------
FROM node:20-bookworm-slim AS build
ENV TZ=America/Argentina/Buenos_Aires
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------- runtime ----------
FROM node:20-bookworm-slim AS prod
ENV NODE_ENV=production
ENV TZ=America/Argentina/Buenos_Aires
ENV BODY_SIZE_LIMIT=10485760
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=40s \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "build/index.js"]