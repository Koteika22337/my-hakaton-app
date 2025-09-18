FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY ./src/Backend/publish/ .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Backend.dll"]
