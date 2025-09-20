# Этап 1: Сборка
FROM node:18-alpine AS builder
WORKDIR /app

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# Копируем зависимости
COPY src/Frontend/package*.json ./
COPY src/Frontend/pnpm-lock.yaml ./

# Проверяем, что файлы скопировались
RUN ls -la

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем ТОЛЬКО содержимое src/Frontend/
COPY src/Frontend/. .

# Проверяем структуру
RUN ls -la

# Собираем проект
RUN pnpm run build

# Этап 2: Запуск
FROM node:18-alpine AS runner
WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем зависимости (только production)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Устанавливаем production-зависимости и очищаем кэш (без --force)
RUN pnpm install --prod --frozen-lockfile && pnpm cache clear

# Копируем артефакты сборки
COPY --from=builder /app/.next/standalone/server.js ./server.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Очищаем кэш
RUN rm -rf ./.next/standalone ./.next/cache

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.js"]
