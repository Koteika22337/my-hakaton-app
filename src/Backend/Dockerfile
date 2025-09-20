FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем ВСЁ содержимое папки src/Backend/ в /src/ внутри контейнера
COPY ./src/Backend/. .

# Восстанавливаем зависимости
RUN dotnet restore "Hackathon.sln"

# Собираем и публикуем основной проект
WORKDIR "/src/src/Hackathon.Api"
RUN dotnet publish "Hackathon.Api.csproj" -c Release -o /app/publish

# Этап запуска
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Hackathon.Api.dll"]
