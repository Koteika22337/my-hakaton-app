using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using NotificationService.Contracts.Messages;
using NotificationService.Worker.Models;
using NotificationService.EmailService.Models;

namespace NotificationService.Worker.Workers;

public class NotificationWorker : BackgroundService
{
    private readonly ILogger<NotificationWorker> _logger;
    private readonly RabbitMqSettings _rabbitMqSettings;
    private readonly SmtpSettings _smtpSettings;
    private IConnection _connection;
    private IModel _channel;

    public NotificationWorker(
        ILogger<NotificationWorker> logger,
        IOptions<RabbitMqSettings> rabbitMqSettings,
        IOptions<SmtpSettings> smtpSettings)
    {
        _logger = logger;
        _rabbitMqSettings = rabbitMqSettings.Value;
        _smtpSettings = smtpSettings.Value;
    }

    public override Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting Notification Worker...");
        
        var factory = new ConnectionFactory
        {
            HostName = _rabbitMqSettings.HostName,
            Port = _rabbitMqSettings.Port,
            UserName = _rabbitMqSettings.UserName,
            Password = _rabbitMqSettings.Password
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        // Declare exchange and queue
        _channel.ExchangeDeclare(
            exchange: _rabbitMqSettings.ExchangeName,
            type: ExchangeType.Direct,
            durable: true);

        _channel.QueueDeclare(
            queue: _rabbitMqSettings.QueueName,
            durable: true,
            exclusive: false,
            autoDelete: false);

        _channel.QueueBind(
            queue: _rabbitMqSettings.QueueName,
            exchange: _rabbitMqSettings.ExchangeName,
            routingKey: _rabbitMqSettings.RoutingKey);

        _logger.LogInformation("RabbitMQ connection established");
        _logger.LogInformation("Listening on queue: {QueueName}", _rabbitMqSettings.QueueName);

        return base.StartAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var consumer = new EventingBasicConsumer(_channel);
        
        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            
            try
            {
                _logger.LogDebug("Received message: {Message}", message);
                
                var notification = JsonSerializer.Deserialize<NotificationMessage>(message);
                
                if (notification != null)
                {
                    _logger.LogInformation("Processing notification for email: {Email}", notification.Email);
                    
                    // Создаем экземпляр EmailService и отправляем email
                    var emailService = new EmailService.Services.EmailService(_smtpSettings);
                    await emailService.SendStatusReportAsync(notification.Email, notification.Report);
                    
                    _logger.LogInformation("Email sent successfully to: {Email}", notification.Email);
                    
                    // Подтверждаем обработку сообщения
                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                else
                {
                    _logger.LogWarning("Failed to deserialize notification message");
                    _channel.BasicReject(ea.DeliveryTag, false);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message: {Message}", message);
                // Отклоняем сообщение без повторной обработки
                _channel.BasicReject(ea.DeliveryTag, false);
            }
        };

        // Начинаем слушать очередь
        _channel.BasicConsume(
            queue: _rabbitMqSettings.QueueName,
            autoAck: false, // Ручное подтверждение
            consumer: consumer);

        _logger.LogInformation("Worker started listening for messages...");

        // Бесконечный цикл ожидания
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Stopping Notification Worker...");
        
        _channel?.Close();
        _connection?.Close();
        
        _logger.LogInformation("RabbitMQ connection closed");
        
        await base.StopAsync(cancellationToken);
    }
}