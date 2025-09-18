using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;

namespace Hackathon.Domain;

public class User : BaseEntity
{
    public required string Email { get; set; }
    public bool IsDevOps { get; set; }

    public User(string email, bool isDevOps)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            Email = email;
            IsDevOps = isDevOps;
        }
    }
}