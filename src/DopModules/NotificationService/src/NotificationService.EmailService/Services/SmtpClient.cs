using System.Net.Mail;
using NotificationService.EmailService.Models;

namespace NotificationService.EmailService.Services;

public class SmtpClientWrapper : ISmtpClient
{
    private readonly SmtpClient _smtpClient;

    public SmtpClientWrapper(SmtpSettings settings)
    {
        _smtpClient = new SmtpClient(settings.Host)
        {
            Port = settings.Port,
            Credentials = new System.Net.NetworkCredential(settings.Username, settings.Password),
            EnableSsl = settings.EnableSsl
        };
    }

    public async Task SendMailAsync(MailMessage message)
    {
        await _smtpClient.SendMailAsync(message);
    }

    public void Dispose()
    {
        _smtpClient?.Dispose();
    }
}