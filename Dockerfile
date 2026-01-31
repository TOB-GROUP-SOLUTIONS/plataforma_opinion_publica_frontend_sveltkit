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
WORKDIR /app

# Si tu app lee env vars en runtime, las vas a pasar por docker-compose env_file

# Copiamos lo mínimo necesario para correr adapter-node
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

# adapter-node arranca con esto
CMD ["node", "build/index.js"]