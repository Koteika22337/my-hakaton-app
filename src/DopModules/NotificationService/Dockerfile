# NotificationService.Worker/Dockerfile
FROM mcr.microsoft.com/dotnet/runtime:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем все проекты
COPY ["src/NotificationService.Contracts/NotificationService.Contracts.csproj", "NotificationService.Contracts/"]
COPY ["src/NotificationService.EmailService/NotificationService.EmailService.csproj", "NotificationService.EmailService/"]
COPY ["src/NotificationService.Worker/NotificationService.Worker.csproj", "NotificationService.Worker/"]

# Восстанавливаем зависимости
RUN dotnet restore "src/NotificationService.Worker/NotificationService.Worker.csproj"

# Копируем весь исходный код
COPY . .

# Собираем проект
WORKDIR "/src/NotificationService.Worker"
RUN dotnet build "NotificationService.Worker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NotificationService.Worker.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Создаем пользователя для безопасности
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

ENTRYPOINT ["dotnet", "NotificationService.Worker.dll"]