using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventZenApi.Models
{
    public class Attendee
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(100)]
        public string? Name { get; set; }

        [Required, EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? Phone { get; set; }

        [Required]
        public int EventId { get; set; }
        public Event? Event { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}