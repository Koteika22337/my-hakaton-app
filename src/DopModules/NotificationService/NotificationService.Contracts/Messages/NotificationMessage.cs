using NotificationService.Contracts.Models;

namespace NotificationService.Contracts.Messages;

public class NotificationMessage
{
    public string Email { get; set; } = string.Empty;
    public ServerStatusReport Report { get; set; } = new();
}