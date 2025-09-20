using NotificationService.Contracts.Messages;
using NotificationService.Contracts.Models;

namespace NotificationService.Tests.Contracts;

public class NotificationMessageTests
{
    [Fact]
    public void NotificationMessage_DefaultConstructor_SetsDefaultValues()
    {
        // Act
        var message = new NotificationMessage();

        // Assert
        Assert.Equal(string.Empty, message.Email);
        Assert.NotNull(message.Report);
    }

    [Fact]
    public void NotificationMessage_WithValues_SetsPropertiesCorrectly()
    {
        // Arrange
        var report = new ServerStatusReport
        {
            TotalServers = 10,
            UpServers = 8,
            DownServers = 2
        };

        // Act
        var message = new NotificationMessage
        {
            Email = "test@example.com",
            Report = report
        };

        // Assert
        Assert.Equal("test@example.com", message.Email);
        Assert.Equal(10, message.Report.TotalServers);
        Assert.Equal(8, message.Report.UpServers);
        Assert.Equal(2, message.Report.DownServers);
    }
}

public class ServerStatusReportTests
{
    [Fact]
    public void ServerStatusReport_DefaultConstructor_SetsZeroValues()
    {
        // Act
        var report = new ServerStatusReport();

        // Assert
        Assert.Equal(0, report.TotalServers);
        Assert.Equal(0, report.UpServers);
        Assert.Equal(0, report.DownServers);
        Assert.Equal(0, report.TotalIncidentsToday);
    }

    [Fact]
    public void ServerStatusReport_WithValues_SetsPropertiesCorrectly()
    {
        // Act
        var report = new ServerStatusReport
        {
            TotalServers = 15,
            UpServers = 12,
            DownServers = 3,
            TotalIncidentsToday = 5
        };

        // Assert
        Assert.Equal(15, report.TotalServers);
        Assert.Equal(12, report.UpServers);
        Assert.Equal(3, report.DownServers);
        Assert.Equal(5, report.TotalIncidentsToday);
    }
}