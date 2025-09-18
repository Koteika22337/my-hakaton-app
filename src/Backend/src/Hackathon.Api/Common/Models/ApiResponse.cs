namespace Hackathon.Api.Models;

public abstract class ApiResponse
{
    public string? Message { get; init; }
    public int? StatusCode { get; init; }
}