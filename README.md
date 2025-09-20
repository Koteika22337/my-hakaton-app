
- Кладите C# код в `src/Backend/`
- Кладите C++ или доп. модули в `src/DopModules/`
- Кладите фронтенд в `src/Frontend/`


## Запуск
```bash
cd ~/hakaton
docker-compose up --build
```

## API
- `GET /api/servers` — список хостов.
- `POST /api/servers` — добавление нового хоста в отслеживание.
- `GET /api/servers/{id}` — детали конкретного хоста.
- `PUT /api/servers/{id}` — изменение конфига хоста.
- `DELETE /api/servers/{id}` — удаление хоста из отслеживания.
- `GET /api/servers/{id}/logs` — получение логов хоста.
- `GET /api/servers/{id}/stats` — получение статистики хоста.
- `GET /api/stats/overview` — получение общей статистики для дашборда.
