using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace EventZenApi.Models
{
    public class User : IdentityUser
    {
        [Required, StringLength(50)]
        public string? FirstName { get; set; }

        [Required, StringLength(50)]
        public string? LastName { get; set; }
        public ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

/*# Ensure you have the EF Core tools
dotnet tool install --global dotnet-ef

# Create and apply migrations
dotnet ef migrations add InitialIdentitySchema
dotnet ef database update*/