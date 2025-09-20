# Этап 1: Сборка
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Этап 2: Запуск
FROM node:18-alpine AS runner
WORKDIR /app

# Копируем только production-зависимости
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем standalone-артефакты
COPY --from=builder /app/.next/standalone/server.js ./server.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN rm -rf ./.next/standalone ./.next/cache

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.js"]