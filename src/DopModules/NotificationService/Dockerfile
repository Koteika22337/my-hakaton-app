FROM mcr.microsoft.com/dotnet/runtime:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем .csproj файлы — теперь с правильными путями
COPY ["src/DopModules/NotificationService/src/NotificationService.Contracts/NotificationService.Contracts.csproj", "src/NotificationService.Contracts/"]
COPY ["src/DopModules/NotificationService/src/NotificationService.EmailService/NotificationService.EmailService.csproj", "src/NotificationService.EmailService/"]
COPY ["src/DopModules/NotificationService/src/NotificationService.Worker/NotificationService.Worker.csproj", "src/NotificationService.Worker/"]

# Восстанавливаем зависимости
RUN dotnet restore "src/NotificationService.Worker/NotificationService.Worker.csproj"

# Копируем весь код
COPY . .

# Собираем проект
WORKDIR "/src/src/DopModules/NotificationService/src/NotificationService.Worker"
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
