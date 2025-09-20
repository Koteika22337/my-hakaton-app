using System.Text;
using System.Text.Json;
using NotificationService.Contracts.Messages;
using NotificationService.Contracts.Models;
using RabbitMQ.Client;

namespace NotificationService.Tests;

public class TestMessageSender
{
    public static async Task SendTestMessage()
    {
        var factory = new ConnectionFactory
        {
            HostName = "localhost",
            Port = 5672,
            UserName = "guest",
            Password = "guest"
        };

        using var connection = await factory.CreateConnectionAsync();
        using var channel = await connection.CreateChannelAsync();

        // Declare exchange (должно совпадать с worker)
        await channel.ExchangeDeclareAsync(
            exchange: "notifications_exchange",
            type: ExchangeType.Direct,
            durable: true);

        // Создаем тестовое сообщение
        var message = new NotificationMessage
        {
            Email = "test@example.com",
            Report = new ServerStatusReport
            {
                TotalServers = 10,
                UpServers = 8,
                DownServers = 2,
                TotalIncidentsToday = 3
            }
        };

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

        await channel.BasicPublishAsync(
            exchange: "notifications_exchange",
            routingKey: "notification.status_report",
            body: body);

        Console.WriteLine("Test message sent to RabbitMQ");
    }
}