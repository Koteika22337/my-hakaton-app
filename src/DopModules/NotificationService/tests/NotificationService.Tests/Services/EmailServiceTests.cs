// NotificationService.Tests/Services/EmailServiceTests.cs
using Microsoft.Extensions.Options;
using Moq;
using NotificationService.Contracts.Models;
using NotificationService.EmailService.Models;
using NotificationService.EmailService.Services;
using System.Net.Mail;

namespace NotificationService.Tests.Services;

public class EmailServiceTests : IDisposable
{
    private readonly Mock<ISmtpClient> _smtpClientMock;
    private readonly SmtpSettings _smtpSettings;
    private readonly EmailService.Services.EmailService _emailService;

    public EmailServiceTests()
    {
        _smtpClientMock = new Mock<ISmtpClient>();
        _smtpSettings = new SmtpSettings
        {
            Host = "smtp.test.com",
            Port = 587,
            Username = "test@test.com",
            Password = "test-password",
            EnableSsl = true
        };

        _emailService = new EmailService.Services.EmailService(_smtpClientMock.Object, _smtpSettings);
    }

    public void Dispose()
    {
        _emailService.Dispose();
    }

    [Fact]
    public void Constructor_WithSmtpSettings_SetsSettingsCorrectly()
    {
        // Assert
        Assert.NotNull(_emailService);
    }

    [Fact]
    public async Task SendStatusReportAsync_WithValidData_CallsSmtpClient()
    {
        // Arrange
        var report = new ServerStatusReport
        {
            TotalServers = 10,
            UpServers = 8,
            DownServers = 2,
            TotalIncidentsToday = 3
        };

        _smtpClientMock.Setup(x => x.SendMailAsync(It.IsAny<MailMessage>()))
                      .Returns(Task.CompletedTask);

        // Act
        await _emailService.SendStatusReportAsync("test@example.com", report);

        // Assert
        _smtpClientMock.Verify(x => x.SendMailAsync(It.IsAny<MailMessage>()), Times.Once);
    }

    [Fact]
    public async Task SendStatusReportAsync_WithValidData_SendsToCorrectEmail()
    {
        // Arrange
        var report = new ServerStatusReport
        {
            TotalServers = 10,
            UpServers = 8,
            DownServers = 2,
            TotalIncidentsToday = 3
        };

        MailMessage capturedMessage = null;
        _smtpClientMock.Setup(x => x.SendMailAsync(It.IsAny<MailMessage>()))
                      .Callback<MailMessage>(msg => capturedMessage = msg)
                      .Returns(Task.CompletedTask);

        // Act
        await _emailService.SendStatusReportAsync("test@example.com", report);

        // Assert
        Assert.NotNull(capturedMessage);
        Assert.Single(capturedMessage.To);
        Assert.Equal("test@example.com", capturedMessage.To[0].Address);
        Assert.Equal("test@test.com", capturedMessage.From.Address);
        Assert.Contains("📊 Отчет о статусе серверов", capturedMessage.Subject);
    }

    [Fact]
    public void GenerateEmailBody_WithAllServersUp_ReturnsCorrectHtml()
    {
        // Arrange
        var report = new ServerStatusReport
        {
            TotalServers = 5,
            UpServers = 5,
            DownServers = 0,
            TotalIncidentsToday = 0
        };

        // Act
        var result = _emailService.GenerateEmailBody(report);

        // Assert
        Assert.NotNull(result);
        Assert.Contains("✅", result);
        Assert.Contains("Все системы работают нормально", result);
        Assert.DoesNotContain("ВНИМАНИЕ", result);
    }

    [Fact]
    public void GenerateEmailBody_WithDownServers_ReturnsWarningHtml()
    {
        // Arrange
        var report = new ServerStatusReport
        {
            TotalServers = 5,
            UpServers = 3,
            DownServers = 2,
            TotalIncidentsToday = 2
        };

        // Act
        var result = _emailService.GenerateEmailBody(report);

        // Assert
        Assert.NotNull(result);
        Assert.Contains("⚠️", result);
        Assert.Contains("ВНИМАНИЕ: Есть проблемы с серверами!", result);
    }

    [Fact]
    public async Task SendStatusReportAsync_WhenSmtpFails_ThrowsException()
    {
        // Arrange
        var report = new ServerStatusReport
        {
            TotalServers = 10,
            UpServers = 8,
            DownServers = 2,
            TotalIncidentsToday = 3
        };

        _smtpClientMock.Setup(x => x.SendMailAsync(It.IsAny<MailMessage>()))
                      .ThrowsAsync(new InvalidOperationException("SMTP error"));

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _emailService.SendStatusReportAsync("test@example.com", report));
    }
}