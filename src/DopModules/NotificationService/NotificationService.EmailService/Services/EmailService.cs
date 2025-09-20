using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using NotificationService.Contracts.Models;
using NotificationService.EmailService.Models;

namespace NotificationService.EmailService.Services;

public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtpSettings;

    public EmailService(SmtpSettings smtpSettings)
    {
        _smtpSettings = smtpSettings;
    }

    public EmailService(IOptions<SmtpSettings> smtpSettings)
    {
        _smtpSettings = smtpSettings.Value;
    }

    public async Task SendStatusReportAsync(string email, ServerStatusReport report)
    {
        using var smtpClient = new SmtpClient(_smtpSettings.Host)
        {
            Port = _smtpSettings.Port,
            Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password),
            EnableSsl = _smtpSettings.EnableSsl
        };

        var subject = "📊 Отчет о статусе серверов";
        var body = GenerateEmailBody(report);

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_smtpSettings.Username),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        
        mailMessage.To.Add(email);

        await smtpClient.SendMailAsync(mailMessage);
    }

    private string GenerateEmailBody(ServerStatusReport report)
    {
        var statusEmoji = report.DownServers == 0 ? "✅" : "⚠️";
        
        return $@"
            <h2>{statusEmoji} Отчет о статусе серверов</h2>
            <p><strong>Общее количество серверов:</strong> {report.TotalServers}</p>
            <p><strong>Работающих серверов:</strong> {report.UpServers} ✅</p>
            <p><strong>Не работающих серверов:</strong> {report.DownServers} ❌</p>
            <p><strong>Инцидентов за сегодня:</strong> {report.TotalIncidentsToday}</p>
            
            {(report.DownServers > 0 ? 
                "<p style='color: red;'><strong>ВНИМАНИЕ: Есть проблемы с серверами!</strong></p>" : 
                "<p style='color: green;'><strong>Все системы работают нормально</strong></p>")}
            
            <br/>
            <p><em>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</em></p>
        ";
    }
}