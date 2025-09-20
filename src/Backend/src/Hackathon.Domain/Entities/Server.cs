namespace Hackathon.Domain;

public class Server : BaseEntity
{
    public string? Name { get; set; }
    public required string Host { get; set; }
    public required string Port { get; set; }

    public Server(string name, string port, string host)
    {
        Name = name;
        if (string.IsNullOrWhiteSpace(port))
            throw new ArgumentException("Port cannot be null or empty", nameof(port));
        if (string.IsNullOrWhiteSpace(host))
            throw new ArgumentException("Host cannot be null or empty", nameof(host));

        Port = port;
        Host = host;
    }
}
