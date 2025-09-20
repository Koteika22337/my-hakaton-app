namespace NotificationService.Contracts.Models;

public class ServerStatusReport
{
    public int TotalServers { get; set; }
    public int UpServers { get; set; }
    public int DownServers { get; set; }
    public int TotalIncidentsToday { get; set; }
}