using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using NotificationService.Contracts.Messages;
using NotificationService.Contracts.Models;

Console.WriteLine("🚀 Notification Service Test Sender");
Console.WriteLine("Press any key to send test message...");
Console.ReadKey();

try
{
    SendTestMessage();
    Console.WriteLine("✅ Test message sent successfully!");
    Console.WriteLine("📧 Check MailDev at: http://localhost:1080");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error: {ex.Message}");
}

Console.WriteLine("Press any key to exit...");
Console.ReadKey();

void SendTestMessage()
{
    var factory = new ConnectionFactory
    {
        HostName = "localhost",
        Port = 5672,
        UserName = "guest",
        Password = "guest"
    };

    using var connection = factory.CreateConnection();
    using var channel = connection.CreateModel();

    // Declare exchange (должно совпадать с worker)
    channel.ExchangeDeclare(
        exchange: "notifications_exchange",
        type: ExchangeType.Direct,
        durable: true);

    // Declare queue (должно совпадать с worker)
    channel.QueueDeclare(
        queue: "notifications_queue",
        durable: true,
        exclusive: false,
        autoDelete: false);

    // Bind queue to exchange
    channel.QueueBind(
        queue: "notifications_queue",
        exchange: "notifications_exchange",
        routingKey: "notification.status_report");

    // Создаем тестовое сообщение
    var message = new NotificationMessage
    {
        Email = "admin@company.com",
        Report = new ServerStatusReport
        {
            TotalServers = 15,
            UpServers = 12,
            DownServers = 3,
            TotalIncidentsToday = 5
        }
    };

    var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

    channel.BasicPublish(
        exchange: "notifications_exchange",
        routingKey: "notification.status_report",
        basicProperties: null,
        body: body);

    Console.WriteLine($"📨 Sent message to RabbitMQ:");
    Console.WriteLine($"   Email: {message.Email}");
    Console.WriteLine($"   Total Servers: {message.Report.TotalServers}");
    Console.WriteLine($"   Up Servers: {message.Report.UpServers}");
    Console.WriteLine($"   Down Servers: {message.Report.DownServers}");
    Console.WriteLine($"   Incidents Today: {message.Report.TotalIncidentsToday}");
}