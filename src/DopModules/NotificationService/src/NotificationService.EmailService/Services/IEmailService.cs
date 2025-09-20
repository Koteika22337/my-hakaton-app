using NotificationService.Contracts.Models;

namespace NotificationService.EmailService.Services;

public interface IEmailService
{
    Task SendStatusReportAsync(
        string email,
        ServerStatusReport report,
        CancellationToken cancellationToken = default
    );
}