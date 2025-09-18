# 🧰 DevOps Guide для команды

## База данных
- PostgreSQL: `Host=postgres;Database=monitor;Username=postgres;Password=postgres`
- ClickHouse: `Host=clickhouse;Port=8123;Database=monitor;User=default;Password=`

## Переменные окружения
- `SENDGRID_API_KEY` — для отправки уведомлений.
- `ConnectionStrings__Postgres` — строка подключения к PostgreSQL.
- `ConnectionStrings__ClickHouse` — строка подключения к ClickHouse.

## API
- `GET /api/servers` — список серверов.
- `GET /api/servers/{id}` — детали сервера.
- `POST /api/check-all` — **ваша задача — реализовать этот эндпоинт**.

## CI/CD
Пуш в `main` → автотесты → автодеплой.

## Cron
Каждые 5 минут: `POST /api/check-all` → логи в `~/hakaton/cron.log`

## Логи
```bash
docker-compose logs -f backend
docker-compose logs -f cpp-service
tail -f ~/hakaton/cron.log
