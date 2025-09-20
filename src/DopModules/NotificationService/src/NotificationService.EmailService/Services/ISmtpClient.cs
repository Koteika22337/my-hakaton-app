using System.Net.Mail;

namespace NotificationService.EmailService.Services;

public interface ISmtpClient
{
    Task SendMailAsync(MailMessage message);
}