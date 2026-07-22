# ---- Build stage: compile TypeScript to JavaScript ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Run stage: only what's needed to run ----
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/db/schema.sql ./dist/db/schema.sql
EXPOSE 5000
CMD ["node", "dist/server.js"]