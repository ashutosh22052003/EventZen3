using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EventZenApi.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public DateTime StartDate { get; set; }

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public DateTime EndDate { get; set; }

        [Required, StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal Budget { get; set; }
        public ICollection<Attendee> Attendees { get; set; } = new List<Attendee>();
        public User Organizer { get; set; } // Navigation property

        [Required]
        public string OrganizerId { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
